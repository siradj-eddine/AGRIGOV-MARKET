import Image from "next/image";
import { fallbackStats } from "@/types/Auth";

export default function LoginHero() {
  return (
    <div className="hidden lg:flex flex-col justify-center space-y-8 pr-12">

      {/* Headline */}
      <div>
        <div className="inline-flex items-center gap-2 bg-white/50 dark:bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full border border-primary/20 mb-6 shadow-sm">
          <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
          <span className="text-sm font-medium text-slate-700 dark:text-slate-200">
            Official Ministry Portal
          </span>
        </div>

        <h1 className="text-5xl font-bold leading-tight tracking-tight text-slate-900 dark:text-white">
          Connecting the <br />
          <span className="text-transparent bg-clip-text bg-linear-to-r from-green-600 to-primary dark:from-primary dark:to-green-300">
            Agricultural Nation
          </span>
        </h1>

        <p className="mt-6 text-lg text-slate-600 dark:text-slate-300 max-w-md leading-relaxed">
          Access real-time market data, transport logistics, and government
          support schemes — all in one secure platform.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4">
        {fallbackStats.map((stat) => (
          <div
            key={stat.label}
            className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-md p-5 rounded-xl border border-white/20 shadow-sm"
          >
            <span
              className="material-symbols-outlined text-primary text-lg mb-1 block"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              {stat.icon}
            </span>
            <div className="text-3xl font-bold text-slate-900 dark:text-white">{stat.value}</div>
            <div className="text-sm text-slate-500 dark:text-slate-400 font-medium mt-0.5">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Hero image */}
      <div className="relative h-64 w-full rounded-2xl overflow-hidden shadow-lg border border-white/20 group">
        <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent z-10" />
        <Image
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuALKq-7S-AtxucEfOS_VyQZ5G3ZDFOA0m0StgPJyw0iAuhqldc2Co0mUwqBW0GEN1ZPCrX6hCERXPZ6GxP-5xbXVfR7nKyJ5RcGgt1U2o4oTb3SLJgpwXthdPiDKDqoFupZykQN2Qvomp2XJ_IcliNF8X6jIMVwMT8A0vGYOxql9k26pK6RAvyXaIZeww_MfZbsLsQjFVAfEiqIMegUP7G-jsGXpfMrnypBRFMCjMWmK3koA09uysEJdOpXDPBfF3Lg33RgWJwrqNJj"
          alt="Aerial view of green agricultural fields"
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-700"
          sizes="(max-width: 1280px) 50vw, 600px"
          priority
        />
        <div className="absolute bottom-4 left-4 z-20 text-white">
          <p className="text-sm font-semibold opacity-90">Digitalizing Agriculture</p>
          <p className="text-xs opacity-70 mt-0.5">Empowering rural communities</p>
        </div>
      </div>
    </div>
  );
}