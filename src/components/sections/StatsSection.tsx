import { useState, useEffect } from 'react';
import { useInView } from '@/hooks/useInView';

/* ── Counts from 0 → end using cubic ease-out, starting after `delay` ms ── */
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
        const eased    = 1 - Math.pow(1 - progress, 3); // cubic ease-out
        setValue(Math.round(eased * end));
        if (progress < 1) frame = requestAnimationFrame(tick);
      };
      frame = requestAnimationFrame(tick);
    }, delay);

    return () => {
      clearTimeout(timeoutId);
      cancelAnimationFrame(frame);
    };
  }, [active, end, duration, delay]);

  return value;
}

/* ── Reveals text character-by-character, starting after `delay` ms ── */
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

    return () => {
      clearTimeout(timeoutId);
      if (intervalId !== undefined) clearInterval(intervalId);
    };
  }, [active, text, duration, delay]);

  return displayed;
}

const TYPEWRITER_TARGET = 'Made in USA';

export default function StatsSection() {
  const { ref, inView } = useInView();

  const pct    = useCountUp(100,  1600, inView, 0);
  const lbs    = useCountUp(2,    1000, inView, 250);
  const litter = useCountUp(6121, 2400, inView, 500);
  const typed  = useTypewriter(TYPEWRITER_TARGET, 1100, inView, 750);

  const showCursor = inView && typed.length < TYPEWRITER_TARGET.length;

  const STATS: { display: string; label: string; desc: string; cursor?: boolean }[] = [
    {
      display: `${pct}%`,
      label:   'Recycled',
      desc:    'Every material is sustainably sourced',
    },
    {
      display: `${lbs} lbs`,
      label:   'Litter Removed Per Pack',
      desc:    'Each purchase funds cleanup efforts',
    },
    {
      display: `${litter.toLocaleString()} lbs`,
      label:   'Total Litter Removed',
      desc:    'And growing with every order',
    },
    {
      display: typed || ' ', // non-breaking space holds height before typing starts
      label:   'Proudly American',
      desc:    'Handcrafted in Tampa, Florida',
      cursor:  showCursor,
    },
  ];

  return (
    <section
      className="py-10 sm:py-12"
      style={{ backgroundColor: '#1B3D2C' }}
      aria-label="Sustainability impact statistics"
    >
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        <div
          ref={ref as React.RefObject<HTMLDivElement>}
          className="grid grid-cols-2 lg:grid-cols-4 gap-px"
          style={{ backgroundColor: 'rgba(255,255,255,0.10)' }}
        >
          {STATS.map((stat, i) => (
            <div
              key={i}
              className="flex flex-col items-center text-center px-4 sm:px-6 py-8"
              style={{ backgroundColor: '#1B3D2C' }}
            >
              {/* Animated value */}
              <p
                className="font-display font-bold leading-none mb-1.5 tabular-nums"
                style={{
                  fontSize:   stat.display.length > 9 ? '1.45rem' : '2.25rem',
                  color:      '#DDB870',
                  letterSpacing: '-0.5px',
                  minHeight:  '2.75rem',
                  display:    'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '1px',
                }}
              >
                {stat.display}
                {stat.cursor && (
                  <span className="stat-cursor" aria-hidden="true" style={{ color: '#DDB870' }}>
                    |
                  </span>
                )}
              </p>

              <p className="text-xs font-semibold uppercase tracking-widest mb-1 text-white">
                {stat.label}
              </p>
              <p className="text-xs leading-snug" style={{ color: 'rgba(255,255,255,0.45)' }}>
                {stat.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
