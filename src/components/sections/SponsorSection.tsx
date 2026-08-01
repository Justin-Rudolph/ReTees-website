import { Trophy, Star, Flag, Droplets } from 'lucide-react';
import { useInView } from '@/hooks/useInView';

// `hidden: true` keeps a tier defined but out of the rendered grid.
// Flip it back to false (or remove the line) to bring the tier back.
const TIERS = [
  {
    icon:      Trophy,
    name:      'Title Sponsor',
    hidden:    true,
    price:     '$3,500',
    exclusive: true,
    formId:    '7af9a35d-7e95-481f-add1-cc194860cb08',
    perks: [
      'Tournament naming rights',
      'Largest logo on all marketing',
      'Banner at registration/check-in',
      'Speaking opportunity before awards',
      'Included foursome/team',
      'Social media promotion',
      'Website homepage logo placement',
      'Activation tent/table',
      'Mention in all email marketing',
    ],
    highlight: true,
  },
  {
    icon:      Star,
    name:      'Gold Sponsor',
    hidden:    true,
    price:     '$1,000',
    exclusive: false,
    formId:    '0661fd78-16fa-4ea6-94eb-d345ba586f21',
    perks: [
      'Hole activation/table',
      'Social media mentions',
      'Website sponsor section',
      'Option to include giveaways',
      'Included foursome',
    ],
    highlight: false,
  },
  {
    icon:      Droplets,
    name:      'Drink Sponsor',
    hidden:    true,
    price:     '$1,000',
    exclusive: true,
    formId:    'd54f27d7-12ca-49f5-a9ea-1c70c5971d0e',
    perks: [
      'Placement near check-in + closest-to-pin',
      'Drink redemption station',
      'Distribute samples/materials',
      'Marketing recognition',
      'Included foursome',
    ],
    highlight: false,
  },
  {
    icon:      Flag,
    name:      'Hole Sponsor',
    hidden:    false,
    price:     '$250',
    exclusive: false,
    formId:    '2cb1b9db-6d76-4353-a653-3052f4bb975d',
    perks: [
      'Tee box signage',
      'Website sponsor recognition',
      'Mention during announcements',
    ],
    highlight: true,
  },
];

type Tier = (typeof TIERS)[number];

/**
 * Existing partners, framed like the tee-box signage a sponsorship buys:
 * cream panel, gold hairline echoing the rules inside the artwork.
 */
function SponsorBoard({ className = '' }: { className?: string }) {
  return (
    <div
      className={`rounded-2xl p-3 sm:p-4 ${className}`}
      style={{
        backgroundColor: '#F5F0E8',
        border:          '1px solid rgba(27,61,44,0.10)',
        boxShadow:       '0 16px 48px rgba(27,61,44,0.10)',
      }}
    >
      <img
        src="/images/all_sponsors.jpeg"
        alt="Thank you to our sponsors — Pelican XC, MetTel, Streamsong, Swans Multimedia, Elevated Boat Services, SUROS Logic Systems, Michini Wealth Management, and Window Magic"
        width={1085}
        height={964}
        loading="lazy"
        decoding="async"
        className="w-full h-auto block rounded-xl"
        style={{ boxShadow: 'inset 0 0 0 1px rgba(168,125,46,0.28)' }}
      />
    </div>
  );
}

function TierCard({ tier, onOpenSponsor }: { tier: Tier; onOpenSponsor: (formId: string) => void }) {
  return (
    <div
      className="rounded-2xl p-5 border flex flex-col transition-all hover:-translate-y-1"
      style={{
        backgroundColor: tier.highlight ? '#1B3D2C' : '#FFFFFF',
        borderColor:     tier.highlight ? '#1B3D2C' : 'rgba(27,61,44,0.10)',
        boxShadow:       tier.highlight ? '0 16px 48px rgba(27,61,44,0.25)' : undefined,
      }}
    >
      {/* Icon row */}
      <div className="flex items-center justify-between mb-4">
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center"
          style={{ backgroundColor: tier.highlight ? 'rgba(255,255,255,0.15)' : '#EDF4F0' }}
        >
          <tier.icon
            size={16}
            style={{ color: tier.highlight ? '#DDB870' : '#1B3D2C' }}
          />
        </div>
        {tier.exclusive && (
          <span
            className="text-[10px] font-semibold tracking-wider uppercase px-2.5 py-1 rounded-full"
            style={{
              backgroundColor: tier.highlight ? 'rgba(168,125,46,0.30)' : 'rgba(168,125,46,0.12)',
              color:           tier.highlight ? '#DDB870'               : '#8B6010',
            }}
          >
            Only 1 Left
          </span>
        )}
      </div>

      {/* Name + Price */}
      <h3
        className="font-display text-lg font-semibold mb-1"
        style={{ color: tier.highlight ? '#FFFFFF' : '#1A1A1A' }}
      >
        {tier.name}
      </h3>
      <p
        className="font-display text-2xl font-bold mb-4"
        style={{ color: tier.highlight ? '#DDB870' : '#1B3D2C' }}
      >
        {tier.price}
      </p>

      {/* Divider */}
      <div
        className="w-full h-px mb-4"
        style={{ backgroundColor: tier.highlight ? 'rgba(255,255,255,0.12)' : 'rgba(27,61,44,0.08)' }}
      />

      {/* Perks */}
      <ul className="flex flex-col gap-2 mb-6 flex-1">
        {tier.perks.map(perk => (
          <li key={perk} className="flex items-start gap-2 text-sm">
            <span
              className="w-1.5 h-1.5 rounded-full flex-shrink-0 mt-[5px]"
              style={{ backgroundColor: tier.highlight ? '#DDB870' : '#1B3D2C' }}
            />
            <span style={{ color: tier.highlight ? 'rgba(255,255,255,0.75)' : '#5E6560' }}>
              {perk}
            </span>
          </li>
        ))}
      </ul>

      <button
        onClick={() => onOpenSponsor(tier.formId)}
        className={`${tier.highlight ? 'btn-sweep' : 'btn-sweep-dark'} w-full rounded-full py-2.5 text-sm font-medium border transition-all hover:opacity-90`}
        style={tier.highlight ? {
          backgroundColor: '#A87D2E',
          borderColor:     '#A87D2E',
          color:           '#FFFFFF',
        } : {
          backgroundColor: 'transparent',
          borderColor:     'rgba(27,61,44,0.22)',
          color:           '#1B3D2C',
        }}
      >
        Sponsor Inquiry
      </button>
    </div>
  );
}

interface SponsorSectionProps {
  onOpenSponsor: (formId: string) => void;
}

export default function SponsorSection({ onOpenSponsor }: SponsorSectionProps) {
  const { ref: headRef,  inView: headIn  } = useInView();
  const { ref: cardsRef, inView: cardsIn } = useInView();

  const visibleTiers = TIERS.filter(tier => !tier.hidden);

  // With one tier open, the sponsor board shares the row with it —
  // who's already backing the event, and the one way left to join.
  const pairedWithBoard = visibleTiers.length === 1;

  return (
    <section
      id="sponsors"
      className="py-20 sm:py-28"
      style={{ backgroundColor: '#FAFAF6' }}
      aria-labelledby="sponsor-heading"
    >
      <div className="max-w-7xl mx-auto px-5 sm:px-8">

        {/* Header */}
        <div
          ref={headRef as React.RefObject<HTMLDivElement>}
          className={`reveal ${headIn ? 'in-view' : ''} text-center mb-14`}
        >
          <p className="section-label mb-4">Partnership</p>
          <h2
            id="sponsor-heading"
            className="font-display font-semibold tracking-tight mb-4"
            style={{ fontSize: 'clamp(30px, 4.5vw, 50px)', color: '#1A1A1A', letterSpacing: '-1px' }}
          >
            Become a Sponsor
          </h2>
          <p className="text-base leading-relaxed max-w-xl mx-auto" style={{ color: '#5E6560' }}>
            Partner with ReTees to connect your brand with a passionate golf community,
            support sustainability, and gain meaningful visibility at the Invitational.
          </p>
        </div>

        {/* Existing partners + the open tier */}
        {pairedWithBoard ? (
          <div
            ref={cardsRef as React.RefObject<HTMLDivElement>}
            className={`reveal reveal-delay-1 ${cardsIn ? 'in-view' : ''} grid lg:grid-cols-[1.2fr_0.8fr] gap-8 lg:gap-12 items-center mb-12`}
          >
            {/* Stacked on mobile the ask comes first; side by side it sits
                to the right of the partners, so the order flips at lg */}
            <SponsorBoard className="order-2 lg:order-1" />
            <div className="order-1 lg:order-2 w-full max-w-sm mx-auto">
              <TierCard tier={visibleTiers[0]} onOpenSponsor={onOpenSponsor} />
            </div>
          </div>
        ) : (
          <>
            <div
              ref={cardsRef as React.RefObject<HTMLDivElement>}
              className={`reveal reveal-delay-1 ${cardsIn ? 'in-view' : ''} grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-12`}
            >
              {visibleTiers.map(tier => (
                <TierCard key={tier.name} tier={tier} onOpenSponsor={onOpenSponsor} />
              ))}
            </div>
            <SponsorBoard className="max-w-2xl mx-auto mb-12" />
          </>
        )}

        {/* Bottom note */}
        <div className="text-center flex flex-col items-center gap-4">
        </div>
      </div>
    </section>
  );
}
