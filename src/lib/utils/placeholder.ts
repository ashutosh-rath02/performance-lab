export interface PlaceholderOptions {
  width: number;
  height: number;
  backgroundColor?: string;
  textColor?: string;
}

export function generatePlaceholder({
  width,
  height,
  backgroundColor = "#f0f0f0",
  textColor = "#666",
}: PlaceholderOptions): string {
  return `
      <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
        <rect width="100%" height="100%" fill="${backgroundColor}"/>
        <text 
          x="50%" 
          y="50%" 
          font-family="Arial" 
          font-size="16" 
          fill="${textColor}" 
          text-anchor="middle" 
          dy=".3em"
        >
          ${width}x${height}
        </text>
      </svg>
    `;
}
