import { useState, useEffect } from 'react';
import { ArrowDown, Leaf } from 'lucide-react';
import { useInView } from '@/hooks/useInView';

interface HeroSectionProps {
  onOpenInquiry: () => void;
}

function useCountUp(end: number, duration: number, active: boolean, delay = 0): number {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!active) return;
    let frame = 0;
    const timeoutId = setTimeout(() => {
      const startTime = performance.now();
      const tick = (now: number) => {
        const elapsed  = now - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const eased    = 1 - Math.pow(1 - progress, 3);
        setValue(Math.round(eased * end));
        if (progress < 1) frame = requestAnimationFrame(tick);
      };
      frame = requestAnimationFrame(tick);
    }, delay);
    return () => { clearTimeout(timeoutId); cancelAnimationFrame(frame); };
  }, [active, end, duration, delay]);
  return value;
}

function useTypewriter(text: string, duration: number, active: boolean, delay = 0): string {
  const [displayed, setDisplayed] = useState('');
  useEffect(() => {
    if (!active) return;
    let intervalId: ReturnType<typeof setInterval> | undefined;
    const timeoutId = setTimeout(() => {
      const charInterval = Math.max(Math.floor(duration / text.length), 45);
      let index = 0;
      intervalId = setInterval(() => {
        index++;
        setDisplayed(text.slice(0, index));
        if (index >= text.length) clearInterval(intervalId);
      }, charInterval);
    }, delay);
    return () => { clearTimeout(timeoutId); if (intervalId !== undefined) clearInterval(intervalId); };
  }, [active, text, duration, delay]);
  return displayed;
}

const TYPEWRITER_TARGET = 'Made in USA';

export default function HeroSection({ onOpenInquiry }: HeroSectionProps) {
  const { ref, inView } = useInView();
  const { ref: statsRef, inView: statsInView } = useInView();

  const pct    = useCountUp(100,  1600, statsInView, 0);
  const lbs    = useCountUp(2,    1000, statsInView, 250);
  const litter = useCountUp(6121, 2400, statsInView, 500);
  const typed  = useTypewriter(TYPEWRITER_TARGET, 1100, statsInView, 750);
  const showCursor = statsInView && typed.length < TYPEWRITER_TARGET.length;

  const STATS = [
    { display: `${pct}%`,    label: 'Recycled Tees', desc: 'Sourced from local golf courses across Tampa' },
    { display: `${lbs}+ lbs`, label: 'Per Artwork',   desc: 'Sorted and hand-set into every frame'      },
    { display: `${litter.toLocaleString()} lbs`, label: 'Litter Removed', desc: 'And growing with every order' },
    { display: typed || ' ',         label: 'Proudly American',    desc: 'Handcrafted in Tampa, Florida', cursor: showCursor },
  ] as const;

  const scrollToArtwork = () => {
    document.querySelector('#artwork')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section
      className="relative flex flex-col lg:flex-row min-h-[100svh] overflow-hidden"
      style={{ backgroundColor: '#1B3D2C' }}
      aria-label="Hero"
    >
      {/* ── IMAGE PANEL — top on mobile, right on desktop ── */}
      <div
        className="relative order-1 lg:order-2 lg:w-[48%]"
        style={{
          backgroundColor: '#1B3D2C',
          minHeight: 'clamp(44vw, 52vw, 360px)',
        }}
      >
        <img
          src="/images/hero_image.webp"
          alt="ReTees founder standing at a recycling facility with a golf club, embodying the brand's sustainability mission"
          className="absolute inset-0 w-full h-full object-cover object-center lg:object-top"
          fetchPriority="high"
        />

        {/* LEFT feather — desktop only, blends into text panel */}
        <div
          className="absolute inset-y-0 left-0 w-52 pointer-events-none hidden lg:block"
          style={{ background: 'linear-gradient(to right, #1B3D2C 0%, transparent 100%)' }}
        />
        {/* RIGHT edge fade — desktop only */}
        <div
          className="absolute inset-y-0 right-0 w-12 pointer-events-none hidden lg:block"
          style={{ background: 'linear-gradient(to left, #1B3D2C 0%, transparent 100%)' }}
        />
        {/* TOP fade — full width on all sizes, covers header overlap */}
        <div
          className="absolute top-0 inset-x-0 pointer-events-none"
          style={{
            height: 'clamp(80px, 18vw, 140px)',
            background: 'linear-gradient(to bottom, #1B3D2C 0%, transparent 100%)',
          }}
        />
        {/* BOTTOM fade — full width, blends into text content below */}
        <div
          className="absolute bottom-0 inset-x-0 pointer-events-none"
          style={{
            height: 'clamp(80px, 18vw, 140px)',
            background: 'linear-gradient(to top, #1B3D2C 0%, transparent 100%)',
          }}
        />

        {/* Editorial caption — desktop only */}
        <div
          className="absolute bottom-6 right-6 hidden lg:flex items-center gap-2 px-3.5 py-2 rounded-full"
          style={{
            backgroundColor: 'rgba(255,255,255,0.07)',
            border: '1px solid rgba(255,255,255,0.10)',
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
          }}
        >
          <Leaf size={10} style={{ color: '#DDB870' }} />
          <span
            className="text-[0.6rem] font-medium tracking-[0.18em] uppercase"
            style={{ color: 'rgba(255,255,255,0.55)' }}
          >
            Handcrafted in Tampa, FL
          </span>
        </div>
      </div>

      {/* ── TEXT PANEL — bottom on mobile, left on desktop ── */}
      <div
        className="relative z-10 order-2 lg:order-1 flex flex-col justify-center
                   lg:w-[52%] xl:w-[52%]
                   px-7 sm:px-12 pt-8 pb-14
                   lg:pt-0 lg:pb-0 lg:min-h-[100svh]"
        style={{
          background: 'radial-gradient(ellipse at 72% 44%, #253F31 0%, #1B3D2C 68%)',
        }}
      >
        {/* Subtle gold seam between panels — desktop only */}
        <div
          className="absolute inset-y-0 right-0 w-px hidden lg:block"
          style={{ backgroundColor: 'rgba(221,184,112,0.14)' }}
        />

        <div
          ref={ref as React.RefObject<HTMLDivElement>}
          className={`reveal ${inView ? 'in-view' : ''} w-full max-w-xl mx-auto lg:mx-0 lg:ml-auto lg:pr-4 xl:pr-8`}
        >
          {/* Eyebrow */}
          <div className="flex items-center gap-2 mb-8">
            <span
              className="inline-flex items-center gap-1.5 text-xs font-medium px-3.5 py-1.5 rounded-full"
              style={{
                backgroundColor: 'rgba(255,255,255,0.09)',
                color: 'rgba(255,255,255,0.72)',
              }}
            >
              <Leaf size={11} />
              Sustainable Golf Art · Tampa, FL
            </span>
          </div>

          {/* Headline */}
          <h1
            className="font-display font-semibold text-white leading-none mb-6"
            style={{
              fontSize: 'clamp(40px, 4.2vw, 60px)',
              letterSpacing: '-1.8px',
              lineHeight: 0.93,
            }}
          >
            Where{' '}
            <em style={{ color: '#DDB870', fontStyle: 'italic' }}>Recycled</em>
            <br />
            Tees Become{' '}
            <span style={{ color: '#DDB870' }}>Art.</span>
          </h1>

          {/* Gold rule */}
          <div
            className="w-10 h-0.5 mb-6"
            style={{ backgroundColor: 'rgba(221,184,112,0.55)' }}
          />

          {/* Body */}
          <p
            className="text-sm sm:text-[0.9375rem] leading-relaxed mb-9 max-w-sm"
            style={{ color: 'rgba(255,255,255,0.55)' }}
          >
            Every piece is handcrafted from recycled golf tees — transformed into
            one-of-a-kind framed artwork that celebrates the game, the course,
            and the environment.
          </p>

          {/* CTAs */}
          <div className="flex flex-wrap gap-3">
            <button
              onClick={onOpenInquiry}
              className="btn-sweep-dark inline-flex items-center text-sm font-semibold rounded-full px-6 py-3.5 transition-all hover:opacity-90 active:scale-95 cursor-pointer"
              style={{ backgroundColor: '#FAFAF6', color: '#1B3D2C' }}
            >
              Inquire About a Custom Piece
            </button>
            <button
              onClick={scrollToArtwork}
              className="btn-sweep inline-flex items-center gap-1.5 text-sm font-medium text-white rounded-full px-6 py-3.5 border transition-all cursor-pointer"
              style={{ borderColor: 'rgba(255,255,255,0.26)' }}
              onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.07)')}
              onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
            >
              View Artwork
              <ArrowDown size={13} />
            </button>
          </div>

          {/* ── Stats ── */}
          <div
            ref={statsRef as React.RefObject<HTMLDivElement>}
            className="mt-10 pt-8 grid grid-cols-2 sm:grid-cols-4 gap-y-6"
            style={{ borderTop: '1px solid rgba(255,255,255,0.10)' }}
          >
            {STATS.map((stat, i) => (
              <div key={i} className="flex flex-col pr-4">
                {/* Animated value */}
                <p
                  className="font-display font-bold tabular-nums leading-none mb-1.5 flex items-baseline gap-px"
                  style={{
                    fontSize: stat.display.length > 9 ? '1.1rem' : '1.5rem',
                    color: '#DDB870',
                    letterSpacing: '-0.5px',
                    minHeight: '1.75rem',
                  }}
                >
                  {stat.display}
                  {'cursor' in stat && stat.cursor && (
                    <span className="stat-cursor" aria-hidden="true" style={{ color: '#DDB870' }}>|</span>
                  )}
                </p>
                <p className="text-[0.625rem] font-semibold uppercase tracking-widest mb-0.5 text-white">
                  {stat.label}
                </p>
                <p className="text-[0.625rem] leading-snug" style={{ color: 'rgba(255,255,255,0.40)' }}>
                  {stat.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
