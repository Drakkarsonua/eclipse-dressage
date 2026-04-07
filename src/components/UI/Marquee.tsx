"use client";

interface MarqueeProps {
  items: string[];
  separator?: string;
  reverse?: boolean;
  className?: string;
  speed?: number;
}

export default function Marquee({
  items,
  separator = "•",
  reverse = false,
  className = "",
  speed = 30,
}: MarqueeProps) {
  const content = items.join(` ${separator} `) + ` ${separator} `;

  return (
    <div className={`overflow-hidden whitespace-nowrap ${className}`}>
      <div
        className={reverse ? "animate-marquee-reverse" : "animate-marquee"}
        style={{
          display: "inline-flex",
          animationDuration: `${speed}s`,
        }}
      >
        <span className="inline-block pr-4">{content}</span>
        <span className="inline-block pr-4">{content}</span>
        <span className="inline-block pr-4">{content}</span>
        <span className="inline-block pr-4">{content}</span>
      </div>
    </div>
  );
}
