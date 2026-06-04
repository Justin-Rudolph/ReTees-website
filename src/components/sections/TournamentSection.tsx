import { MapPin, Calendar, Users, Trophy, ChevronRight, Phone, Mail } from 'lucide-react';
import { useInView } from '@/hooks/useInView';

interface TournamentSectionProps {
  onOpenDetails:  () => void;
  onOpenRegister: () => void;
}

export default function TournamentSection({ onOpenDetails, onOpenRegister }: TournamentSectionProps) {
  const { ref, inView } = useInView();

  return (
    <section
      id="tournament"
      className="relative overflow-hidden"
      style={{ scrollMarginTop: '80px' }}
      aria-labelledby="tournament-heading"
    >
      <div
        style={{
          backgroundImage: "url('/images/hertiage_isles.png')",
          backgroundSize: 'cover',
          backgroundPosition: 'center 55%',
        }}
      >
        <div style={{ backgroundColor: 'rgba(6, 20, 12, 0.87)' }}>
          <div className="max-w-7xl mx-auto px-5 sm:px-8 py-12 sm:py-16">

            <div
              ref={ref as React.RefObject<HTMLDivElement>}
              className={`reveal ${inView ? 'in-view' : ''} grid lg:grid-cols-[1fr_300px] xl:grid-cols-[1fr_340px] gap-8 lg:gap-14 items-center`}
            >

              {/* ── Left column: all info ── */}
              <div>
                {/* Badge */}
                <div
                  className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 mb-4 text-xs font-semibold tracking-widest uppercase"
                  style={{ backgroundColor: 'rgba(168,125,46,0.22)', color: '#DDB870', border: '1px solid rgba(168,125,46,0.35)' }}
                >
                  2nd Annual · Golf Tournament
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

                {/* Info chips */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {[
                    { icon: Calendar, text: 'Sat, Sept 26, 2026'        },
                    { icon: MapPin,   text: 'Heritage Isles Golf and Country Club' },
                    { icon: Users,    text: '$150 per player · $600 per team of 4' },
                  ].map(chip => (
                    <div
                      key={chip.text}
                      className="inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-xs font-medium"
                      style={{ backgroundColor: 'rgba(255,255,255,0.09)', color: 'rgba(255,255,255,0.82)', border: '1px solid rgba(255,255,255,0.13)' }}
                    >
                      <chip.icon size={11} />
                      {chip.text}
                    </div>
                  ))}
                </div>

                {/* CTAs */}
                <div className="flex flex-wrap gap-3 mb-7">
                  <button
                    onClick={onOpenRegister}
                    className="btn-sweep inline-flex items-center gap-2 text-sm font-semibold rounded-full px-6 py-3 transition-all hover:opacity-90 active:scale-95"
                    style={{ backgroundColor: '#A87D2E', color: '#FFFFFF' }}
                  >
                    Register Your Team
                    <ChevronRight size={14} />
                  </button>
                  <button
                    onClick={onOpenDetails}
                    className="btn-sweep inline-flex items-center text-sm font-semibold text-white rounded-full px-6 py-3 border transition-all hover:bg-white/10"
                    style={{ borderColor: 'rgba(255,255,255,0.28)' }}
                  >
                    Event Details
                  </button>
                </div>

                {/* Prizes + Contact — compact two cards */}
                <div className="grid grid-cols-2 gap-3">

                  {/* Prizes */}
                  <div
                    className="rounded-xl p-4"
                    style={{ backgroundColor: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.10)' }}
                  >
                    <div className="flex items-center gap-1.5 mb-3">
                      <Trophy size={11} style={{ color: '#DDB870' }} />
                      <span className="text-xs font-bold tracking-widest uppercase" style={{ color: '#DDB870' }}>
                        Prizes
                      </span>
                    </div>
                    <div className="flex flex-col gap-2">
                      {[
                        { label: '1st Place',         value: '$1,000 Cash'  },
                        { label: 'Engraved Trophy',   value: 'Names + Score' },
                        { label: 'Individual Awards',     value: 'Each winner'  },
                        { label: 'And More',          value: 'Day-of surprises' },
                      ].map((row, i) => (
                        <div
                          key={row.label}
                          className={`flex items-start justify-between gap-3 text-xs ${i > 0 ? 'pt-2 border-t' : ''}`}
                          style={{ borderColor: 'rgba(255,255,255,0.07)' }}
                        >
                          <span className="text-white flex-1">{row.label}</span>
                          <span className="font-semibold text-right flex-1" style={{ color: i === 0 ? '#DDB870' : 'rgba(255,255,255,0.45)' }}>
                            {row.value}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Contact */}
                  <div
                    className="rounded-xl p-4"
                    style={{ backgroundColor: 'rgba(168,125,46,0.10)', border: '1px solid rgba(168,125,46,0.22)' }}
                  >
                    <p className="text-xs font-bold tracking-widest uppercase mb-3" style={{ color: '#DDB870' }}>
                      Questions?
                    </p>
                    <div className="flex flex-col gap-2.5">
                      <a
                        href="mailto:nik@retees.com"
                        className="flex items-center gap-2 text-xs text-white transition-opacity hover:opacity-70"
                      >
                        <div
                          className="w-6 h-6 rounded-md flex items-center justify-center flex-shrink-0"
                          style={{ backgroundColor: 'rgba(255,255,255,0.10)' }}
                        >
                          <Mail size={11} style={{ color: '#DDB870' }} />
                        </div>
                        nik@retees.com
                      </a>
                      <a
                        href="tel:+18137318444"
                        className="flex items-center gap-2 text-xs text-white transition-opacity hover:opacity-70"
                      >
                        <div
                          className="w-6 h-6 rounded-md flex items-center justify-center flex-shrink-0"
                          style={{ backgroundColor: 'rgba(255,255,255,0.10)' }}
                        >
                          <Phone size={11} style={{ color: '#DDB870' }} />
                        </div>
                        813-731-8444
                      </a>
                    </div>
                  </div>

                </div>
              </div>

              {/* ── Right column: photo (desktop only) ── */}
              <div className="hidden lg:block">
                <div
                  className="rounded-2xl overflow-hidden shadow-2xl"
                  style={{ border: '1px solid rgba(255,255,255,0.12)' }}
                >
                  <img
                    src="/images/tournament.webp"
                    alt="ReTees Invitational champions celebrating with the championship trophy and award plaques"
                    className="w-full object-cover block"
                    style={{ height: '400px', objectPosition: 'center top' }}
                  />
                  <div
                    className="px-4 py-2.5 flex items-center justify-between"
                    style={{ backgroundColor: 'rgba(0,0,0,0.55)' }}
                  >
                    <p className="text-xs font-semibold text-white">Invitational Champions</p>
                    <p className="text-xs" style={{ color: 'rgba(255,255,255,0.45)' }}>Tampa, FL</p>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
