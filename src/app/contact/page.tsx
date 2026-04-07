import Link from "next/link";

export default function ContactPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center">
      <p className="text-accent text-sm tracking-[0.3em] uppercase mb-4">
        Coming Soon
      </p>
      <h1 className="metallic text-5xl md:text-7xl font-extralight tracking-[0.2em] uppercase mb-8">
        Contact
      </h1>
      <Link
        href="/"
        className="px-8 py-3 border border-accent/40 text-text-secondary text-sm tracking-[0.3em] uppercase hover:border-accent hover:text-white transition-all duration-300"
        data-cursor="view"
      >
        Back to Home
      </Link>
    </div>
  );
}
