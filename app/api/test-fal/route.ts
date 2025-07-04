import { NextRequest, NextResponse } from 'next/server';
import * as fal from "@fal-ai/serverless-client";

// Configure FAL client
const FAL_API_KEY = process.env.FAL_KEY || "71163de2-482a-46e5-821c-ccef71f7caae:2cec66a501188bdb77c78e85191693ba";

fal.config({
  credentials: FAL_API_KEY,
});

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    console.log('Testing FAL AI connection...');
    console.log('API Key:', FAL_API_KEY ? `${FAL_API_KEY.substring(0, 10)}...` : 'Not set');

    // Test simple image generation
    const result = await fal.subscribe("fal-ai/flux/schnell", {
      input: {
        prompt: "a simple red apple",
        image_size: "square_hd",
        num_inference_steps: 4,
        num_images: 1,
        guidance_scale: 3.5,
        seed: 42,
        enable_safety_checker: true,
      },
      logs: true,
    }) as any;

    console.log('Test result:', JSON.stringify(result, null, 2));

    return NextResponse.json({
      success: true,
      message: 'FAL AI connection successful',
      result: result,
      timestamp: new Date().toISOString()
    });

  } catch (error: any) {
    console.error('FAL AI test error:', error);

    return NextResponse.json({
      success: false,
      error: error.message,
      details: {
        stack: error.stack,
        name: error.constructor.name,
        response: error.response ? {
          status: error.response.status,
          statusText: error.response.statusText,
          data: error.response.data
        } : 'No response'
      },
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}
