"use client";

interface MetallicTextProps {
  children: React.ReactNode;
  className?: string;
  as?: keyof JSX.IntrinsicElements;
}

export default function MetallicText({
  children,
  className = "",
  as: Tag = "span",
}: MetallicTextProps) {
  const Component = Tag as React.ElementType;
  return (
    <Component className={`metallic ${className}`}>
      {children}
    </Component>
  );
}
