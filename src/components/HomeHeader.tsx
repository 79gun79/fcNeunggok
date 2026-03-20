import AuthButton from "@/components/AuthButton";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";

const navItems = [
  { label: "Platform", href: "#top", hasDropdown: true },
  { label: "Solutions", href: "#gallery", hasDropdown: true },
  { label: "Resources", href: "#gallery", hasDropdown: true },
  { label: "Customers", href: "#gallery", hasDropdown: false },
  { label: "Pricing", href: "#footer", hasDropdown: false },
];

const HomeHeader = () => {
  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/65">
      <div className="container mx-auto flex h-14 items-center justify-between gap-3 px-3 sm:h-16 sm:px-6 lg:px-8">
        <a href="#top" className="flex items-center gap-2">
          <img src="/ng_logo.png" alt="FC 능곡" className="h-6 w-6" />
          <span className="text-sm font-semibold tracking-tight text-foreground sm:text-base">
            FC Neunggok
          </span>
        </a>

        <nav className="hidden items-center gap-5 text-sm text-muted-foreground md:flex">
          {navItems.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="inline-flex items-center gap-1 rounded-full px-2 py-1 transition-colors hover:text-foreground"
            >
              <span className="font-medium">{item.label}</span>
              {item.hasDropdown ? <ChevronDown className="h-4 w-4 opacity-70" /> : null}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          <Button
            asChild
            variant="outline"
            size="sm"
            className="hidden rounded-full border-border/70 bg-white/70 text-foreground shadow-sm backdrop-blur hover:bg-white sm:inline-flex"
          >
            <a href="#gallery">Request a demo</a>
          </Button>
          <AuthButton />
        </div>
      </div>
    </header>
  );
};

export default HomeHeader;
