import axios, { AxiosInstance } from 'axios';

export interface FacebookConfig {
    accessToken: string;
    apiVersion?: string;
}

export interface FacebookPage {
    id: string;
    name: string;
    access_token?: string;
}

export interface PostData {
    message: string;
    url?: string;
    published?: boolean;
    scheduled_publish_time?: number;
}

export interface PhotoData {
    url?: string;
    message?: string;
    published?: boolean;
    scheduled_publish_time?: number;
}

export class FacebookClient {
    private client: AxiosInstance;
    private accessToken: string;
    private apiVersion: string;

    constructor(config: FacebookConfig) {
        this.accessToken = config.accessToken;
        this.apiVersion = config.apiVersion || 'v18.0';

        this.client = axios.create({
            baseURL: `https://graph.facebook.com/${this.apiVersion}`,
            params: {
                access_token: this.accessToken
            }
        });
    }

    /**
     * Get list of pages the user manages
     */
    async getPages(): Promise<FacebookPage[]> {
        try {
            const response = await this.client.get('/me/accounts');
            return response.data.data || [];
        } catch (error: any) {
            throw new Error(`Failed to get pages: ${error.response?.data?.error?.message || error.message}`);
        }
    }

    /**
     * Post a text message to a page
     */
    async postToPage(pageId: string, data: PostData): Promise<any> {
        try {
            const response = await this.client.post(`/${pageId}/feed`, data);
            return response.data;
        } catch (error: any) {
            throw new Error(`Failed to post to page: ${error.response?.data?.error?.message || error.message}`);
        }
    }

    /**
     * Upload a video to a page
     */
    async uploadVideo(pageId: string, data: { url: string; message?: string }): Promise<any> {
        try {
            const response = await this.client.post(`/${pageId}/videos`, null, {
                params: {
                    file_url: data.url,
                    description: data.message || '',
                    access_token: this.accessToken
                }
            });
            return response.data;
        } catch (error: any) {
            throw new Error(`Failed to upload video: ${error.response?.data?.error?.message || error.message}`);
        }
    }

    /**
     * Upload a photo to a page
     */
    async uploadPhoto(pageId: string, data: PhotoData): Promise<any> {
        try {
            const response = await this.client.post(`/${pageId}/photos`, data);
            return response.data;
        } catch (error: any) {
            throw new Error(`Failed to upload photo: ${error.response?.data?.error?.message || error.message}`);
        }
    }

    /**
     * Schedule a post for later
     */
    async schedulePost(pageId: string, message: string, scheduledTime: Date, photoUrl?: string): Promise<any> {
        const scheduledTimestamp = Math.floor(scheduledTime.getTime() / 1000);

        if (photoUrl) {
            return this.uploadPhoto(pageId, {
                url: photoUrl,
                message,
                published: false,
                scheduled_publish_time: scheduledTimestamp
            });
        } else {
            return this.postToPage(pageId, {
                message,
                published: false,
                scheduled_publish_time: scheduledTimestamp
            });
        }
    }

    /**
     * Get scheduled posts for a page
     */
    async getScheduledPosts(pageId: string): Promise<any[]> {
        try {
            const response = await this.client.get(`/${pageId}/scheduled_posts`);
            return response.data.data || [];
        } catch (error: any) {
            throw new Error(`Failed to get scheduled posts: ${error.response?.data?.error?.message || error.message}`);
        }
    }

    /**
     * Delete a scheduled post
     */
    async deleteScheduledPost(postId: string): Promise<boolean> {
        try {
            await this.client.delete(`/${postId}`);
            return true;
        } catch (error: any) {
            throw new Error(`Failed to delete scheduled post: ${error.response?.data?.error?.message || error.message}`);
        }
    }
}
