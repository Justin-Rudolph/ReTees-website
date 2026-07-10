import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';

const NAV_LINKS = [
  { label: 'Artwork',    href: '#artwork'    },
  { label: 'About',      href: '#about'      },
  { label: 'Tournament', href: '#tournament' },
  { label: 'Sponsors',   href: '#sponsors'   },
  { label: 'Shop',       href: '#shop'       },
  { label: 'Contact',    href: '#contact'    },
];

interface HeaderProps {
  onOpenInquiry: () => void;
}

export default function Header({ onOpenInquiry }: HeaderProps) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollTo = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });
    setMenuOpen(false);
  };

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      style={scrolled ? {
        background: 'rgba(245, 240, 232, 0.96)',
        backdropFilter: 'blur(14px)',
        WebkitBackdropFilter: 'blur(14px)',
        boxShadow: '0 1px 0 rgba(27,61,44,0.08)',
      } : {
        /* Subtle gradient anchors the header over the dark hero */
        background: 'linear-gradient(180deg, rgba(0,0,0,0.28) 0%, transparent 100%)',
      }}
    >
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">

          {/* Logo */}
          <a
            href="#"
            onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
            aria-label="ReTees home"
            className="min-w-0 mr-3"
          >
            <div
              className="rounded-lg px-2.5 py-1.5 transition-opacity hover:opacity-90"
              style={{
                backgroundColor: '#FFFFFF',
                boxShadow: '0 1px 6px rgba(0,0,0,0.12)',
                display: 'inline-flex',
                alignItems: 'center',
                maxWidth: '100%',
              }}
            >
              {/* max constraints + auto dimensions shrink the logo proportionally when space is tight */}
              <img
                src="/images/logo.PNG"
                alt="ReTees"
                style={{ maxHeight: '44px', maxWidth: '100%', width: 'auto', height: 'auto', display: 'block' }}
              />
            </div>
          </a>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-7" aria-label="Main navigation">
            {NAV_LINKS.map(link => (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => scrollTo(e, link.href)}
                className="text-sm font-medium transition-colors duration-200"
                style={{ color: scrolled ? '#5E6560' : 'rgba(255,255,255,0.90)' }}
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
            {/* Desktop CTA */}
            <button
              onClick={onOpenInquiry}
              className="btn-sweep hidden lg:inline-flex items-center text-sm font-medium rounded-full px-5 py-2.5 transition-all duration-200 hover:opacity-90 active:scale-95"
              style={scrolled ? {
                backgroundColor: '#1B3D2C',
                color: '#FFFFFF',
              } : {
                backgroundColor: 'rgba(255,255,255,0.15)',
                color: '#FFFFFF',
                border: '1px solid rgba(255,255,255,0.35)',
                backdropFilter: 'blur(8px)',
              }}
            >
              Custom Piece
            </button>

            {/* Mobile quick links */}
            {[
              { label: 'Tournament', href: '#tournament' },
              { label: 'Sponsors',   href: '#sponsors'   },
            ].map(link => (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => scrollTo(e, link.href)}
                className="lg:hidden whitespace-nowrap text-xs font-medium rounded-full px-3 py-1.5 transition-all duration-200 hover:opacity-90 active:scale-95"
                style={scrolled ? {
                  backgroundColor: '#1B3D2C',
                  color: '#FFFFFF',
                } : {
                  backgroundColor: 'rgba(255,255,255,0.15)',
                  color: '#FFFFFF',
                  border: '1px solid rgba(255,255,255,0.35)',
                  backdropFilter: 'blur(8px)',
                }}
              >
                {link.label}
              </a>
            ))}

            {/* Mobile hamburger */}
            <button
              onClick={() => setMenuOpen(v => !v)}
              className="lg:hidden p-2 rounded-md transition-colors"
              style={{ color: scrolled ? '#1B3D2C' : '#FFFFFF' }}
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={menuOpen}
              aria-controls="mobile-nav"
            >
              {menuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile slide-down menu — always cream so it's readable */}
      <div
        id="mobile-nav"
        className={`lg:hidden overflow-hidden transition-all duration-300 ${
          menuOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'
        }`}
        style={{
          background: 'rgba(245, 240, 232, 0.98)',
          backdropFilter: 'blur(14px)',
          WebkitBackdropFilter: 'blur(14px)',
        }}
        aria-hidden={!menuOpen}
      >
        <nav className="flex flex-col px-5 pb-4 pt-1" aria-label="Mobile navigation">
          {NAV_LINKS.map((link, i) => (
            <a
              key={link.href}
              href={link.href}
              onClick={(e) => scrollTo(e, link.href)}
              tabIndex={menuOpen ? undefined : -1}
              className={`py-3.5 text-sm font-medium transition-colors hover:text-rt-green ${
                i < NAV_LINKS.length - 1 ? 'border-b border-rt-green/[0.07]' : ''
              }`}
              style={{ color: '#5E6560' }}
            >
              {link.label}
            </a>
          ))}
          <button
            onClick={() => { onOpenInquiry(); setMenuOpen(false); }}
            tabIndex={menuOpen ? undefined : -1}
            className="btn-sweep mt-4 w-full text-sm font-medium text-white rounded-full py-3 transition-all hover:opacity-90"
            style={{ backgroundColor: '#1B3D2C' }}
          >
            Custom Piece
          </button>
        </nav>
      </div>
    </header>
  );
}
