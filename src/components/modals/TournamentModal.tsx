import { useEffect } from 'react';
import { X, Trophy } from 'lucide-react';

const SCHEDULE = [
  { time: '7:00 AM', event: 'Registration & Breakfast',  desc: 'Grab-and-go breakfast at the clubhouse'              },
  { time: '7:45 AM', event: 'Opening Announcements',     desc: 'Rules, format overview, and team introductions'      },
  { time: '8:00 AM', event: 'Shotgun Start',             desc: '18-hole 4-man scramble begins — all skill levels'    },
  { time: '1:00 PM', event: 'Lunch & Awards Ceremony',  desc: 'Catered steak lunch, prize ceremony, announcements'  },
  { time: '3:00 PM', event: 'Event Concludes',           desc: 'See you next year!'                                  },
];

const INCLUDED = [
  '18 holes of golf',
  'Grab-and-go breakfast',
  'Catered steak lunch',
  'Complimentary beverages on course',
  'ReTees hat of your choosing',
  'Awards ceremony participation',
];

const MINI_GAMES = [
  { name: 'Closest to Pin',      location: 'Hole 15',  entry: '$10 / entry'   },
  { name: 'Longest Drive',       location: 'Hole 11',  entry: '$10 / entry'   },
  { name: 'Long Putt Challenge', location: 'Any hole', entry: '$5 / attempt'  },
];

interface TournamentModalProps {
  open:       boolean;
  onClose:    () => void;
  onRegister: () => void;
}

export default function TournamentModal({ open, onClose, onRegister }: TournamentModalProps) {
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="tournament-modal-title"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 cursor-pointer"
        style={{ backgroundColor: 'rgba(6,18,10,0.70)', backdropFilter: 'blur(6px)' }}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Panel */}
      <div
        className="relative w-full max-w-2xl max-h-[92vh] flex flex-col rounded-2xl shadow-2xl overflow-hidden"
        style={{ backgroundColor: '#FAFAF6' }}
        onClick={e => e.stopPropagation()}
      >

        {/* ── Header ── */}
        <div
          className="flex-shrink-0 px-7 py-6"
          style={{ backgroundColor: '#1B3D2C' }}
        >
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-semibold tracking-widest uppercase mb-1.5"
                style={{ color: 'rgba(221,184,112,0.80)' }}>
                2nd Annual · 4-Man Scramble
              </p>
              <h2
                id="tournament-modal-title"
                className="font-display font-bold text-white leading-tight"
                style={{ fontSize: 'clamp(22px, 3vw, 30px)', letterSpacing: '-0.5px' }}
              >
                The ReTees{' '}
                <em style={{ color: '#DDB870' }}>Invitational</em>
              </h2>
              <p className="text-sm mt-1" style={{ color: 'rgba(255,255,255,0.55)' }}>
                September 26, 2026 · Heritage Isles Golf and Country Club
              </p>
            </div>
            <button
              onClick={onClose}
              className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-colors"
              style={{ backgroundColor: 'rgba(255,255,255,0.12)', color: 'rgba(255,255,255,0.70)' }}
              aria-label="Close"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* ── Scrollable body ── */}
        <div className="flex-1 overflow-y-auto px-7 py-7 flex flex-col gap-8">

          {/* Event Schedule */}
          <div>
            <h3
              className="text-xs font-bold tracking-widest uppercase mb-5 pb-2 border-b"
              style={{ color: '#1B3D2C', borderColor: 'rgba(27,61,44,0.12)' }}
            >
              Event Schedule
            </h3>
            <div className="relative pl-5 flex flex-col">
              <div
                className="absolute left-0 top-2 bottom-2 w-px"
                style={{ background: 'linear-gradient(to bottom, #1B3D2C, rgba(27,61,44,0.15))' }}
              />
              {SCHEDULE.map((item, i) => (
                <div key={item.time} className="relative pb-5 last:pb-0">
                  <div
                    className="absolute -left-5 top-[5px] w-2.5 h-2.5 rounded-full border-2 translate-x-[-4px]"
                    style={{
                      borderColor: '#1B3D2C',
                      backgroundColor: i === 2 ? '#1B3D2C' : '#FAFAF6',
                    }}
                  />
                  <div className="flex items-baseline gap-4">
                    <span
                      className="text-xs font-bold flex-shrink-0"
                      style={{ color: '#A87D2E', minWidth: '4.5rem' }}
                    >
                      {item.time}
                    </span>
                    <div>
                      <p className="text-sm font-semibold" style={{ color: '#1A1A1A' }}>{item.event}</p>
                      <p className="text-xs mt-0.5" style={{ color: '#6B6B6B' }}>{item.desc}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* What's Included */}
          <div>
            <h3
              className="text-xs font-bold tracking-widest uppercase mb-4 pb-2 border-b"
              style={{ color: '#1B3D2C', borderColor: 'rgba(27,61,44,0.12)' }}
            >
              What's Included
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {INCLUDED.map(item => (
                <div
                  key={item}
                  className="flex items-start gap-2.5 rounded-lg px-3.5 py-2.5"
                  style={{ backgroundColor: '#F0EBE1', border: '1px solid rgba(27,61,44,0.08)' }}
                >
                  <span
                    className="w-1.5 h-1.5 rounded-full flex-shrink-0 mt-1.5"
                    style={{ backgroundColor: '#1B3D2C' }}
                  />
                  <span className="text-sm" style={{ color: '#2C2C2C' }}>{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Mini Games */}
          <div>
            <h3
              className="text-xs font-bold tracking-widest uppercase mb-4 pb-2 border-b"
              style={{ color: '#1B3D2C', borderColor: 'rgba(27,61,44,0.12)' }}
            >
              On-Course Mini Games
            </h3>
            <div className="flex flex-col gap-2">
              {MINI_GAMES.map(game => (
                <div
                  key={game.name}
                  className="flex items-center justify-between rounded-lg px-4 py-3.5"
                  style={{ backgroundColor: '#F0EBE1', border: '1px solid rgba(27,61,44,0.08)' }}
                >
                  <div>
                    <p className="text-sm font-semibold" style={{ color: '#1A1A1A' }}>{game.name}</p>
                    <p className="text-xs mt-0.5" style={{ color: '#6B6B6B' }}>{game.location}</p>
                  </div>
                  <span
                    className="text-xs font-bold px-3 py-1.5 rounded-full flex-shrink-0"
                    style={{ backgroundColor: 'rgba(168,125,46,0.14)', color: '#8B6010' }}
                  >
                    {game.entry}
                  </span>
                </div>
              ))}
            </div>
            <p className="text-xs mt-3 italic" style={{ color: '#9B9B9B' }}>
              Optional add-ons — cash prizes for winners
            </p>
          </div>

          {/* Format note */}
          <div
            className="rounded-xl px-5 py-4 flex items-start gap-3"
            style={{ backgroundColor: '#EDF4F0', border: '1px solid rgba(27,61,44,0.12)' }}
          >
            <Trophy size={16} style={{ color: '#1B3D2C', flexShrink: 0, marginTop: '2px' }} />
            <div>
              <p className="text-sm font-semibold" style={{ color: '#1B3D2C' }}>
                4-Man Scramble · Open to all skill levels
              </p>
              <p className="text-xs mt-1" style={{ color: '#5E6560' }}>
                All teams take their best shot each hole. A great format for competitive and casual players alike.
              </p>
            </div>
          </div>
        </div>

        {/* ── Footer CTA ── */}
        <div
          className="flex-shrink-0 px-7 py-5 flex flex-col sm:flex-row items-center gap-3 border-t"
          style={{ borderColor: 'rgba(27,61,44,0.10)', backgroundColor: '#FAFAF6' }}
        >
          <button
            onClick={() => { onClose(); onRegister(); }}
            className="btn-sweep w-full sm:w-auto text-center text-sm font-semibold text-white rounded-full px-7 py-3 transition-all hover:opacity-90 cursor-pointer"
            style={{ backgroundColor: '#1B3D2C' }}
          >
            Register Your Team
          </button>
          <a
            href="mailto:nik@retees.com"
            className="w-full sm:w-auto text-center text-sm font-medium rounded-full px-7 py-3 border transition-all hover:border-rt-green"
            style={{ color: '#1B3D2C', borderColor: 'rgba(27,61,44,0.22)' }}
          >
            Questions? Email Nik
          </a>
        </div>
      </div>
    </div>
  );
}
