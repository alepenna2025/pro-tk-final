import axios from 'axios';
export class FacebookClient {
    client;
    accessToken;
    apiVersion;
    constructor(config) {
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
    async getPages() {
        try {
            const response = await this.client.get('/me/accounts');
            return response.data.data || [];
        }
        catch (error) {
            throw new Error(`Failed to get pages: ${error.response?.data?.error?.message || error.message}`);
        }
    }
    /**
     * Post a text message to a page
     */
    async postToPage(pageId, data) {
        try {
            const response = await this.client.post(`/${pageId}/feed`, data);
            return response.data;
        }
        catch (error) {
            throw new Error(`Failed to post to page: ${error.response?.data?.error?.message || error.message}`);
        }
    }
    /**
     * Upload a photo to a page
     */
    async uploadPhoto(pageId, data) {
        try {
            const response = await this.client.post(`/${pageId}/photos`, data);
            return response.data;
        }
        catch (error) {
            throw new Error(`Failed to upload photo: ${error.response?.data?.error?.message || error.message}`);
        }
    }
    /**
     * Schedule a post for later
     */
    async schedulePost(pageId, message, scheduledTime, photoUrl) {
        const scheduledTimestamp = Math.floor(scheduledTime.getTime() / 1000);
        if (photoUrl) {
            return this.uploadPhoto(pageId, {
                url: photoUrl,
                message,
                published: false,
                scheduled_publish_time: scheduledTimestamp
            });
        }
        else {
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
    async getScheduledPosts(pageId) {
        try {
            const response = await this.client.get(`/${pageId}/scheduled_posts`);
            return response.data.data || [];
        }
        catch (error) {
            throw new Error(`Failed to get scheduled posts: ${error.response?.data?.error?.message || error.message}`);
        }
    }
    /**
     * Delete a scheduled post
     */
    async deleteScheduledPost(postId) {
        try {
            await this.client.delete(`/${postId}`);
            return true;
        }
        catch (error) {
            throw new Error(`Failed to delete scheduled post: ${error.response?.data?.error?.message || error.message}`);
        }
    }
}
