import Image from "next/image";
import Link from "next/link";

export default function HeroSection() {
  return (
    <div className="relative w-full bg-slate-900 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <Image
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuD11ew08pKzaDNcRjcS_UaqeLUrfhhCmidsB5vnNJ6ekRzDurRTyzz8iIa2qgNHb8EeH3kC-7D7eR27_n8zrpb9p3SuUzFUFwWlXE6gRYbXj48IcqVw_igoapdAsRKPoszxACNqZav5bD5zQAlWYs_3lpjFiKBgWc7QpvPeetBWh3dn1m_w9dyZ9qZkjcfcPox9hwYfcWpuHtX6kVbucG3AO-D1PoJj51mc8r59OchvYWE8a83a16brBA1_H5CaT0rDBk8fYCRSOL2p"
          alt="Lush green agricultural fields under a bright sky"
          fill
          className="object-cover opacity-60"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-linear-to-t from-background-dark via-background-dark/60 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32 flex flex-col items-center text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/20 border border-primary/40 backdrop-blur-sm mb-6">
          <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
          <span className="text-xs font-bold text-primary tracking-wide uppercase">
            Official National Platform
          </span>
        </div>

        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 tracking-tight max-w-4xl leading-tight">
          Cultivating the{" "}
          <span className="text-transparent bg-clip-text bg-linear-to-r from-primary to-green-300">
            Future
          </span>{" "}
          of Our Nation&apos;s Agriculture
        </h1>

        <p className="text-lg md:text-xl text-slate-200 mb-10 max-w-2xl leading-relaxed">
          The centralized digital marketplace connecting farmers to fair prices, buyers to quality
          produce, and transporters to new routes.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
          <Link
            href="/marketplace"
            className="inline-flex items-center justify-center px-8 py-4 text-base font-bold rounded-xl text-black bg-primary hover:bg-primary-dark hover:scale-105 transition-all shadow-[0_0_20px_rgba(13,242,13,0.3)]"
          >
            Access Marketplace
          </Link>
          <Link
            href="#"
            className="inline-flex items-center justify-center px-8 py-4 text-base font-bold rounded-xl text-white bg-surface-light/10 hover:bg-surface-light/20 backdrop-blur-md border border-white/20 hover:border-white/40 transition-all"
          >
            View Price Updates
          </Link>
        </div>
      </div>
    </div>
  );
}