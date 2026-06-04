import { useInView } from '@/hooks/useInView';

const PARAGRAPHS_BEFORE_QUOTE = [
  "ReTees started in 2024 with a simple question: can I make a golf tee from recycled waste? That question led me down a path of researching the golf industry and exploring what sustainable products already existed. After countless hours of research, I realized there was nothing on the market like what I envisioned. So I set out on a mission to create the world's first golf tee made from 100% recycled post-consumer waste.",
  "What began as curiosity quickly turned into obsession. I spent months developing prototypes, learning about materials, and figuring out how to turn waste into something functional for golfers. While I was proud of what I created, throughout 2025 I realized just how labor-intensive the process was and that the product ultimately wasn't the right market fit.",
];

const PARAGRAPHS_AFTER_QUOTE = [
  "In January 2026, I made one of the biggest decisions of my life — I quit my corporate job and decided to pursue ReTees full-time by creating artwork from broken golf tees. At the time, I had never sold an art piece before and never truly considered myself an artist.",
  "After creating my first piece and sharing it on social media, the entire trajectory of ReTees changed overnight. What started as an idea centered around sustainable golf tees evolved into something much bigger: using golf waste as a medium for storytelling, creativity, and impact.",
  "Today, the mission behind ReTees remains the same as it was from the very beginning — to build a sustainable golf company focused on taking waste and recycling, repurposing, and upcycling it into innovative products. Whether it's broken golf tees transformed into artwork or future products built from recycled materials, the goal is to challenge how people think about waste.",
  "ReTees is about more than golf. It's about creativity, sustainability, faith, and building something that leaves a positive impact on the world. My hope is that through this journey, others are inspired to think differently about what's possible — both in business and in life.",
];

export default function AboutSection() {
  const { ref: textRef, inView: textIn } = useInView();

  return (
    <section
      id="about"
      className="py-20 sm:py-28"
      style={{ backgroundColor: '#FAFAF6' }}
      aria-labelledby="about-heading"
    >
      <div className="max-w-7xl mx-auto px-5 sm:px-8">

        <div className="grid lg:grid-cols-[400px_1fr] xl:grid-cols-[440px_1fr] gap-12 lg:gap-20 items-start">

          {/* ── Left: sticky photo — no transform animation to prevent GPU compositing blur ── */}
          <div className="lg:sticky lg:top-28">
            <div className="relative rounded-2xl overflow-hidden shadow-xl"
              style={{ border: '1px solid rgba(27,61,44,0.08)' }}
            >
              <img
                src="/images/self_portrait.webp"
                alt="Nik Schmidt, founder of ReTees"
                className="w-full object-cover block"
                style={{ height: '560px', objectPosition: 'center 12%' }}
              />
              {/* Name card gradient overlay */}
              <div
                className="absolute bottom-0 left-0 right-0 px-5 py-5"
                style={{ background: 'linear-gradient(to top, rgba(6,20,12,0.88) 0%, rgba(6,20,12,0.30) 60%, transparent 100%)' }}
              >
                <p className="font-display text-white font-semibold" style={{ fontSize: '1.15rem' }}>
                  Nik Schmidt
                </p>
                <p className="text-xs mt-0.5" style={{ color: 'rgba(221,184,112,0.85)' }}>
                  Founder &amp; Artist · ReTees
                </p>
              </div>
            </div>
          </div>

          {/* ── Right: story ── */}
          <div
            ref={textRef as React.RefObject<HTMLDivElement>}
            className={`reveal reveal-delay-1 ${textIn ? 'in-view' : ''}`}
          >
            <p className="section-label mb-3">The Founder</p>

            <h2
              id="about-heading"
              className="font-display font-semibold tracking-tight mb-7"
              style={{ fontSize: 'clamp(26px, 3.2vw, 40px)', color: '#1A1A1A', letterSpacing: '-0.5px', lineHeight: 1.15 }}
            >
              Hi, I'm Nik Schmidt,
              <br />
              <span style={{ color: '#1B3D2C' }}>founder of ReTees.</span>
            </h2>

            {/* Paragraphs 1–2 */}
            <div className="flex flex-col gap-5 mb-5">
              {PARAGRAPHS_BEFORE_QUOTE.map((p, i) => (
                <p key={i} className="text-base leading-relaxed" style={{ color: '#5E6560' }}>
                  {p}
                </p>
              ))}
            </div>

            {/* Paragraph 3 — January 2026 pivot */}
            <p className="text-base leading-relaxed mb-0" style={{ color: '#5E6560' }}>
              {PARAGRAPHS_AFTER_QUOTE[0]}
            </p>

            {/* Pull quote — follows the January 2026 paragraph */}
            <blockquote
              className="my-8 pl-5 py-1"
              style={{ borderLeft: '3px solid #A87D2E' }}
            >
              <p
                className="font-display font-semibold italic leading-snug"
                style={{ fontSize: 'clamp(17px, 2vw, 22px)', color: '#1B3D2C', letterSpacing: '-0.2px' }}
              >
                "But deep down, I felt a conviction that this was where God was calling me in this chapter of my life."
              </p>
            </blockquote>

            {/* Paragraphs 4–6 */}
            <div className="flex flex-col gap-5">
              {PARAGRAPHS_AFTER_QUOTE.slice(1).map((p, i) => (
                <p key={i} className="text-base leading-relaxed" style={{ color: '#5E6560' }}>
                  {p}
                </p>
              ))}
            </div>

            {/* Closing signature */}
            <div
              className="mt-10 pt-7 flex items-center gap-4 border-t"
              style={{ borderColor: 'rgba(27,61,44,0.10)' }}
            >
              <div>
                <p className="font-display italic text-lg" style={{ color: '#1B3D2C' }}>
                  — Nik Schmidt
                </p>
                <p className="text-xs mt-0.5" style={{ color: '#9B9B9B' }}>
                  Tampa, Florida · Founded 2024
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
