
import { NextRequest, NextResponse } from 'next/server';
import { getPages, postPhoto, postVideo, getScheduledPosts } from '@/lib/facebook';

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');
    const pageId = searchParams.get('pageId');
    const accessToken = request.headers.get('x-access-token');

    if (!accessToken) {
        return NextResponse.json({ error: 'Access Token Required' }, { status: 401 });
    }

    try {
        if (action === 'pages') {
            const pages = await getPages(accessToken);
            return NextResponse.json({ pages });
        }

        if (action === 'scheduled' && pageId) {
            const posts = await getScheduledPosts(accessToken, pageId);
            return NextResponse.json({ posts });
        }

        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}


export async function POST(request: NextRequest) {
    try {
        // Check Content-Type to decide how to parse
        const contentType = request.headers.get('content-type') || '';

        let action, pageId, fbPageId, message, scheduledTime, photoData, fbPageToken, publishToFb;
        let accessToken = request.headers.get('x-access-token');
        let formData;

        if (contentType.includes('multipart/form-data')) {
            formData = await request.formData();
            action = formData.get('action');
            pageId = formData.get('pageId') as string;
            fbPageId = formData.get('fbPageId') as string;
            fbPageToken = formData.get('fbPageToken') as string;
            publishToFb = formData.get('publishToFb') === 'true'; // Checkbox
            message = formData.get('message') as string;
            scheduledTime = formData.get('scheduledTime') as string;
            const photoFile = formData.get('photoData');
            const videoFile = formData.get('videoData');
            photoData = photoFile || videoFile;
            if (!accessToken) accessToken = formData.get('accessToken') as string;
        } else {
            // JSON Fallback
            const body = await request.json();
            action = body.action;
            pageId = body.pageId;
            fbPageId = body.fbPageId;
            fbPageToken = body.fbPageToken;
            publishToFb = body.publishToFb;
            message = body.message;
            scheduledTime = body.scheduledTime;
            photoData = body.photoUrl;
            if (!accessToken) accessToken = body.accessToken;
        }

        if (!accessToken) {
            return NextResponse.json({ error: 'Access Token Required' }, { status: 401 });
        }

        // Convert File to Buffer if needed
        let photoDataForApi = photoData;
        if (photoData && typeof photoData === 'object' && 'arrayBuffer' in photoData) {
            const arrayBuffer = await (photoData as any).arrayBuffer();
            photoDataForApi = Buffer.from(arrayBuffer);
            console.log(`[Route.ts] Converted File to Buffer, size: ${(photoData as any).size} bytes => ${(photoDataForApi as Buffer).length} bytes`);
        } else if (photoData) {
            console.log(`[Route.ts] photoData type: ${typeof photoData}, instanceof Buffer: ${Buffer.isBuffer(photoData)}, has arrayBuffer: ${'arrayBuffer' in (photoData as any)}`);
        }

        if (action === 'post_photo') {
            if (!pageId || !photoDataForApi) {
                return NextResponse.json({ error: 'Missing required fields (pageId or image)' }, { status: 400 });
            }

            const date = scheduledTime ? new Date(scheduledTime) : undefined;

            // We pass pageId as target (IG ID) and fbPageId as backing page, AND fbPageToken, AND publishToFb
            const result = await postPhoto(accessToken, pageId, photoDataForApi as any, message, date, fbPageId, fbPageToken, publishToFb);
            return NextResponse.json({ success: true, result });
        }

        if (action === 'post_video') {
            if (!pageId || !photoDataForApi) {
                return NextResponse.json({ error: 'Missing required fields (pageId or video)' }, { status: 400 });
            }

            const date = scheduledTime ? new Date(scheduledTime) : undefined;

            // We pass pageId as target (IG ID) and fbPageId as backing page, AND fbPageToken, AND publishToFb
            const result = await postVideo(accessToken, pageId, photoDataForApi as any, message, date, fbPageId, fbPageToken, publishToFb);
            return NextResponse.json({ success: true, result });
        }

        // AI Caption Generation Mock
        if (action === 'generate_caption') {
            const captions = [
                "Check out this amazing update! ✨ #New #Update",
                "Something special coming your way... 🚀 #ComingSoon",
                "Capturing the moment clearly. 📸 #Photography",
                "Innovation at its finest. 💡 #Innovation",
                "Just for you! ❤️ #Community"
            ];
            const randomCaption = captions[Math.floor(Math.random() * captions.length)];
            return NextResponse.json({ caption: randomCaption });
        }

        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    } catch (error: any) {
        console.error(error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
