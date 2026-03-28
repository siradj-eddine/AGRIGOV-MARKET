import Image from 'next/image';

interface ProductManagementNavbarProps {
  search: string;
  onSearchChange: (value: string) => void;
}

export default function ProductManagementNavbar({
  search,
  onSearchChange,
}: ProductManagementNavbarProps) {
  return (
    <header className="flex items-center justify-between whitespace-nowrap border-b border-primary/20 px-4 md:px-10 py-3 bg-white dark:bg-slate-900 shrink-0">
      {/* Logo */}
      <div className="flex items-center gap-4">
        <span className="material-symbols-outlined text-4xl text-primary">agriculture</span>
        <h2 className="text-slate-900 dark:text-slate-100 text-lg font-bold leading-tight tracking-[-0.015em]">
          AgriManager
        </h2>
      </div>

      {/* Right controls */}
      <div className="flex flex-1 justify-end gap-4 md:gap-8 items-center">
        {/* Search */}
        <label className="hidden md:flex flex-col min-w-40 h-10 max-w-64">
          <div className="flex w-full flex-1 items-stretch rounded-lg h-full">
            <div className="text-primary flex border-none bg-primary/10 items-center justify-center pl-4 rounded-l-lg border-r-0">
              <span className="material-symbols-outlined text-xl">search</span>
            </div>
            <input
              type="text"
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search listings..."
              aria-label="Search listings"
              className="flex w-full min-w-0 flex-1 rounded-lg text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-0 border-none bg-primary/10 h-full placeholder:text-primary/60 px-4 rounded-l-none border-l-0 pl-2 text-base font-normal leading-normal"
            />
          </div>
        </label>

        {/* Icon buttons */}
        <div className="flex gap-2">
          <button
            aria-label="View notifications"
            className="flex cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 bg-primary/10 text-slate-900 dark:text-slate-100 px-2.5 hover:bg-primary/20 transition-colors"
          >
            <span className="material-symbols-outlined">notifications</span>
          </button>
          <button
            aria-label="View account"
            className="flex cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 bg-primary/10 text-slate-900 dark:text-slate-100 px-2.5 hover:bg-primary/20 transition-colors"
          >
            <span className="material-symbols-outlined">account_circle</span>
          </button>
        </div>

        {/* Avatar */}
        <div className="size-10 rounded-full overflow-hidden border-2 border-primary relative shrink-0">
          <Image
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuAiD_U8Hk-0AXgoQCvNm1pOn7ynxSoCa-b4-YXQusDSeoHd8_X6Iv4cQjSjXYzKs_4wdtt66iYiqxtscBG7Gy3ojp7Vj5hSgG0N0yRGx5NJZlxS8mpvdAMqGaMtcOg0-70r8m8O-8nvjzmouowEQ5Zb5Z_IbrkThjS5BwKmEWgZP41eBWJpy-KxQxg-p9c4ufyr4cPF0wSTDAx87Nf1O1fSrru1DbVyPyN0dQ3Q3tnviGTAQekfjkWUOS9Q-4_nB4RYslI8j7OMUixM"
            alt="Farmer profile headshot"
            fill
            sizes="40px"
            className="object-cover"
          />
        </div>
      </div>
    </header>
  );
}