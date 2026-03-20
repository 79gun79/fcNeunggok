import AuthButton from '@/components/AuthButton';

const navItems = [
  { label: 'Community', href: '#top' },
  { label: 'Gallery', href: '#gallery' },
];

const HomeHeader = () => {
  return (
    <header className="fixed left-4 right-4 top-4 z-50 overflow-hidden rounded-md bg-[linear-gradient(180deg,rgba(15,23,42,0.72),rgba(15,23,42,0.46))] shadow-[0_18px_40px_-28px_rgba(0,0,0,0.8)] backdrop-blur-xl supports-[backdrop-filter]:bg-[linear-gradient(180deg,rgba(15,23,42,0.58),rgba(15,23,42,0.32))]">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(96,165,250,0.14),transparent_36%),linear-gradient(90deg,rgba(255,255,255,0.06),transparent_22%,transparent_78%,rgba(255,255,255,0.04))]" />
      <div className="relative mx-auto flex h-14 w-full max-w-7xl items-center justify-between gap-4 px-3 sm:h-16 sm:px-5 lg:px-6">
        <a
          href="#top"
          aria-label="FC Neunggok"
          className="flex shrink-0 items-center"
        >
          <span className="h-8 w-16 overflow-hidden sm:h-9 sm:w-20">
            <img
              src="/ng_white.png"
              alt="FC 능곡"
              className="h-full w-full object-contain object-center"
            />
          </span>
        </a>

        <div className="flex min-w-0 items-center justify-end gap-2 sm:gap-3">
          <nav className="hidden items-center gap-1 text-sm text-white/70 md:flex lg:gap-2">
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="hover:bg-white/8 inline-flex items-center gap-1 rounded-md px-3 py-2 transition-colors hover:text-white"
              >
                <span className="font-medium">{item.label}</span>
              </a>
            ))}
          </nav>
          <AuthButton />
        </div>
      </div>
    </header>
  );
};

export default HomeHeader;
