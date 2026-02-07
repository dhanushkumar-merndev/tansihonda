import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params;
  const { searchParams } = new URL(request.url);
  const isDownload = searchParams.get('download') === '1';
  const pdfPath = path.join('/');
  
  const baseUrl = process.env.NEXT_PUBLIC_PDF_BASE_URL || "https://tansihondamanuals.t3.storage.dev";
  const pdfUrl = encodeURI(`${baseUrl}/${pdfPath}`);

  try {
    const response = await fetch(pdfUrl);
    
    if (!response.ok) {
      return new NextResponse(`Failed to fetch PDF: ${response.statusText}`, { status: response.status });
    }

    const filename = pdfPath.split('/').pop();
    const disposition = isDownload ? 'attachment' : 'inline';
    
    const headers = new Headers();
    headers.set('Content-Type', 'application/pdf');
    headers.set('Content-Disposition', `${disposition}; filename="${filename}"`);
    headers.set('X-Content-Type-Options', 'nosniff');
    
    // CORS Headers
    headers.set('Access-Control-Allow-Origin', '*');
    headers.set('Access-Control-Allow-Methods', 'GET, OPTIONS');
    headers.set('Access-Control-Allow-Headers', 'Content-Type, Range');
    headers.set('Access-Control-Expose-Headers', 'Content-Length, Content-Range');
    
    // Add Content-Length if available to help browser trust the stream
    const contentLength = response.headers.get('content-length');
    if (contentLength) {
      headers.set('Content-Length', contentLength);
    }

    // Highly aggressive caching
    headers.set('Cache-Control', 'public, max-age=2592000, s-maxage=31536000, immutable, stale-while-revalidate=86400');

    return new NextResponse(response.body, {
      headers,
    });
  } catch (error) {
    console.error('Error proxying PDF:', error);
    return new NextResponse('Error fetching PDF', { status: 500 });
  }
}
