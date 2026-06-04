import { Mail, Phone } from 'lucide-react';

/* Inline SVG brand icons — Lucide v1.x removed brand/social icons */
function IconInstagram({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none" />
    </svg>
  );
}

function IconYouTube({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  );
}

function IconTikTok({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.17 8.17 0 0 0 4.77 1.52V6.74a4.85 4.85 0 0 1-1-.05z" />
    </svg>
  );
}

function IconX({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

const QUICK_LINKS = [
  { label: 'Artwork',    href: '#artwork'    },
  { label: 'About',      href: '#about'      },
  { label: 'Tournament', href: '#tournament' },
  { label: 'Sponsors',   href: '#sponsors'   },
  { label: 'Shop',       href: '#shop'       },
];

interface FooterProps {
  onOpenInquiry: () => void;
}

export default function Footer({ onOpenInquiry }: FooterProps) {
  const scrollTo = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <footer id="contact" style={{ scrollMarginTop: '80px' }}>
      {/* Contact CTA band */}
      <div
        className="py-20 px-5 sm:px-8 text-center"
        style={{ backgroundColor: '#1B3D2C', color: '#FAFAF6' }}
      >
        <p className="section-label mb-4 opacity-60" style={{ color: '#A8C8B8' }}>
          Start a conversation
        </p>
        <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight leading-tight mb-5">
          Ready to create something
          <br />
          <em>extraordinary?</em>
        </h2>
        <p className="text-sm sm:text-base leading-relaxed mb-10 max-w-md mx-auto opacity-70">
          Commission a custom piece, inquire about tournament sponsorship, or just say hello.
          We'd love to hear from you.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={onOpenInquiry}
            className="btn-sweep-dark text-sm font-medium rounded-full px-7 py-3 transition-all hover:opacity-90 active:scale-95"
            style={{ backgroundColor: '#FAFAF6', color: '#1B3D2C' }}
          >
            Inquire Now
          </button>
          <a
            href="mailto:nik@retees.com"
            className="btn-sweep text-sm font-medium text-white rounded-full px-7 py-3 border transition-all hover:border-white/60"
            style={{ borderColor: 'rgba(255,255,255,0.3)' }}
          >
            Email Us
          </a>
        </div>
      </div>

      {/* Footer bar */}
      <div
        className="px-5 sm:px-8 py-10"
        style={{ backgroundColor: '#0A1F15' }}
      >
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 pb-8 border-b" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>

            {/* Brand */}
            <div>
              <div
                className="rounded-lg px-2.5 py-1.5 inline-block mb-4"
                style={{ backgroundColor: '#FFFFFF' }}
              >
                <img
                  src="/images/logo.PNG"
                  alt="ReTees"
                  style={{ height: '26px', width: 'auto', display: 'block' }}
                />
              </div>
              <p className="text-xs leading-relaxed mb-4" style={{ color: 'rgba(255,255,255,0.45)' }}>
                Custom golf artwork handcrafted<br />from recycled golf tees.
              </p>
              <div className="flex items-center gap-3">
                <a
                  href="https://www.instagram.com/reteesgolf"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="ReTees on Instagram"
                  className="transition-colors hover:text-white"
                  style={{ color: 'rgba(255,255,255,0.45)' }}
                >
                  <IconInstagram size={18} />
                </a>
                <a
                  href="https://www.youtube.com/@reteesgolf"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="ReTees on YouTube"
                  className="transition-colors hover:text-white"
                  style={{ color: 'rgba(255,255,255,0.45)' }}
                >
                  <IconYouTube size={18} />
                </a>
                <a
                  href="https://www.tiktok.com/@reteesgolf"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="ReTees on TikTok"
                  className="transition-colors hover:text-white"
                  style={{ color: 'rgba(255,255,255,0.45)' }}
                >
                  <IconTikTok size={18} />
                </a>
                <a
                  href="https://x.com/ReTeesGolf/status/1835130520998494509"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="ReTees on X"
                  className="transition-colors hover:text-white"
                  style={{ color: 'rgba(255,255,255,0.45)' }}
                >
                  <IconX size={18} />
                </a>
              </div>
            </div>

            {/* Quick links */}
            <div>
              <p className="text-xs font-medium tracking-widest uppercase mb-4" style={{ color: '#A8C8B8' }}>
                Navigation
              </p>
              <nav className="flex flex-col gap-2.5" aria-label="Footer navigation">
                {QUICK_LINKS.map(link => (
                  <a
                    key={link.href}
                    href={link.href}
                    onClick={(e) => scrollTo(e, link.href)}
                    className="text-sm transition-colors hover:text-white"
                    style={{ color: 'rgba(255,255,255,0.50)' }}
                  >
                    {link.label}
                  </a>
                ))}
              </nav>
            </div>

            {/* Contact */}
            <div>
              <p className="text-xs font-medium tracking-widest uppercase mb-4" style={{ color: '#A8C8B8' }}>
                Contact
              </p>
              <div className="flex flex-col gap-3">
                <a
                  href="mailto:nik@retees.com"
                  className="flex items-center gap-2 text-sm transition-colors hover:text-white"
                  style={{ color: 'rgba(255,255,255,0.50)' }}
                >
                  <Mail size={14} />
                  nik@retees.com
                </a>
                <a
                  href="tel:+18137318444"
                  className="flex items-center gap-2 text-sm transition-colors hover:text-white"
                  style={{ color: 'rgba(255,255,255,0.50)' }}
                >
                  <Phone size={14} />
                  813-731-8444
                </a>
              </div>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pt-6">
            <p className="text-xs" style={{ color: 'rgba(255,255,255,0.30)' }}>
              © {new Date().getFullYear()} ReTees. All rights reserved.
            </p>
            <p className="text-xs" style={{ color: 'rgba(255,255,255,0.25)' }}>
              Handcrafted in Tampa, FL
            </p>
          </div>
        </div>
      </div>

      {/*
        HUBSPOT: To enable tracking and CRM, paste your HubSpot analytics
        snippet here (or in index.html before </body>):
        <script type="text/javascript" id="hs-script-loader" async defer src="//js.hs-scripts.com/YOUR_HUB_ID.js"></script>
      */}
    </footer>
  );
}
