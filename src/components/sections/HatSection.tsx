import { ExternalLink, ChevronRight } from 'lucide-react';
import { useInView } from '@/hooks/useInView';

const HAT_PURCHASE_URL = 'https://connect.intuit.com/pay/ReteesLlc/scs-v1-a2aa116aa0c84b94991b4fc0b465b0f024493dede0f04ba48f34919e3bf17f0c8780a44e0dff427fab4e337724d71121?locale=EN_US&cta=copylistmultilink';

export default function HatSection() {
  const { ref, inView } = useInView();

  return (
    <section
      id="shop"
      className="py-20 sm:py-28"
      style={{ backgroundColor: '#F5F0E8' }}
      aria-labelledby="shop-heading"
    >
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        <div
          ref={ref as React.RefObject<HTMLDivElement>}
          className={`reveal ${inView ? 'in-view' : ''} grid lg:grid-cols-2 gap-12 lg:gap-20 items-center`}
        >

          {/* Product image */}
          <div className="flex justify-center lg:justify-end">
            <div className="relative" style={{ maxWidth: '420px', width: '100%' }}>
              <img
                src="/images/hat.webp"
                alt="The ReTees signature black hat — embroidered ReTees Florida logo on the front, FLORIDA on the side"
                className="w-full rounded-2xl shadow-xl block"
                style={{ backgroundColor: '#F0EDE8' }}
              />

              {/* Price badge */}
              <div
                className="absolute top-4 right-4 rounded-xl px-4 py-2 shadow-lg"
                style={{ backgroundColor: '#1B3D2C' }}
              >
                <p className="font-display text-xl font-bold text-white">$30</p>
              </div>
            </div>
          </div>

          {/* Product info */}
          <div>
            <p className="section-label mb-4">The Shop</p>
            <h2
              id="shop-heading"
              className="font-display font-bold tracking-tight mb-4"
              style={{ fontSize: 'clamp(28px, 4vw, 48px)', color: '#1A1A1A', letterSpacing: '-1px' }}
            >
              The ReTees Hat
            </h2>
            <p className="text-base leading-relaxed mb-3" style={{ color: '#5E6560' }}>
              Represent the mission. The ReTees signature hat features our embroidered
              Florida logo — built for the course or the street, and made to last.
            </p>
            <p className="text-base leading-relaxed mb-8" style={{ color: '#5E6560' }}>
              Every hat purchased supports our sustainability efforts. Part of the
              ReTees community, on and off the course.
            </p>

            {/* Recycled stat */}
            <div
              className="inline-flex items-center gap-3 rounded-xl px-4 py-3 mb-8"
              style={{ backgroundColor: '#EDF4F0', border: '1px solid rgba(27,61,44,0.12)' }}
            >
              <span className="font-display text-2xl font-bold" style={{ color: '#1B3D2C' }}>2.5</span>
              <span className="text-sm" style={{ color: '#5E6560' }}>
                recycled water bottles in every hat
              </span>
            </div>

            {/* Feature pills */}
            <div className="flex flex-wrap gap-2 mb-8">
              {['Embroidered Logo', 'Adjustable Fit', 'Premium Build', 'Florida Edition'].map(feature => (
                <span
                  key={feature}
                  className="text-xs font-medium px-3 py-1.5 rounded-full border"
                  style={{ color: '#1B3D2C', borderColor: 'rgba(27,61,44,0.20)', backgroundColor: '#FFFFFF' }}
                >
                  {feature}
                </span>
              ))}
            </div>

            {/* CTA */}
            <div className="flex items-center gap-4">
              <a
                href={HAT_PURCHASE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-sweep inline-flex items-center gap-2 text-sm font-semibold text-white rounded-full px-8 py-3.5 transition-all hover:opacity-90 active:scale-95"
                style={{ backgroundColor: '#1B3D2C' }}
              >
                Purchase Hat — $30
                <ExternalLink size={14} />
              </a>
            </div>
          </div>

        </div>

        {/* GoFundMe callout */}
        <div className="mt-14 flex justify-center">
          <div
            className="w-full max-w-lg rounded-2xl px-6 py-6 flex flex-col items-center gap-3"
            style={{ backgroundColor: '#EDF4F0', border: '1px solid rgba(27,61,44,0.12)' }}
          >
            <p className="text-sm font-bold tracking-wide uppercase" style={{ color: '#1B3D2C' }}>
              Want to support but don't golf?
            </p>
            <p className="text-sm text-center leading-relaxed max-w-sm" style={{ color: '#5E6560' }}>
              You don't have to play golf to make a difference. Every dollar donated helps us remove more litter from the environment and fund future ReTees productions.
            </p>
            <a
              href="https://gofund.me/9d1479f41"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-sweep inline-flex items-center gap-2 text-sm font-semibold text-white rounded-full px-7 py-3 mt-1 transition-all hover:opacity-90"
              style={{ backgroundColor: '#1B3D2C' }}
            >
              Donate on GoFundMe
              <ChevronRight size={14} />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
