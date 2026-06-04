import { useEffect } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

interface Artwork {
  src:   string;
  alt:   string;
  title: string;
}

interface ArtworkLightboxProps {
  artworks:      Artwork[];
  selectedIndex: number | null;
  onClose:       () => void;
  onPrev:        () => void;
  onNext:        () => void;
}

export default function ArtworkLightbox({
  artworks,
  selectedIndex,
  onClose,
  onPrev,
  onNext,
}: ArtworkLightboxProps) {
  const isOpen  = selectedIndex !== null;
  const artwork = selectedIndex !== null ? artworks[selectedIndex] : null;
  const total   = artworks.length;

  /* Lock body scroll + keyboard nav */
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape')      onClose();
      if (e.key === 'ArrowLeft')   onPrev();
      if (e.key === 'ArrowRight')  onNext();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen, onClose, onPrev, onNext]);

  if (!isOpen || !artwork) return null;

  return (
    <div
      className="fixed inset-0 z-[110] flex flex-col items-center justify-center"
      role="dialog"
      aria-modal="true"
      aria-label={`Artwork: ${artwork.title}`}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 cursor-pointer"
        style={{ backgroundColor: 'rgba(4, 14, 8, 0.95)', backdropFilter: 'blur(8px)' }}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Close */}
      <button
        onClick={onClose}
        className="absolute top-5 right-5 z-20 w-10 h-10 rounded-full flex items-center justify-center transition-colors"
        style={{ backgroundColor: 'rgba(255,255,255,0.10)', color: 'rgba(255,255,255,0.80)' }}
        aria-label="Close"
      >
        <X size={18} />
      </button>

      {/* Counter */}
      <p
        className="absolute top-6 left-1/2 -translate-x-1/2 text-xs font-medium tracking-widest z-20"
        style={{ color: 'rgba(255,255,255,0.40)' }}
      >
        {(selectedIndex ?? 0) + 1} / {total}
      </p>

      {/* Prev arrow */}
      <button
        onClick={onPrev}
        className="absolute left-4 sm:left-6 z-20 w-11 h-11 rounded-full flex items-center justify-center transition-all hover:scale-105"
        style={{ backgroundColor: 'rgba(255,255,255,0.10)', color: 'rgba(255,255,255,0.80)', border: '1px solid rgba(255,255,255,0.12)' }}
        aria-label="Previous artwork"
      >
        <ChevronLeft size={20} />
      </button>

      {/* Next arrow */}
      <button
        onClick={onNext}
        className="absolute right-4 sm:right-6 z-20 w-11 h-11 rounded-full flex items-center justify-center transition-all hover:scale-105"
        style={{ backgroundColor: 'rgba(255,255,255,0.10)', color: 'rgba(255,255,255,0.80)', border: '1px solid rgba(255,255,255,0.12)' }}
        aria-label="Next artwork"
      >
        <ChevronRight size={20} />
      </button>

      {/* Image + caption */}
      <div
        className="relative z-10 flex flex-col items-center px-16 sm:px-24"
        style={{ maxWidth: '90vw' }}
        onClick={e => e.stopPropagation()}
      >
        <img
          key={artwork.src}
          src={artwork.src}
          alt={artwork.alt}
          className="block rounded-xl shadow-2xl"
          style={{
            maxHeight: '75vh',
            maxWidth:  '100%',
            width:     'auto',
            objectFit: 'contain',
            border:    '1px solid rgba(255,255,255,0.08)',
          }}
        />

        {/* Caption */}
        <div className="mt-5 text-center">
          <p
            className="font-display font-semibold text-white"
            style={{ fontSize: '1.25rem', letterSpacing: '-0.3px' }}
          >
            {artwork.title}
          </p>
          <p className="text-xs mt-1.5 tracking-wide" style={{ color: 'rgba(221,184,112,0.70)' }}>
            Recycled golf tees · Handcrafted by ReTees
          </p>
        </div>
      </div>

      {/* Keyboard hint */}
      <p
        className="absolute bottom-5 left-1/2 -translate-x-1/2 text-xs tracking-widest z-20 hidden sm:block"
        style={{ color: 'rgba(255,255,255,0.22)' }}
      >
        ← → to navigate · ESC to close
      </p>
    </div>
  );
}
