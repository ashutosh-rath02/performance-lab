import { NextRequest } from "next/server";

interface RouteContext {
  params: {
    width: string;
    height: string;
  };
}

export async function GET(
  request: NextRequest,
  context: RouteContext
): Promise<Response> {
  const width = parseInt(context.params.width);
  const height = parseInt(context.params.height);

  if (isNaN(width) || isNaN(height) || width <= 0 || height <= 0) {
    return new Response("Invalid dimensions", { status: 400 });
  }

  const svg = `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="#f0f0f0"/>
      <text 
        x="50%" 
        y="50%" 
        font-family="Arial" 
        font-size="16" 
        fill="#666" 
        text-anchor="middle" 
        dy=".3em"
      >
        ${width}x${height}
      </text>
    </svg>
  `;

  return new Response(svg, {
    headers: {
      "Content-Type": "image/svg+xml",
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
