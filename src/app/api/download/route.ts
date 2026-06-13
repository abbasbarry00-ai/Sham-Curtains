import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const url = req.nextUrl.searchParams.get('url');
  if (!url) {
    return new NextResponse('Missing url parameter', { status: 400 });
  }

  try {
    const response = await fetch(url);
    if (!response.ok) {
      return new NextResponse('Failed to fetch the image from source', { status: response.status });
    }

    const contentType = response.headers.get('content-type') || 'image/jpeg';
    const blob = await response.blob();
    const arrayBuffer = await blob.arrayBuffer();

    return new NextResponse(Buffer.from(arrayBuffer), {
      headers: {
        'Content-Type': contentType,
        'Content-Disposition': `attachment; filename="setara-curtain-design-${Date.now()}.jpg"`,
      },
    });
  } catch (error: any) {
    console.error('Error fetching image for download:', error);
    return new NextResponse(`Error downloading file: ${error.message || error}`, { status: 500 });
  }
}
