import { NextRequest, NextResponse } from 'next/server';
import Replicate from 'replicate';

const FLUX_KONTEXT_MODEL = 'black-forest-labs/flux-kontext-pro';

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
    const { image, mask, prompt, negative_prompt } = body;

    if (!image) {
      return NextResponse.json(
        { detail: 'Image is a required parameter.' },
        { status: 400 }
      );
    }

    const finalPrompt = typeof prompt === 'string' ? prompt.trim() : '';

    if (!finalPrompt) {
      return NextResponse.json(
        { detail: 'Prompt is a required parameter.' },
        { status: 400 }
      );
    }

    const replicate = new Replicate({
      auth: token,
    });

    const preservationInstruction = [
      finalPrompt,
      'Preservation constraint: keep the original walls, wall paint color, furniture, floor, ceiling, camera perspective, and room lighting unchanged. Only edit the window treatment area.'
    ].join('\n');

    const negativeInstruction = typeof negative_prompt === 'string' && negative_prompt.trim()
      ? `\nAvoid: ${negative_prompt.trim()}.`
      : '';

    const input: Record<string, unknown> = {
      prompt: `${preservationInstruction}${negativeInstruction}`,
      input_image: image,
      output_format: 'jpg'
    };

    // FLUX.1 Kontext Pro is instruction-based image editing. It does not use SDXL
    // inpainting controls, and an all-white mask would invite full-image edits.
    if (typeof mask === 'string' && mask.trim()) {
      console.warn('Mask received but not sent: flux-kontext-pro does not accept SDXL-style mask input.');
    }

    const output = await replicate.run(FLUX_KONTEXT_MODEL, { input });

    if (!output) {
      return NextResponse.json(
        { detail: 'The AI model did not return any output. Please try again.' },
        { status: 500 }
      );
    }

    let imageUrl = '';
    if (Array.isArray(output)) {
      imageUrl = String(output[0]);
    } else {
      imageUrl = String(output);
    }

    return NextResponse.json({ image_url: imageUrl });

  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    console.error('Error invoking Replicate in Next.js route:', error);
    return NextResponse.json(
      { detail: `خطأ أثناء توليد الستارة بالذكاء الاصطناعي: ${message}` },
      { status: 500 }
    );
  }
}
