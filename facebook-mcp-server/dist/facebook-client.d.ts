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
export declare class FacebookClient {
    private client;
    private accessToken;
    private apiVersion;
    constructor(config: FacebookConfig);
    /**
     * Get list of pages the user manages
     */
    getPages(): Promise<FacebookPage[]>;
    /**
     * Post a text message to a page
     */
    postToPage(pageId: string, data: PostData): Promise<any>;
    /**
     * Upload a photo to a page
     */
    uploadPhoto(pageId: string, data: PhotoData): Promise<any>;
    /**
     * Schedule a post for later
     */
    schedulePost(pageId: string, message: string, scheduledTime: Date, photoUrl?: string): Promise<any>;
    /**
     * Get scheduled posts for a page
     */
    getScheduledPosts(pageId: string): Promise<any[]>;
    /**
     * Delete a scheduled post
     */
    deleteScheduledPost(postId: string): Promise<boolean>;
}
