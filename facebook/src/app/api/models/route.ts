import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    models: [
      {
        id: 'gemini-2.0-flash',
        name: 'Gemini 2.0 Flash',
        description: 'Fast and efficient AI model for text generation',
        maxTokens: 8000
      }
    ]
  });
}
