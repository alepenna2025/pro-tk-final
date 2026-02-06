import axios from 'axios';

export const FB_API_VERSION = 'v18.0';

export interface InstagramAccount {
    id: string; // IG Business ID if linked, else Page ID
    name: string;
    username?: string;
    has_ig: boolean;
    page_id: string;
    access_token?: string; // Page Access Token
}

/**
 * Get list of Instagram Business Accounts linked to user's pages
 */
export async function getPages(accessToken: string): Promise<InstagramAccount[]> {
    try {
        console.log(`[Instagram API] Fetching accounts...`);
        // We need to fetch pages and look for connected instagram_business_account
        const response = await axios.get(`https://graph.facebook.com/${FB_API_VERSION}/me/accounts`, {
            params: {
                access_token: accessToken,
                fields: 'name,access_token,instagram_business_account{id,username}',
                limit: 100
            }
        });

        // Map all pages, indicating if they have IG or not
        const accounts = response.data.data.map((page: any) => {
            const ig = page.instagram_business_account;
            return {
                id: ig ? ig.id : page.id, // If IG exists use IG ID, else Page ID
                page_id: page.id,
                access_token: page.access_token,
                name: page.name + (ig ? ` (@${ig.username})` : ' [Sem Instagram Vinculado]'),
                username: ig ? ig.username : undefined,
                has_ig: !!ig
            };
        });

        console.log(`[Instagram API] Found ${accounts.length} pages (${accounts.filter((a: any) => a.has_ig).length} with IG)`);
        return accounts;
    } catch (error: any) {
        console.error('Error fetching IG accounts:', error.response?.data || error.message);
        throw new Error('Failed to fetch Instagram accounts. Verifique se o token é válido e tem permissões (pages_show_list, instagram_basic).');
    }
}

/**
 * Post a photo to Instagram
 * Workaround for File Uploads: Uploads to FB Page first (unpublished) to get a public URL
 */
export async function postPhoto(
    accessToken: string,
    targetId: string, // IG User ID
    photoData: string | Blob | Buffer,
    caption: string,
    scheduledTime?: Date,
    fbPageId?: string, // Required if photoData is a File/Buffer
    fbPageToken?: string, // Page Access Token for uploading to FB Page
    publishToFb: boolean = false // New flag: Post to Facebook Feed too?
) {
    try {
        let imageUrl = '';

        // If photoData is a File/Buffer, we need to host it first on Facebook
        if (typeof photoData !== 'string') {
            if (!fbPageId) {
                throw new Error("Cannot upload local file to Instagram without a backing Facebook Page ID.");
            }

            // Use Page Token if available
            const uploadToken = fbPageToken || accessToken;

            console.log(`[Facebook API] Uploading to FB Page ${fbPageId} (Published: ${publishToFb})...`);

            try {
                // Step 1: Upload file to Facebook Page
                // We need to use form-data package for proper multipart handling
                const FormDataModule = require('form-data');
                const FormData_NodeJS = FormDataModule.default || FormDataModule;
                const form = new FormData_NodeJS();
                
                // Append the file
                if (Buffer.isBuffer(photoData)) {
                    form.append('source', photoData, { filename: 'photo.jpg', contentType: 'image/jpeg' });
                } else {
                    form.append('source', photoData);
                }
                
                form.append('access_token', uploadToken);
                form.append('published', 'false'); // Keep unpublished for Instagram

                if (publishToFb) {
                    form.append('message', caption);
                    form.append('published', 'true');
                }

                const uploadRes = await axios.post(
                    `https://graph.facebook.com/${FB_API_VERSION}/${fbPageId}/photos`,
                    form,
                    {
                        headers: form.getHeaders ? form.getHeaders() : {}
                    }
                );

                const photoId = uploadRes.data.id;
                console.log(`[Facebook API] Photo uploaded: ${photoId}`);

                // Step 2: Get the public URL
                const urlRes = await axios.get(
                    `https://graph.facebook.com/${FB_API_VERSION}/${photoId}?fields=images,source&access_token=${uploadToken}`
                );

                if (urlRes.data.images && urlRes.data.images.length > 0) {
                    imageUrl = urlRes.data.images[0].source;
                } else if (urlRes.data.source) {
                    imageUrl = urlRes.data.source;
                } else {
                    throw new Error("No image URL found in Facebook response");
                }

                console.log(`[Facebook API] Got public URL: ${imageUrl.substring(0, 50)}...`);
            } catch (error) {
                console.error('[Facebook API] Upload error:', error);
                throw error;
            }
        } else {
            imageUrl = photoData;
        }

        // Step 1: Create Media Container on Instagram
        console.log(`[Instagram API] Creating media container for ${targetId}...`);
        
        // Validate image URL
        if (!imageUrl || !imageUrl.startsWith('http')) {
            throw new Error(`Invalid image URL: ${imageUrl}`);
        }

        // Validate caption (Instagram has limits)
        if (caption && caption.length > 2200) {
            console.warn(`[Instagram API] Caption too long (${caption.length} chars), truncating to 2200...`);
            caption = caption.substring(0, 2200);
        }

        const containerParams: any = {
            image_url: imageUrl,
            caption: caption || '',
            access_token: accessToken
        };

        const containerResponse = await axios.post(
            `https://graph.facebook.com/${FB_API_VERSION}/${targetId}/media`,
            null,
            { params: containerParams }
        );

        const creationId = containerResponse.data.id;
        if (!creationId) throw new Error("Failed to create media container");

        // Step 1.5: Poll container status until ready (Instagram needs time to process)
        console.log(`[Instagram API] Waiting for container ${creationId} to be ready...`);
        const maxRetries = 30; // 30 segundos máximo
        let retries = 0;
        let containerReady = false;

        while (retries < maxRetries && !containerReady) {
            try {
                const statusResponse = await axios.get(
                    `https://graph.facebook.com/${FB_API_VERSION}/${creationId}?fields=status_code,status&access_token=${accessToken}`
                );

                const statusCode = statusResponse.data.status_code;
                console.log(`[Instagram API] Container status: ${statusCode}`);

                if (statusCode === 'FINISHED') {
                    containerReady = true;
                    console.log(`[Instagram API] Container ready! Proceeding to publish...`);
                } else if (statusCode === 'ERROR') {
                    throw new Error(`Container processing failed: ${statusResponse.data.status || 'Unknown error'}`);
                } else {
                    // PENDING or IN_PROGRESS - wait and retry
                    await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1 second
                    retries++;
                }
            } catch (statusError: any) {
                console.error('Error checking container status:', statusError);
                // If status check fails, wait and retry
                await new Promise(resolve => setTimeout(resolve, 1000));
                retries++;
            }
        }

        if (!containerReady) {
            throw new Error("Container did not become ready in time. The image may be too large or invalid.");
        }

        // Step 2: Publish Media
        console.log(`[Instagram API] Publishing media ${creationId}...`);
        const publishResponse = await axios.post(
            `https://graph.facebook.com/${FB_API_VERSION}/${targetId}/media_publish`,
            null,
            {
                params: {
                    creation_id: creationId,
                    access_token: accessToken
                }
            }
        );

        return publishResponse.data;
    } catch (error: any) {
        console.error('Error posting to Instagram:', error.response?.data || error.message);
        
        // Provide more user-friendly error messages
        let errorMessage = error.message;
        
        if (error.response?.data?.error) {
            const fbError = error.response.data.error;
            
            // Map common Facebook/Instagram errors to user-friendly messages
            if (fbError.code === 100) {
                errorMessage = 'Parâmetro inválido. Verifique se a imagem é válida e está acessível publicamente.';
            } else if (fbError.code === 190) {
                errorMessage = 'Token de acesso inválido ou expirado. Faça login novamente.';
            } else if (fbError.code === 9403) {
                errorMessage = 'Você atingiu o limite de posts do Instagram. Aguarde alguns minutos.';
            } else if (fbError.message.includes('media container')) {
                errorMessage = 'Erro ao processar a imagem. Tente com outra imagem ou formato (JPG/PNG).';
            } else if (fbError.message.includes('image_url')) {
                errorMessage = 'URL da imagem inválida. Use uma imagem hospedada publicamente ou faça upload local.';
            } else {
                errorMessage = `Erro do Instagram: ${fbError.message}`;
            }
        }
        
        throw new Error(errorMessage);
    }
}

/**
 * Get scheduled posts
 */
export async function getScheduledPosts(accessToken: string, pageId: string) {
    return [];
}

/**
 * Post Video to Instagram (uses same endpoint as photo, Instagram API handles both)
 */
export async function postVideo(
    accessToken: string,
    targetId: string,
    videoData: string | Blob | Buffer,
    caption: string,
    scheduledTime?: Date,
    fbPageId?: string,
    fbPageToken?: string,
    publishToFb: boolean = false
) {
    // Videos use the same media endpoint as photos
    return postPhoto(accessToken, targetId, videoData, caption, scheduledTime, fbPageId, fbPageToken, publishToFb);
}
