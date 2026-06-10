import { NextRequest, NextResponse } from 'next/server';
import Replicate from 'replicate';

export async function POST(req: NextRequest) {
  const token = process.env.REPLICATE_API_TOKEN;
  if (!token) {
    return NextResponse.json(
      { detail: 'Replicate API Token is not configured. Please add it to your environment variables.' },
      { status: 500 }
    );
  }

  try {
    const body = await req.json();
    const { image, prompt } = body;

    if (!image || !prompt) {
      return NextResponse.json(
        { detail: 'Image and prompt are required parameters.' },
        { status: 400 }
      );
    }

    // Initialize Replicate client
    const replicate = new Replicate({
      auth: token,
    });

    // Run the flux-kontext-pro text-guided image editing model on Replicate
    // Passing the base64 image data URI directly is fully supported for files under 1MB
    const output = await replicate.run(
      'black-forest-labs/flux-kontext-pro',
      {
        input: {
          prompt: prompt,
          input_image: image,
          aspect_ratio: 'match_input_image',
          safety_tolerance: 2,
          prompt_upsampling: false,
          output_format: 'jpg',
          num_inference_steps: 35
        }
      }
    );

    if (!output) {
      return NextResponse.json(
        { detail: 'The AI model did not return any output. Please try again.' },
        { status: 500 }
      );
    }

    // Parse the output, which can be an array of URLs or a single URL string
    let imageUrl = '';
    if (Array.isArray(output)) {
      imageUrl = String(output[0]);
    } else {
      imageUrl = String(output);
    }

    return NextResponse.json({ image_url: imageUrl });

  } catch (error: any) {
    console.error('Error invoking Replicate in Next.js route:', error);
    return NextResponse.json(
      { detail: `خطأ أثناء توليد الستارة بالذكاء الاصطناعي: ${error.message || error}` },
      { status: 500 }
    );
  }
}
