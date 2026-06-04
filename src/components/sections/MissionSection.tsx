import { Leaf, Palette, Users, Trophy } from 'lucide-react';
import { useInView } from '@/hooks/useInView';

const PILLARS = [
  {
    icon:  Leaf,
    title: 'Sustainable Materials',
    body:  'Every piece begins with genuine recycled golf tees diverted from landfills — art with a conscience.',
  },
  {
    icon:  Palette,
    title: 'Custom Artwork',
    body:  'No two pieces are alike. Each creation is commissioned and crafted to your vision and space.',
  },
  {
    icon:  Users,
    title: 'Golf Community',
    body:  'Rooted in the golf lifestyle, we connect artists, players, and enthusiasts through shared craft.',
  },
  {
    icon:  Trophy,
    title: 'Tournament Impact',
    body:  'The ReTees Invitational raises awareness for sustainability while celebrating the game we love.',
  },
];

export default function MissionSection() {
  const { ref: leftRef,  inView: leftIn  } = useInView();
  const { ref: rightRef, inView: rightIn } = useInView();

  return (
    <section
      className="py-20 sm:py-28"
      style={{ backgroundColor: '#FFFFFF' }}
      aria-labelledby="mission-heading"
    >
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-start">

          {/* Left: text */}
          <div
            ref={leftRef as React.RefObject<HTMLDivElement>}
            className={`reveal ${leftIn ? 'in-view' : ''}`}
          >
            <p className="section-label mb-4">Crafted with Purpose</p>
            <h2
              id="mission-heading"
              className="font-display font-semibold tracking-tight leading-tight mb-6"
              style={{ fontSize: 'clamp(32px, 4.5vw, 52px)', color: '#1A1A1A', letterSpacing: '-1px' }}
            >
              Turning the course
              <br />
              into <em style={{ color: '#1B3D2C' }}>canvas</em>
            </h2>
            <p className="text-base leading-relaxed mb-5" style={{ color: '#5E6560' }}>
              ReTees was born from a simple idea: the thousands of golf tees left behind on
              courses deserve a second life. We collect, curate, and transform them into
              handcrafted artworks that carry the spirit of the game.
            </p>
            <p className="text-base leading-relaxed mb-8" style={{ color: '#5E6560' }}>
              Whether you're commissioning a piece for your home, a corporate gift for a
              golf-lover, or a statement installation for your clubhouse — every ReTees
              artwork tells a story of sustainability, craftsmanship, and community.
            </p>
            <div
              className="inline-flex items-center gap-3 rounded-xl px-5 py-4"
              style={{ backgroundColor: '#EDF4F0' }}
            >
              <Leaf size={18} style={{ color: '#1B3D2C', flexShrink: 0 }} />
              <p className="text-sm font-medium" style={{ color: '#1B3D2C' }}>
                100% of materials sourced from recycled golf tees
              </p>
            </div>
          </div>

          {/* Right: 4 pillar cards */}
          <div
            ref={rightRef as React.RefObject<HTMLDivElement>}
            className={`reveal reveal-delay-2 ${rightIn ? 'in-view' : ''} grid grid-cols-1 sm:grid-cols-2 gap-4`}
          >
            {PILLARS.map((pillar, i) => (
              <div
                key={pillar.title}
                className={`rounded-xl p-5 border transition-all hover:-translate-y-1 ${
                  i === 0 ? 'sm:col-span-1' : ''
                }`}
                style={{
                  borderColor: 'rgba(27,61,44,0.10)',
                  backgroundColor: i % 2 === 0 ? '#FAFAF6' : '#FFFFFF',
                }}
              >
                <div
                  className="w-9 h-9 rounded-lg flex items-center justify-center mb-3"
                  style={{ backgroundColor: '#EDF4F0' }}
                >
                  <pillar.icon size={17} style={{ color: '#1B3D2C' }} />
                </div>
                <h3
                  className="font-display text-lg font-semibold mb-1.5"
                  style={{ color: '#1A1A1A' }}
                >
                  {pillar.title}
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: '#5E6560' }}>
                  {pillar.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
