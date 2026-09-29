import Link from "next/link";
const quickLinks = [
  { label: "Lawn Care", href: "/lawn-care", emoji: "🌱" },
  { label: "Garden Tools", href: "/garden-tools", emoji: "✂️" },
  { label: "Watering", href: "/watering", emoji: "💧" },
  { label: "Growing", href: "/growing", emoji: "🪴" },
  { label: "Yard Cleanup", href: "/yard-cleanup", emoji: "🍂" },
  { label: "All Guides", href: "/guide", emoji: "📖" },
];

export default function NotFound() {
  return (
    <div className="min-h-[100dvh] flex flex-col">
      {/* Hero background */}
      <div
        className="relative flex-1 flex flex-col items-center justify-center px-4 py-20 text-center"
        style={{
          backgroundImage: "url('/hero-banner.webp')",
          backgroundSize: "cover",
          backgroundPosition: "center right",
        }}
      >
        {/* Dark overlay */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(135deg, rgba(12,21,37,0.93) 0%, rgba(15,30,55,0.85) 60%, rgba(10,20,40,0.80) 100%)",
          }}
        />

        {/* Content */}
        <div className="relative z-10 max-w-lg mx-auto">
          {/* 404 badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/20 mb-6">
            <span className="text-[#c9a876] font-bold text-xs tracking-widest uppercase">Error 404</span>
          </div>

          {/* Heading */}
          <h1 className="text-5xl sm:text-7xl font-bold text-white tracking-tight mb-4 leading-none">
            Page not<br />
            <span className="text-[#c9a876]">found.</span>
          </h1>

          <p className="text-white/70 text-base sm:text-lg leading-relaxed mb-10 max-w-sm mx-auto">
            This page doesn&apos;t exist or has moved. Let&apos;s get you back to the garden guides.
          </p>

          {/* Primary actions */}
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            <Link prefetch={false}
              href="/"
              className="px-6 py-3 bg-[#5c6f4b] hover:bg-[#48602f] text-white font-semibold rounded-xl transition-colors text-sm shadow-lg"
            >
              ← Back to Home
            </Link>
            <Link prefetch={false}
              href="/guide"
              className="px-6 py-3 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold rounded-xl transition-colors text-sm backdrop-blur-sm"
            >
              Browse All Guides
            </Link>
          </div>

          {/* Quick links grid */}
          <div>
            <p className="text-white/40 text-xs font-semibold uppercase tracking-widest mb-4">
              Popular pages
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {quickLinks.map((link) => (
                <Link prefetch={false}
                  key={link.href}
                  href={link.href}
                  className="flex items-center gap-2 px-3 py-2.5 rounded-lg bg-white/8 hover:bg-white/15 border border-white/10 hover:border-white/25 transition-all text-left"
                >
                  <span className="text-base leading-none">{link.emoji}</span>
                  <span className="text-white/80 hover:text-white text-xs font-medium transition-colors leading-snug">
                    {link.label}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
