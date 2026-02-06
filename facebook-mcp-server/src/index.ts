#!/usr/bin/env node

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
    ListToolsRequestSchema,
    CallToolRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import { z } from 'zod';
import { FacebookClient } from './facebook-client.js';

// Facebook/Instagram API Token - Replace with environment variable in production
const FACEBOOK_TOKEN = 'EAAMrj5I3CQsBQnbp8hlBtbUzg6bmJEA2CxNVmrY5QY6d3y8EQdLCyYg8SZA6aqZAlcPOZBZCAIycIryqHeEMCprxxUDaOFLZA9n2hbZA29LoPD9fgutuiDeVOaCHu4Yz5CyWELU6Ia7riBYaltNhrKP8U9IF8mkooyAfIw2zg22kR4H66y6YwMCZCuBAQhbxznx';

// Initialize Facebook client
const fbClient = new FacebookClient({ accessToken: FACEBOOK_TOKEN });

// Create MCP server
const server = new Server(
    {
        name: 'facebook-mcp-server',
        version: '1.0.0',
    },
    {
        capabilities: {
            tools: {},
        },
    }
);

// Tool: Get Facebook Pages
server.setRequestHandler(ListToolsRequestSchema, async () => ({
    tools: [
        {
            name: 'facebook_get_pages',
            description: 'Get list of Facebook pages you manage',
            inputSchema: {
                type: 'object',
                properties: {},
            },
        },
        {
            name: 'facebook_post_text',
            description: 'Post a text message to a Facebook page',
            inputSchema: {
                type: 'object',
                properties: {
                    pageId: {
                        type: 'string',
                        description: 'The Facebook Page ID',
                    },
                    message: {
                        type: 'string',
                        description: 'The message to post',
                    },
                },
                required: ['pageId', 'message'],
            },
        },
        {
            name: 'facebook_post_photo',
            description: 'Post a photo with caption to a Facebook page',
            inputSchema: {
                type: 'object',
                properties: {
                    pageId: {
                        type: 'string',
                        description: 'The Facebook Page ID',
                    },
                    photoUrl: {
                        type: 'string',
                        description: 'URL of the photo to post (must be publicly accessible)',
                    },
                    message: {
                        type: 'string',
                        description: 'Caption for the photo',
                    },
                },
                required: ['pageId', 'photoUrl'],
            },
        },
        {
            name: 'facebook_schedule_post',
            description: 'Schedule a post (with optional photo) for future publication',
            inputSchema: {
                type: 'object',
                properties: {
                    pageId: {
                        type: 'string',
                        description: 'The Facebook Page ID',
                    },
                    message: {
                        type: 'string',
                        description: 'The message to post',
                    },
                    scheduledTime: {
                        type: 'string',
                        description: 'ISO 8601 datetime string for when to publish (e.g., 2024-12-31T23:59:59Z)',
                    },
                    photoUrl: {
                        type: 'string',
                        description: 'Optional: URL of the photo to post',
                    },
                },
                required: ['pageId', 'message', 'scheduledTime'],
            },
        },
        {
            name: 'facebook_get_scheduled_posts',
            description: 'Get list of scheduled posts for a page',
            inputSchema: {
                type: 'object',
                properties: {
                    pageId: {
                        type: 'string',
                        description: 'The Facebook Page ID',
                    },
                },
                required: ['pageId'],
            },
        },
        {
            name: 'facebook_delete_scheduled_post',
            description: 'Delete a scheduled post',
            inputSchema: {
                type: 'object',
                properties: {
                    postId: {
                        type: 'string',
                        description: 'The scheduled post ID to delete',
                    },
                },
                required: ['postId'],
            },
        },
    ],
}));

// Tool execution handler
server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const { name, arguments: args } = request.params;

    if (!args) {
        throw new Error('No arguments provided');
    }

    try {
        switch (name) {
            case 'facebook_get_pages':
                const pages = await fbClient.getPages();
                return {
                    content: [
                        {
                            type: 'text',
                            text: JSON.stringify(pages, null, 2),
                        },
                    ],
                };

            case 'facebook_post_text':
                const textResult = await fbClient.postToPage(String(args.pageId), {
                    message: String(args.message),
                });
                return {
                    content: [
                        {
                            type: 'text',
                            text: `Post published successfully! Post ID: ${textResult.id}`,
                        },
                    ],
                };

            case 'facebook_post_photo':
                const photoResult = await fbClient.uploadPhoto(String(args.pageId), {
                    url: String(args.photoUrl),
                    message: args.message ? String(args.message) : '',
                });
                return {
                    content: [
                        {
                            type: 'text',
                            text: `Photo posted successfully! Post ID: ${photoResult.id}`,
                        },
                    ],
                };

            case 'facebook_schedule_post':
                const scheduledTime = new Date(String(args.scheduledTime));
                const scheduleResult = await fbClient.schedulePost(
                    String(args.pageId),
                    String(args.message),
                    scheduledTime,
                    args.photoUrl ? String(args.photoUrl) : undefined
                );
                return {
                    content: [
                        {
                            type: 'text',
                            text: `Post scheduled successfully! Post ID: ${scheduleResult.id}`,
                        },
                    ],
                };

            case 'facebook_get_scheduled_posts':
                const scheduledPosts = await fbClient.getScheduledPosts(String(args.pageId));
                return {
                    content: [
                        {
                            type: 'text',
                            text: JSON.stringify(scheduledPosts, null, 2),
                        },
                    ],
                };

            case 'facebook_delete_scheduled_post':
                await fbClient.deleteScheduledPost(String(args.postId));
                return {
                    content: [
                        {
                            type: 'text',
                            text: 'Scheduled post deleted successfully!',
                        },
                    ],
                };

            default:
                throw new Error(`Unknown tool: ${name}`);
        }
    } catch (error: any) {
        return {
            content: [
                {
                    type: 'text',
                    text: `Error: ${error.message}`,
                },
            ],
            isError: true,
        };
    }
});

// Start server
async function main() {
    const transport = new StdioServerTransport();
    await server.connect(transport);
    console.error('Facebook MCP Server running on stdio');
}

main().catch((error) => {
    console.error('Fatal error:', error);
    process.exit(1);
});
