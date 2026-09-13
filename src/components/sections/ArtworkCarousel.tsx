import { useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useInView } from '@/hooks/useInView';
import ArtworkLightbox from '@/components/modals/ArtworkLightbox';

const ARTWORKS = [
  {
    src:   '/images/art0.jpg',
    alt:   'Bob Does Sports logo made from recycled golf tees — branding for the popular golf YouTube channel hosted by Bobby Fairways and the Breezy Golf crew',
    title: 'Bob Does Sports',
  },
  {
    src:   '/images/art1.jpg',
    alt:   'American flag made from recycled golf tees — red, white, and blue tees arranged in the stars and stripes pattern in a matted frame',
    title: 'American Flag',
  },
  {
    src:   '/images/art2.jpg',
    alt:   'Florida Gators logo made from recycled golf tees — orange and blue tees forming the interlocking UF in a framed display',
    title: 'Florida Gators',
  },
  {
    src:   '/images/art3.jpg',
    alt:   'Florida State Seminoles spear logo made from recycled golf tees — garnet and gold tees on a dark background in a matted frame',
    title: 'FSU Spear',
  },
  {
    src:   '/images/art4.webp',
    alt:   'East Carolina University Pirates logo made from recycled golf tees — purple and gold tees forming the ECU Pirates insignia',
    title: 'ECU Pirates',
  },
  {
    src:   '/images/art5.jpg',
    alt:   'Florida State Seminoles Chief Osceola logo made from recycled golf tees — garnet and gold tees in a framed display',
    title: 'Florida Seminoles',
  },
  {
    src:   '/images/art6.jpg',
    alt:   'NC State Wolfpack logo made from recycled golf tees — red, black, and white tees forming the Wolfpack insignia',
    title: 'NC State',
  },
  {
    src:   '/images/art8.webp',
    alt:   'Ohio State Buckeyes logo made from recycled golf tees — scarlet and gray tees forming the Block O in a matted frame',
    title: 'Ohio State',
  },
  {
    src:   '/images/art9.jpg',
    alt:   'Oak Valley Golf Course logo made from recycled golf tees — green tees arranged in the course logo design',
    title: 'Oak Valley',
  },
  {
    src:   '/images/art10.jpg',
    alt:   'Custom monogram initials made from recycled golf tees — personalized letter artwork in a framed display',
    title: 'Custom Initials',
  },
  {
    src:   '/images/art11.webp',
    alt:   'Milwaukee logo made from recycled golf tees — team colors rendered in recycled tee artwork in a framed display',
    title: 'Milwaukee',
  },
  {
    src:   '/images/art12.jpg',
    alt:   'University of Utah Utes logo made from recycled golf tees — red and white tees forming the Utes block U insignia',
    title: 'Utah Utes',
  },
  {
    src:   '/images/art13.webp',
    alt:   'University of Kentucky logo made from recycled golf tees — blue and white tees in a matted frame',
    title: 'University of Kentucky',
  },
  {
    src:   '/images/art14.webp',
    alt:   'University of Miami Hurricanes U logo made from recycled golf tees — orange, green, and white tees in a framed display',
    title: 'University of Miami',
  },
  {
    src:   '/images/art15.webp',
    alt:   'Miami Ohio RedHawks logo made from recycled golf tees — red and white tees forming the RedHawks insignia in a framed display',
    title: 'Miami Ohio',
  },
  {
    src:   '/images/art16.jpg',
    alt:   'Pelican XC logo made from recycled golf tees — black and blue tees forming a pelican silhouette with script lettering in a framed display',
    title: 'Pelican XC',
  },
  {
    src:   '/images/art17.jpg',
    alt:   'Golden retriever portrait made from recycled golf tees — tan and black tees forming the dog’s face, ears, and nose in a dark wood frame',
    title: 'Golden Retriever',
  },
  {
    src:   '/images/art18.jpg',
    alt:   'Black Labrador retriever made from recycled golf tees — black tees with a red collar accent and an engraved "2026 U.S. Girls\' Junior Champion" nameplate in a black frame',
    title: 'U.S. Girls Junior Champion',
  },
  {
    src:   '/images/art19.jpg',
    alt:   'Company Logo made from recycled golf tees — blue and black tees outlining a gator company logo above "SSD" and "SFL7" lettering in a black frame',
    title: 'Company Logo',
  },
  {
    src:   '/images/art20.jpg',
    alt:   'Phoenix Suns retro logo made from recycled golf tees — blue "PHOENIX SUNS" lettering around an orange basketball on a red sunburst in a gold frame',
    title: 'Phoenix Suns',
  },
  {
    src:   '/images/art21.jpg',
    alt:   'Rally in the Valley Champion artwork made from recycled golf tees — black and white tees forming a moonshine jug with "CHAMPION" lettering in a black frame',
    title: 'Rally in the Valley Champion',
  },
  {
    src:   '/images/art22.jpeg',
    alt:   'Rally in the Valley Sweetens Cove artwork made from recycled golf tees — multicolor tees forming a moonshine jug with "SWEETENS COVE" lettering and paint splatter in a gold frame',
    title: 'Sweetens Cove',
  },
];

// Duplicate for seamless infinite loop
const TRACK_ITEMS = [...ARTWORKS, ...ARTWORKS];

const CARD_STEP      = 268 + 16; // card width + .artwork-card-wrapper trailing margin (1rem)
const LOOP_SECONDS   = 65;       // auto-scroll: time for one full set to pass
const DRAG_THRESHOLD = 6;        // px of horizontal movement before a press becomes a drag
const RESUME_DELAY   = 2000;     // ms the carousel must sit untouched before auto-scroll restarts
const RESUME_RAMP    = 0.6;      // s to ease auto-scroll back up to full speed

// Touch "hover" state: pops the given artwork (both duplicated copies) and dims the rest.
function setActiveArtwork(track: HTMLElement, index: number | null) {
  track.classList.toggle('has-active', index !== null);
  track.querySelectorAll<HTMLElement>('[data-artwork]').forEach(el => {
    el.classList.toggle('is-active', index !== null && Number(el.dataset.artwork) === index);
  });
}

interface ArtworkCarouselProps {
  onOpenInquiry: () => void;
}

export default function ArtworkCarousel({ onOpenInquiry }: ArtworkCarouselProps) {
  const { ref: headRef, inView: headIn } = useInView();
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const marqueeRef = useRef<HTMLDivElement>(null);
  const trackRef   = useRef<HTMLDivElement>(null);
  const [onScreen, setOnScreen] = useState(false);

  // Mutable scroll state, kept out of React state so dragging and the
  // animation frame loop never trigger re-renders. `offset` grows without
  // bound; it's wrapped into one set's width only when painted.
  const motion = useRef({
    offset:        0,
    painted:       NaN,
    setWidth:      0,
    target:        null as number | null, // arrow-button destination
    velocity:      0,                     // px/s of post-drag momentum
    lastTouched:   -Infinity,             // performance.now() of the last user interaction / motion
    autoSpeed:     1,                     // 0→1 ramp so auto-scroll eases back in
    lightboxOpen:  false,
    hovered:       false,
    pressedArtwork: null as number | null, // artwork under the current touch press
    activeArtwork:  null as number | null, // artwork showing the touch hover state
    pointerId:     null as number | null,
    dragging:      false,
    startX:        0,
    startOffset:   0,
    lastX:         0,
    lastT:         0,
    suppressClick: false,
  });

  // Pause the loop whenever the carousel is off-screen.
  useEffect(() => {
    const el = marqueeRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => setOnScreen(entry.isIntersecting),
      { threshold: 0.01 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Width of one set of artworks — exactly half the duplicated track, since
  // every card carries its own trailing margin.
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const measure = () => { motion.current.setWidth = track.offsetWidth / 2; };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(track);
    return () => observer.disconnect();
  }, []);

  // Frame loop: arrow easing → drag momentum → auto-scroll, then paint.
  // Any user-driven motion keeps refreshing `lastTouched`, so the resume
  // countdown only starts once the carousel has come to rest.
  useEffect(() => {
    if (!onScreen) return;
    let frame = 0;
    let last  = performance.now();

    const tick = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      const m = motion.current;
      let auto = false;

      if (m.dragging) {
        m.lastTouched = now;
      } else if (m.target !== null) {
        m.lastTouched = now;
        const diff = m.target - m.offset;
        if (Math.abs(diff) < 0.5) {
          m.offset = m.target;
          m.target = null;
        } else {
          m.offset += diff * (1 - Math.exp(-dt * 10));
        }
      } else if (Math.abs(m.velocity) > 5) {
        m.lastTouched = now;
        m.offset   += m.velocity * dt;
        m.velocity *= Math.exp(-dt * 4);
      } else {
        m.velocity = 0;
        auto =
          now - m.lastTouched >= RESUME_DELAY &&
          m.pointerId === null &&
          !m.hovered &&
          !m.lightboxOpen &&
          m.setWidth > 0;
      }

      if (auto) {
        m.autoSpeed = Math.min(1, m.autoSpeed + dt / RESUME_RAMP);
        m.offset   += (m.setWidth / LOOP_SECONDS) * m.autoSpeed * dt;
      } else {
        m.autoSpeed = 0;
      }

      const track = trackRef.current;
      if (track && m.setWidth && m.offset !== m.painted) {
        const x = ((m.offset % m.setWidth) + m.setWidth) % m.setWidth;
        track.style.transform = `translate3d(${-x}px, 0, 0)`;
        m.painted = m.offset;

        // Once the touch-hovered card has moved fully out of frame, drop its hover state.
        const container = marqueeRef.current;
        if (m.activeArtwork !== null && container) {
          const bounds = container.getBoundingClientRect();
          const inFrame = Array.from(
            track.querySelectorAll(`[data-artwork="${m.activeArtwork}"]`)
          ).some(el => {
            const r = el.getBoundingClientRect();
            return r.right > bounds.left && r.left < bounds.right;
          });
          if (!inFrame) {
            m.activeArtwork = null;
            setActiveArtwork(track, null);
          }
        }
      }

      frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [onScreen]);

  // Horizontal trackpad / shift+wheel scrolling. Registered natively so it can
  // be non-passive; vertical wheel input is left alone for page scrolling.
  useEffect(() => {
    const el = marqueeRef.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      const horizontal = Math.abs(e.deltaX) > Math.abs(e.deltaY);
      const delta = horizontal ? e.deltaX : e.shiftKey ? e.deltaY : 0;
      if (!delta) return;
      e.preventDefault();
      const m = motion.current;
      m.lastTouched = performance.now();
      m.target   = null;
      m.velocity = 0;
      m.offset  += e.deltaMode === 1 ? delta * 16 : delta;
    };
    el.addEventListener('wheel', onWheel, { passive: false });
    return () => el.removeEventListener('wheel', onWheel);
  }, []);

  // Tapping anywhere outside the carousel clears the touch hover state.
  useEffect(() => {
    const onPointerDown = (e: PointerEvent) => {
      const m = motion.current;
      if (m.activeArtwork === null || marqueeRef.current?.contains(e.target as Node)) return;
      m.activeArtwork = null;
      if (trackRef.current) setActiveArtwork(trackRef.current, null);
    };
    document.addEventListener('pointerdown', onPointerDown);
    return () => document.removeEventListener('pointerdown', onPointerDown);
  }, []);

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType === 'mouse' && e.button !== 0) return;
    const m = motion.current;
    const card = (e.target as Element).closest<HTMLElement>('[data-artwork]');
    m.pressedArtwork = card ? Number(card.dataset.artwork) : null;
    m.pointerId     = e.pointerId;
    m.dragging      = false;
    m.suppressClick = false;
    m.startX        = m.lastX = e.clientX;
    m.startOffset   = m.offset;
    m.lastT         = e.timeStamp;
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const m = motion.current;
    if (e.pointerId !== m.pointerId) return;
    const dx = e.clientX - m.startX;

    if (!m.dragging) {
      if (Math.abs(dx) < DRAG_THRESHOLD) return;
      // Capture only once it's a real drag — capturing on pointerdown would
      // retarget the click away from the card and break opening the lightbox.
      m.dragging    = true;
      m.target      = null;
      m.velocity    = 0;
      m.startOffset = m.offset;
      e.currentTarget.setPointerCapture(e.pointerId);
      e.currentTarget.classList.add('is-dragging');
    }

    m.offset = m.startOffset - dx;
    const dt = e.timeStamp - m.lastT;
    if (dt > 0) {
      const v = (-(e.clientX - m.lastX) / dt) * 1000;
      m.velocity = m.velocity * 0.2 + v * 0.8;
    }
    m.lastX = e.clientX;
    m.lastT = e.timeStamp;
  };

  const endPointer = (e: React.PointerEvent<HTMLDivElement>) => {
    const m = motion.current;
    if (e.pointerId !== m.pointerId) return;
    // Lifting a finger (after a tap or a drag) gives the pressed card the hover look.
    // A cancelled press — e.g. the browser took over for vertical page scrolling — doesn't.
    if (e.type === 'pointerup' && e.pointerType !== 'mouse' && trackRef.current) {
      m.activeArtwork = m.pressedArtwork;
      setActiveArtwork(trackRef.current, m.activeArtwork);
    }
    if (m.dragging) {
      m.suppressClick = true;
      e.currentTarget.classList.remove('is-dragging');
      // No momentum if the pointer was held still before release, or the gesture was cancelled.
      if (e.type === 'pointercancel' || e.timeStamp - m.lastT > 80) m.velocity = 0;
    }
    m.dragging  = false;
    m.pointerId = null;
  };

  // Swallow the click that ends a drag so it doesn't open the lightbox.
  // Keyboard-triggered clicks (detail === 0) always go through.
  const handleClickCapture = (e: React.MouseEvent<HTMLDivElement>) => {
    const m = motion.current;
    if (m.suppressClick && e.detail !== 0) {
      e.stopPropagation();
      e.preventDefault();
    }
    m.suppressClick = false;
  };

  // Mouse hover pauses auto-scroll; touch "hover" is ignored so a tap can't stick it paused.
  const handlePointerEnter = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType === 'mouse') motion.current.hovered = true;
  };

  const handlePointerLeave = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType === 'mouse') motion.current.hovered = false;
  };

  const nudge = (dir: 1 | -1) => {
    const m = motion.current;
    m.lastTouched = performance.now();
    m.velocity = 0;
    const base = m.target ?? m.offset;
    m.target = Math.round(base / CARD_STEP) * CARD_STEP + dir * CARD_STEP;
  };

  const openLightbox = (trackIndex: number) => {
    // Map duplicated track index back to original artwork index
    setLightboxIndex(trackIndex % ARTWORKS.length);
    motion.current.lightboxOpen = true;
  };

  // Restart the idle countdown on close so the carousel doesn't lurch the moment the lightbox disappears.
  const closeLightbox = () => {
    setLightboxIndex(null);
    motion.current.lightboxOpen = false;
    motion.current.lastTouched  = performance.now();
  };

  const prevArtwork = () =>
    setLightboxIndex(i => (i === null ? 0 : (i - 1 + ARTWORKS.length) % ARTWORKS.length));

  const nextArtwork = () =>
    setLightboxIndex(i => (i === null ? 0 : (i + 1) % ARTWORKS.length));

  return (
    <>
      <section
        id="artwork"
        className="pt-16 pb-14 sm:pt-20 sm:pb-16 overflow-hidden"
        style={{ backgroundColor: '#F5F0E8' }}
        aria-labelledby="artwork-heading"
      >
        {/* Section header */}
        <div
          ref={headRef as React.RefObject<HTMLDivElement>}
          className={`reveal ${headIn ? 'in-view' : ''} max-w-7xl mx-auto px-5 sm:px-8 mb-10`}
        >
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-5">
            <div>
              <p className="section-label mb-3">The Collection</p>
              <h2
                id="artwork-heading"
                className="font-display font-semibold tracking-tight"
                style={{ fontSize: 'clamp(28px, 4vw, 46px)', color: '#1A1A1A', letterSpacing: '-1px' }}
              >
                Custom Art Pieces
              </h2>
            </div>
            <button
              onClick={onOpenInquiry}
              className="btn-sweep self-start sm:self-auto text-sm font-medium text-white rounded-full px-7 py-3 transition-all hover:opacity-90 active:scale-95"
              style={{ backgroundColor: '#1B3D2C', flexShrink: 0 }}
            >
              Start Your Custom Piece
            </button>
          </div>
        </div>

        {/* Infinite marquee — auto-scrolls, pausing whenever the user clicks, drags, scrolls, or uses the arrows */}
        <div className="relative">
        <div
          ref={marqueeRef}
          className="marquee-container artwork-marquee"
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={endPointer}
          onPointerCancel={endPointer}
          onPointerEnter={handlePointerEnter}
          onPointerLeave={handlePointerLeave}
          onClickCapture={handleClickCapture}
          onClick={() => { motion.current.lastTouched = performance.now(); }}
          onDragStart={e => e.preventDefault()}
        >
          <div
            ref={trackRef}
            id="artwork-track"
            className="marquee-track"
            aria-label="Artwork carousel"
          >
            {TRACK_ITEMS.map((artwork, i) => (
              <div key={i} className="flex-shrink-0 artwork-card-wrapper" data-artwork={i % ARTWORKS.length}>
              <button
                type="button"
                className="overflow-hidden rounded-xl bg-white text-left artwork-card block"
                style={{
                  width:  '268px',
                  border: '1px solid rgba(27,61,44,0.07)',
                  cursor: 'pointer',
                }}
                onClick={() => openLightbox(i)}
                aria-label={`View ${artwork.title} — click to enlarge`}
                aria-hidden={i >= ARTWORKS.length}
                tabIndex={i >= ARTWORKS.length ? -1 : 0}
              >
                <div className="relative overflow-hidden">
                  <img
                    src={artwork.src}
                    alt={artwork.alt}
                    width={268}
                    height={320}
                    decoding="async"
                    loading="eager"
                    draggable={false}
                    className="w-full object-cover block transition-transform duration-500"
                    style={{ height: '320px', objectPosition: 'center 10%' }}
                  />
                  {/* Hover overlay hint */}
                  <div
                    className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-300"
                    style={{ backgroundColor: 'rgba(6,18,10,0.45)' }}
                    aria-hidden="true"
                  >
                    <span
                      className="text-xs font-semibold tracking-widest uppercase px-4 py-2 rounded-full"
                      style={{ backgroundColor: 'rgba(255,255,255,0.15)', color: '#FFFFFF', border: '1px solid rgba(255,255,255,0.25)', backdropFilter: 'blur(4px)' }}
                    >
                      View
                    </span>
                  </div>
                </div>
                <div className="px-4 py-3">
                  <p className="font-display text-base font-semibold" style={{ color: '#1A1A1A' }}>
                    {artwork.title}
                  </p>
                  <p className="text-xs mt-0.5" style={{ color: '#9B9B9B' }}>
                    Recycled golf tees
                  </p>
                </div>
              </button>
              </div>
            ))}
          </div>
        </div>

          {/* Manual controls — outside the masked container so the edge fade doesn't dim them */}
          <button
            type="button"
            onClick={() => nudge(-1)}
            aria-label="Previous artwork"
            aria-controls="artwork-track"
            className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 z-10 flex items-center justify-center w-11 h-11 rounded-full bg-white text-[#1B3D2C] border border-[rgba(27,61,44,0.12)] shadow-[0_6px_20px_rgba(6,18,10,0.14)] transition-all hover:bg-[#1B3D2C] hover:text-white hover:scale-105 active:scale-95"
          >
            <ChevronLeft className="w-5 h-5" aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={() => nudge(1)}
            aria-label="Next artwork"
            aria-controls="artwork-track"
            className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 z-10 flex items-center justify-center w-11 h-11 rounded-full bg-white text-[#1B3D2C] border border-[rgba(27,61,44,0.12)] shadow-[0_6px_20px_rgba(6,18,10,0.14)] transition-all hover:bg-[#1B3D2C] hover:text-white hover:scale-105 active:scale-95"
          >
            <ChevronRight className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>


      </section>

      <ArtworkLightbox
        artworks={ARTWORKS}
        selectedIndex={lightboxIndex}
        onClose={closeLightbox}
        onPrev={prevArtwork}
        onNext={nextArtwork}
      />
    </>
  );
}
