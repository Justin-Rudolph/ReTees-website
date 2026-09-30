import { useEffect, useRef, useState } from 'react';
import { MapPin, Calendar, Trophy, ChevronLeft, ChevronRight } from 'lucide-react';
import { useInView } from '@/hooks/useInView';

// Slide order: champions, group photo, then tournament0–14.
const PHOTOS = [
  '2026_champs.JPEG',
  'group_pic.JPEG',
  ...Array.from({ length: 15 }, (_, i) => `tournament${i}.JPEG`),
].map(name => encodeURI(`/images/2026 tournament images/${name}`));
const SLIDE_MS = 4500;

/** One photo at a time, cross-fading, in a 3:2 landscape frame. The few
    portrait shots sit uncropped over a blurred copy of themselves. */
function PhotoCarousel() {
  const [index, setIndex] = useState(0);
  const [onScreen, setOnScreen] = useState(false);
  const frameRef = useRef<HTMLDivElement>(null);

  // Only cycle while at least half the carousel is visible; pause otherwise.
  useEffect(() => {
    const el = frameRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => setOnScreen(entry.isIntersecting),
      { threshold: 0.5 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Re-armed on every slide change, so a manual arrow click gets a full
  // SLIDE_MS before auto-advance kicks in again.
  useEffect(() => {
    if (!onScreen || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const id = setTimeout(() => setIndex(i => (i + 1) % PHOTOS.length), SLIDE_MS);
    return () => clearTimeout(id);
  }, [onScreen, index]);

  const step = (delta: number) => setIndex(i => (i + delta + PHOTOS.length) % PHOTOS.length);
  // Quiet by default (dim glass circle), fuller on frame hover or focus.
  const arrowClass = 'absolute top-1/2 -translate-y-1/2 z-10 flex items-center justify-center w-8 h-8 rounded-full bg-black/25 text-white/80 opacity-50 transition-all group-hover:opacity-100 focus-visible:opacity-100 hover:bg-black/45 hover:text-white active:scale-95';

  return (
    <div
      ref={frameRef}
      className="rounded-2xl overflow-hidden shadow-2xl"
      style={{ border: '1px solid rgba(255,255,255,0.12)' }}
    >
      <div className="group relative aspect-[3/2] bg-black">
        {PHOTOS.map((src, i) => (
          <div
            key={src}
            className="absolute inset-0 transition-opacity duration-1000 ease-in-out"
            style={{ opacity: i === index ? 1 : 0, pointerEvents: i === index ? 'auto' : 'none' }}
            aria-hidden={i !== index}
          >
            <img
              src={src}
              alt=""
              loading="lazy"
              decoding="async"
              className="absolute inset-0 w-full h-full object-cover scale-110 blur-xl opacity-60"
            />
            <img
              src={src}
              alt={i === 0
                ? '15 Majors and 3 Mugshots, the 2026 ReTees Invitational champions, holding the championship trophy'
                : `2026 ReTees Invitational, photo ${i + 1} of ${PHOTOS.length}`}
              loading="lazy"
              decoding="async"
              className="relative w-full h-full object-contain"
            />
          </div>
        ))}
        <button type="button" onClick={() => step(-1)} aria-label="Previous photo" className={`${arrowClass} left-3`}>
          <ChevronLeft className="w-4 h-4" aria-hidden="true" />
        </button>
        <button type="button" onClick={() => step(1)} aria-label="Next photo" className={`${arrowClass} right-3`}>
          <ChevronRight className="w-4 h-4" aria-hidden="true" />
        </button>
      </div>
      <div
        className="px-4 py-2.5 flex items-center justify-between"
        style={{ backgroundColor: 'rgba(0,0,0,0.55)' }}
      >
        <p className="text-xs font-semibold text-white">
          {index === 0 ? '2026 Invitational Champions' : '2026 ReTees Invitational'}
        </p>
        <p className="text-xs" style={{ color: 'rgba(255,255,255,0.45)' }}>Tampa, FL</p>
      </div>
    </div>
  );
}

interface TournamentSectionProps {
  onOpenTour: () => void;
}

export default function TournamentSection({ onOpenTour }: TournamentSectionProps) {
  const { ref, inView } = useInView();

  return (
    <section
      id="tournament"
      className="relative overflow-hidden"
      aria-labelledby="tournament-heading"
    >
      <div
        style={{
          backgroundImage: "url('/images/hertiage_isles.png')",
          backgroundSize: 'cover',
          backgroundPosition: 'center 55%',
        }}
      >
        <div style={{ backgroundColor: 'rgba(0, 10, 24, 0.87)' }}>
          <div className="max-w-7xl mx-auto px-5 sm:px-8 py-12 sm:py-16">

            <div
              ref={ref as React.RefObject<HTMLDivElement>}
              className={`reveal ${inView ? 'in-view' : ''} grid lg:grid-cols-[1fr_420px] xl:grid-cols-[1fr_500px] gap-8 lg:gap-14 items-center`}
            >

              {/* ── Left column: all info ── */}
              <div>
                {/* Badge */}
                <div
                  className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 mb-4 text-xs font-semibold tracking-widest uppercase"
                  style={{ backgroundColor: 'rgba(26,74,128,0.22)', color: '#DDB870', border: '1px solid rgba(221,184,112,0.35)' }}
                >
                  2nd Annual · Final Results
                </div>

                {/* Title */}
                <h2
                  id="tournament-heading"
                  className="font-display font-bold text-white leading-none mb-5"
                  style={{ fontSize: 'clamp(30px, 4vw, 52px)', letterSpacing: '-1.5px' }}
                >
                  The ReTees{' '}
                  <em style={{ color: '#DDB870' }}>Invitational</em>
                </h2>

                {/* Presenting sponsors — white knockout logos sit straight on
                    the dark backdrop, no plaque needed */}
                <div className="flex flex-col items-start gap-y-3 sm:flex-row sm:items-center sm:gap-x-5 mb-6">
                  <span
                    className="text-[10px] font-semibold tracking-[0.18em] uppercase"
                    style={{ color: 'rgba(255,255,255,0.45)' }}
                  >
                    Thank you to our sponsors
                  </span>
                  {/* Logos stay on one line together at every width */}
                  <div className="flex items-center gap-4 sm:gap-5">
                    <img
                      src="/images/pelican_xc_logo.png"
                      alt="Pelican XC"
                      width={795}
                      height={265}
                      loading="lazy"
                      decoding="async"
                      className="h-8 w-auto block"
                    />
                    <span
                      className="h-6 w-px block flex-shrink-0"
                      style={{ backgroundColor: 'rgba(221,184,112,0.35)' }}
                      aria-hidden="true"
                    />
                    <img
                      src="/images/mettel_logo.png"
                      alt="MetTel"
                      width={679}
                      height={234}
                      loading="lazy"
                      decoding="async"
                      className="h-6 w-auto block"
                    />
                  </div>
                </div>

                {/* Info chips */}
                <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-6">
                  {[
                    { icon: Calendar, text: 'Sept 26, 2026' },
                    { icon: MapPin,   text: 'Heritage Isles Golf & Country Club' },
                  ].map(chip => (
                    <div
                      key={chip.text}
                      className="inline-flex items-center gap-1.5 sm:gap-2 whitespace-nowrap rounded-full px-2.5 sm:px-3.5 py-1.5 text-[11px] sm:text-xs font-medium"
                      style={{ backgroundColor: 'rgba(255,255,255,0.09)', color: 'rgba(255,255,255,0.82)', border: '1px solid rgba(255,255,255,0.13)' }}
                    >
                      <chip.icon size={11} />
                      {chip.text}
                    </div>
                  ))}
                </div>

                {/* Champions */}
                <div
                  className="rounded-2xl p-5 sm:p-6 mb-7 max-w-xl"
                  style={{ backgroundColor: 'rgba(26,74,128,0.22)', border: '1px solid rgba(221,184,112,0.35)' }}
                >
                  <div className="flex items-center gap-1.5 mb-2">
                    <Trophy size={12} style={{ color: '#DDB870' }} />
                    <span className="text-xs font-bold tracking-widest uppercase" style={{ color: '#DDB870' }}>
                      2026 Champions
                    </span>
                  </div>
                  <p
                    className="font-display font-bold text-white leading-tight mb-2"
                    style={{ fontSize: 'clamp(26px, 4vw, 38px)', letterSpacing: '-1px' }}
                  >
                    15 Majors and 3 Mugshots
                  </p>
                  <p className="text-xs font-semibold mb-3" style={{ color: '#DDB870' }}>
                    Chase Johns · Carter Dill · Andrew So · Liam Valdes
                  </p>
                  <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.70)' }}>
                    Congratulations to 15 Majors and 3 Mugshots, and thank you to all 36 teams who
                    played. The next chapter of ReTees history tees off during the 2027 Tour. We hope to see you there.
                  </p>
                </div>

                {/* CTA */}
                <button
                  type="button"
                  onClick={onOpenTour}
                  className="btn-gold-shiny inline-flex items-center gap-2 text-sm font-bold text-black rounded-full px-6 py-3 active:scale-95"
                >
                  Join the 2027 Tour Waitlist
                  <ChevronRight size={14} />
                </button>
              </div>

              {/* ── Right column: photo carousel (below the text on mobile) ── */}
              <div className="w-full max-w-xl mx-auto lg:max-w-none">
                <PhotoCarousel />
              </div>

            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
