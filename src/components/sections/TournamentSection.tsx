import { useState, useEffect, useRef } from 'react';
import { MapPin, Calendar, Users, Trophy, ChevronRight, Phone, Mail, Plus, Minus } from 'lucide-react';
import { useInView } from '@/hooks/useInView';

// Sat, Sept 26, 2026 · 7:00 AM Eastern (Tampa, FL — EDT is UTC-4 in September)
const TOURNAMENT_DATE = new Date('2026-09-26T07:00:00-04:00');

// Field size and registrations to date — bump TEAMS_REGISTERED as teams sign up
const TEAMS_REGISTERED = 12;
const TEAMS_TOTAL      = 36;

function getTimeLeft() {
  const diff = Math.max(0, TOURNAMENT_DATE.getTime() - Date.now());
  return {
    days:    Math.floor(diff / 86400000),
    hours:   Math.floor(diff / 3600000) % 24,
    minutes: Math.floor(diff / 60000) % 60,
    seconds: Math.floor(diff / 1000) % 60,
    done:    diff === 0,
  };
}

function Countdown() {
  const [time, setTime] = useState(getTimeLeft);

  useEffect(() => {
    const id = setInterval(() => {
      const next = getTimeLeft();
      setTime(next);
      // Freeze at 00:00:00:00 once tee off arrives
      if (next.done) clearInterval(id);
    }, 1000);
    return () => clearInterval(id);
  }, []);

  const units = [
    { value: time.days,    label: 'Days'    },
    { value: time.hours,   label: 'Hours'   },
    { value: time.minutes, label: 'Minutes' },
    { value: time.seconds, label: 'Seconds' },
  ];

  return (
    <div className="mb-7">
      <p
        className="text-xs font-bold tracking-widest uppercase mb-2.5"
        style={{ color: '#DDB870' }}
      >
        {time.done ? 'It’s Tournament Day!' : 'Tee Off In'}
      </p>
      <div className="grid grid-cols-4 gap-2 sm:gap-3 max-w-md">
        {units.map(unit => (
          <div
            key={unit.label}
            className="rounded-xl py-2.5 sm:py-3 text-center"
            style={{ backgroundColor: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.10)' }}
          >
            <p
              className="font-display font-bold text-white leading-none"
              style={{ fontSize: 'clamp(20px, 6vw, 30px)', fontVariantNumeric: 'tabular-nums' }}
            >
              {String(unit.value).padStart(2, '0')}
            </p>
            <p
              className="text-[10px] font-semibold tracking-widest uppercase mt-1.5"
              style={{ color: 'rgba(255,255,255,0.50)' }}
            >
              {unit.label}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

const TEAMS_ENDPOINT    = '/teams.php';
const SECRET_TAP_COUNT  = 3;   // taps on the pill that reveal the admin panel
const SECRET_TAP_WINDOW = 700; // ms — every tap must land inside this of the last

const clampTeams = (n: number) => Math.min(TEAMS_TOTAL, Math.max(0, n));

type SaveStatus = 'idle' | 'saving' | 'saved' | 'error';

/** Where teams.php keeps the count, and whether it found one at all. */
type StoreInfo = { stored: boolean; location: string | null };

const readStoreInfo = (data: { stored?: unknown; location?: unknown }): StoreInfo => ({
  stored:   data.stored === true,
  location: typeof data.location === 'string' ? data.location : null,
});

function TeamTracker() {
  const [registered, setRegistered] = useState(TEAMS_REGISTERED);
  const [editing, setEditing]       = useState(false);
  const [draft, setDraft]           = useState(TEAMS_REGISTERED);
  const [pin, setPin]               = useState('');
  const [status, setStatus]         = useState<SaveStatus>('idle');
  const [message, setMessage]       = useState('');
  const [store, setStore]           = useState<StoreInfo | null>(null);
  const taps    = useRef<number[]>([]);
  const wrapRef = useRef<HTMLDivElement>(null);

  const pct = Math.min(100, Math.round((registered / TEAMS_TOTAL) * 100));

  // Everyone sees the same number. If the endpoint is missing or unreachable
  // (local dev, host hiccup) the committed TEAMS_REGISTERED stands in.
  useEffect(() => {
    const controller = new AbortController();
    fetch(TEAMS_ENDPOINT, {
      signal:  controller.signal,
      cache:   'no-store',
      headers: { Accept: 'application/json' },
    })
      .then(res => (res.ok ? res.json() : Promise.reject(new Error('bad status'))))
      .then((data: { registered?: unknown; stored?: unknown; location?: unknown }) => {
        if (typeof data.registered === 'number') {
          setRegistered(clampTeams(data.registered));
          setDraft(clampTeams(data.registered));
          setStore(readStoreInfo(data));
        }
      })
      .catch(() => { /* keep the committed fallback */ });
    return () => controller.abort();
  }, []);

  // Tap the pill SECRET_TAP_COUNT times to open the panel, again to close it
  const handleTap = () => {
    const now = Date.now();
    taps.current = [...taps.current.filter(t => now - t < SECRET_TAP_WINDOW), now];
    if (taps.current.length >= SECRET_TAP_COUNT) {
      taps.current = [];
      setEditing(open => {
        if (!open) { setDraft(registered); setStatus('idle'); setMessage(''); }
        return !open;
      });
    }
  };

  useEffect(() => {
    if (!editing) return;
    const onPointerDown = (e: MouseEvent | TouchEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setEditing(false);
    };
    document.addEventListener('mousedown', onPointerDown);
    document.addEventListener('touchstart', onPointerDown);
    return () => {
      document.removeEventListener('mousedown', onPointerDown);
      document.removeEventListener('touchstart', onPointerDown);
    };
  }, [editing]);

  const save = async () => {
    setStatus('saving');
    setMessage('');
    try {
      const res  = await fetch(TEAMS_ENDPOINT, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ pin, registered: draft }),
      });
      const data = await res.json().catch(() => ({} as {
        ok?: unknown; registered?: unknown; error?: string; stored?: unknown; location?: unknown;
      }));

      if (!res.ok) {
        setStatus('error');
        setMessage(res.status === 401 ? 'Wrong PIN' : (data.error ?? 'Could not save'));
        return;
      }

      // A missing teams.php falls through .htaccess to index.html, which is a
      // 200 of HTML — so only a real JSON acknowledgement counts as saved.
      if (data.ok !== true || typeof data.registered !== 'number') {
        setStatus('error');
        setMessage('teams.php not responding — check it is uploaded');
        return;
      }

      setRegistered(clampTeams(data.registered));
      setStore(readStoreInfo(data));
      setStatus('saved');
      setMessage('Updated for everyone');
    } catch {
      setStatus('error');
      setMessage('Could not reach the server');
    }
  };

  const stepButton = (label: string, delta: number, Icon: typeof Plus) => (
    <button
      type="button"
      onClick={() => { setDraft(d => clampTeams(d + delta)); setStatus('idle'); setMessage(''); }}
      aria-label={label}
      className="w-8 h-8 rounded-full flex items-center justify-center transition-all hover:opacity-80 active:scale-90"
      style={{ backgroundColor: 'rgba(221,184,112,0.20)', border: '1px solid rgba(221,184,112,0.40)' }}
    >
      <Icon size={14} style={{ color: '#DDB870' }} />
    </button>
  );

  return (
    <div ref={wrapRef} className="relative">
      <div
        onClick={handleTap}
        className="inline-flex items-center gap-3 rounded-full px-5 py-3 border select-none"
        style={{ borderColor: 'rgba(255,255,255,0.16)', backgroundColor: 'rgba(255,255,255,0.06)' }}
      >
        <Users size={13} style={{ color: '#DDB870', flexShrink: 0 }} />
        <span
          className="text-sm font-semibold text-white whitespace-nowrap"
          style={{ fontVariantNumeric: 'tabular-nums' }}
        >
          {registered}
          <span style={{ color: 'rgba(255,255,255,0.45)' }}> / {TEAMS_TOTAL} teams</span>
        </span>
        <div
          className="w-14 h-1.5 rounded-full overflow-hidden flex-shrink-0"
          style={{ backgroundColor: 'rgba(255,255,255,0.15)' }}
          role="progressbar"
          aria-valuenow={registered}
          aria-valuemin={0}
          aria-valuemax={TEAMS_TOTAL}
          aria-label={`${registered} of ${TEAMS_TOTAL} teams registered`}
        >
          <div
            className="h-full rounded-full transition-all duration-300"
            style={{ width: `${pct}%`, backgroundColor: '#DDB870' }}
          />
        </div>
      </div>

      {/* Hidden admin panel — triple-tap the pill to reach it */}
      {editing && (
        <div
          className="absolute left-0 top-full mt-2 z-30 w-64 rounded-2xl p-4 shadow-2xl"
          style={{ backgroundColor: '#12281C', border: '1px solid rgba(255,255,255,0.14)' }}
        >
          <p className="text-[10px] font-bold tracking-widest uppercase mb-3" style={{ color: '#DDB870' }}>
            Registered teams
          </p>

          <div className="flex items-center justify-between mb-3">
            {stepButton('Remove a team', -1, Minus)}
            <span
              className="font-display font-bold text-white leading-none"
              style={{ fontSize: '1.75rem', fontVariantNumeric: 'tabular-nums' }}
            >
              {draft}
              <span className="text-sm font-medium" style={{ color: 'rgba(255,255,255,0.40)' }}>
                {' '}/ {TEAMS_TOTAL}
              </span>
            </span>
            {stepButton('Add a team', 1, Plus)}
          </div>

          {/* A wiped or never-written store would otherwise just look like
              a healthy count of TEAMS_REGISTERED. Say so where you'll see it. */}
          {store && !store.stored && (
            <p className="text-[11px] leading-snug mb-2" style={{ color: '#E8998F' }}>
              Nothing saved on the server — showing the built-in {TEAMS_REGISTERED}. Save to set the real count.
            </p>
          )}
          {store?.location === 'webroot' && (
            <p className="text-[11px] leading-snug mb-2" style={{ color: '#E8998F' }}>
              Stored inside public_html — a redeploy that clears it will erase the count.
            </p>
          )}

          <input
            type="password"
            value={pin}
            onChange={e => { setPin(e.target.value); setStatus('idle'); setMessage(''); }}
            placeholder="PIN"
            autoComplete="off"
            aria-label="Admin PIN"
            className="w-full rounded-lg px-3 py-2 text-sm text-white mb-2 outline-none"
            style={{
              backgroundColor: 'rgba(255,255,255,0.08)',
              border: `1px solid ${status === 'error' ? 'rgba(220,120,110,0.55)' : 'rgba(255,255,255,0.14)'}`,
            }}
          />

          <button
            type="button"
            onClick={save}
            disabled={status === 'saving' || draft === registered}
            className="w-full rounded-lg py-2 text-sm font-semibold transition-all hover:opacity-90 active:scale-95 disabled:opacity-40"
            style={{ backgroundColor: '#A87D2E', color: '#FFFFFF' }}
          >
            {status === 'saving' ? 'Saving…' : 'Save for everyone'}
          </button>

          {message && (
            <p
              className="text-[11px] mt-2 text-center"
              style={{ color: status === 'error' ? '#E8998F' : '#DDB870' }}
            >
              {message}
            </p>
          )}
        </div>
      )}
    </div>
  );
}

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

                {/* Presenting sponsors — white knockout logos sit straight on
                    the dark backdrop, no plaque needed */}
                <div className="flex flex-col items-start gap-y-3 sm:flex-row sm:items-center sm:gap-x-5 mb-6">
                  <span
                    className="text-[10px] font-semibold tracking-[0.18em] uppercase"
                    style={{ color: 'rgba(255,255,255,0.45)' }}
                  >
                    Proudly sponsored by
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

                {/* Countdown to tee off */}
                <Countdown />

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
                  <TeamTracker />
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
                        { label: '1st Place',         value: '$1,000 Cash + Free Streamsong foursome' },
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
