import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    endpoints: [
      '/api/health',
      '/api/models',
      '/api/ai-agent',
      '/api/facebook',
      '/api/social-post'
    ]
  });
}
