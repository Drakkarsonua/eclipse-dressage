"use client";

interface PlaceholderImageProps {
  width?: string;
  height?: string;
  label?: string;
  className?: string;
}

export default function PlaceholderImage({
  width = "100%",
  height = "100%",
  label = "Photo placeholder",
  className = "",
}: PlaceholderImageProps) {
  return (
    <div
      className={`relative flex items-center justify-center bg-gray-800 overflow-hidden ${className}`}
      style={{ width, height }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-gray-700 via-gray-800 to-gray-900" />
      <div className="relative flex flex-col items-center gap-3 text-gray-500">
        <svg
          width="48"
          height="48"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
          <circle cx="8.5" cy="8.5" r="1.5" />
          <polyline points="21 15 16 10 5 21" />
        </svg>
        <span className="text-xs uppercase tracking-widest">{label}</span>
      </div>
    </div>
  );
}
