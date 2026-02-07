import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params;

  const { searchParams } = new URL(request.url);
  const isDownload = searchParams.get("download") === "1";

  const pdfPath = path.join("/");
  const baseUrl =
    process.env.NEXT_PUBLIC_PDF_BASE_URL ??
    "https://tansihondamanuals.t3.storage.dev";

  const pdfUrl = `${baseUrl}/${pdfPath}`;

  // Forward validation and range headers
  const upstreamHeaders: Record<string, string> = {};
  const range = request.headers.get("range");
  const ifNoneMatch = request.headers.get("if-none-match");
  const ifModifiedSince = request.headers.get("if-modified-since");

  if (range) upstreamHeaders["Range"] = range;
  if (ifNoneMatch) upstreamHeaders["If-None-Match"] = ifNoneMatch;
  if (ifModifiedSince) upstreamHeaders["If-Modified-Since"] = ifModifiedSince;

  const upstream = await fetch(pdfUrl, {
    headers: upstreamHeaders,
    cache: "no-store", // Bypass Next.js 2MB cache limit
  });

  // Handle errors (allow 304 and 206)
  if (!upstream.ok && upstream.status !== 206 && upstream.status !== 304) {
    return new NextResponse("Failed to fetch PDF", {
      status: upstream.status,
    });
  }

  const headers = new Headers();
  
  // Passthrough critical headers from storage
  const passthroughHeaders = [
    "content-type",
    "content-length",
    "content-range",
    "accept-ranges",
    "etag",
    "last-modified",
  ];

  passthroughHeaders.forEach(h => {
    const val = upstream.headers.get(h);
    if (val) headers.set(h, val);
  });

  // CORS and Cache Headers
  headers.set("Access-Control-Allow-Origin", "*");
  headers.set("Access-Control-Expose-Headers", "Content-Range, ETag, Content-Length, Accept-Ranges");
  headers.set("Vary", "Range, Accept-Encoding");
  headers.set("Cache-Control", "public, max-age=31536000, immutable");

  // Handle 304 Not Modified explicitly
  if (upstream.status === 304) {
    return new NextResponse(null, {
      status: 304,
      headers,
    });
  }

  // Inline vs Download
  const filename = path[path.length - 1] ?? "file.pdf";
  headers.set(
    "Content-Disposition",
    `${isDownload ? "attachment" : "inline"}; filename="${filename}"`
  );

  return new NextResponse(upstream.body, {
    status: upstream.status,
    headers,
  });
}
