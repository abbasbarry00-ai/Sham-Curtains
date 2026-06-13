import { NextRequest, NextResponse } from 'next/server';
import Replicate from 'replicate';

// Strict engineering prompt dictionary matching the UI options exactly
const typeMapping: Record<string, string> = {
  "ويفي": "modern wave fold ripple fold curtain, elegant continuous uniform s-curve vertical folds, sleek architectural draping",
  "كسرات": "tailored pleated curtain, crisp structured vertical fabric folds, neat tailoring",
  "زم": "tightly gathered rod pocket curtain, bunched fabric firmly gathered at the top header, soft dense continuous ruffles",
  "تكسير امريكي": "classic American pinch pleat custom curtain, rigid tailored 3-finger pinch folds firmly sewn at the top header, elegant traditional drape",
  "رول سنسكرين": "sleek architectural sunscreen roller blind, ONE single completely flat continuous vertical translucent fabric sheet, smooth surface, NO folds, NO wrinkles",
  "بلاك آوت شامواه": "premium heavy suede chamois blackout curtain, 100% opaque thick matte texture, heavy vertical drop, straight hem",
  "دي كي (DK)": "modern day and night double roller blind system, flat clean architectural window covering, flat vertical surface",
  "كلاسيك بوري": "classic eyelet grommet curtain, large metal rings cleanly threaded through a thick visible horizontal metal pipe rod, deep wavy folds",
  "رول زيبرا": "modern zebra blind, flat alternating horizontal translucent and solid opaque fabric stripes, straight flat surface, NO folds",
  "جالوزي خشبي": "luxurious wooden horizontal Venetian blinds, distinct thick natural wood horizontal slats, architectural window treatment",
  "جالوزي معدني": "sleek architectural aluminum mini Venetian blinds, thin sharp horizontal metal slats, modern minimalist style",
  "رفعات جانبية": "elegant drapery smoothly swept to the outer sides and tightly secured with decorative fabric tie-backs, sweeping curved drape opening clearly in the center",
  "مسرحي كسرات": "grand theatrical drape, heavy luxurious dramatic curtains with extremely deep rich vertical pleats, opulent thick hanging, extreme fabric fullness"
};

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
    const { image, mask, prompt, style } = body;

    if (!image) {
      return NextResponse.json(
        { detail: 'Image is a required parameter.' },
        { status: 400 }
      );
    }

    if (!mask) {
      return NextResponse.json(
        { detail: 'Mask is a required parameter for inpainting.' },
        { status: 400 }
      );
    }

    // Determine final prompt to use
    let finalPrompt = prompt || '';

    // Enforce strict engineering prompt on the server if style is passed
    if (style && typeMapping[style]) {
      const strictDescription = typeMapping[style];
      console.log(`Server-side: Enforcing strict engineering prompt for style: ${style}`);
      
      // If the client did not send a prompt, we construct a default one
      if (!finalPrompt) {
        finalPrompt = `Edit this photo of a room to add a new custom-fit curtain inside the window frame. The curtain style must be: ${strictDescription}. High-resolution architectural photography, photorealistic interior design.`;
      } else {
        // Ensure the prompt uses the server-side strict description by replacing any other style description found,
        // or appending it if none is found.
        let replaced = false;
        for (const val of Object.values(typeMapping)) {
          if (finalPrompt.includes(val)) {
            finalPrompt = finalPrompt.replace(val, strictDescription);
            replaced = true;
          }
        }
        if (!replaced && !finalPrompt.includes(strictDescription)) {
          finalPrompt = finalPrompt + ` The curtain style must be strictly: ${strictDescription}.`;
        }
        console.log(`Prompt verified and updated containing: ${strictDescription.substring(0, 45)}...`);
      }
    }

    if (!finalPrompt) {
      return NextResponse.json(
        { detail: 'Prompt or style parameter is required.' },
        { status: 400 }
      );
    }

    // Initialize Replicate client
    const replicate = new Replicate({
      auth: token,
    });

    // Run the SDXL Inpainting model on Replicate
    const output = await replicate.run(
      'lucataco/sdxl-inpainting:a5b13068cc81a89a4fbeefeccc774869fcb34df4dbc92c1555e0f2771d49dde7',
      {
        input: {
          prompt: finalPrompt,
          image: image,
          mask: mask,
          strength: 0.8,
          steps: 30,
          guidance_scale: 7.5,
          num_outputs: 1
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
