import { useState } from 'react';
import { useInView } from '@/hooks/useInView';
import ArtworkLightbox from '@/components/modals/ArtworkLightbox';

const ARTWORKS = [
  {
    src:   '/images/art0.jpg',
    alt:   'Bob Does Sports logo made from recycled golf tees — branding for the popular golf YouTube channel hosted by Bobby Fairways and the Breezy Golf crew',
    title: 'Bob Does Sports',
  },
  {
    src:   '/images/art1.webp',
    alt:   'American flag made from recycled golf tees — red, white, and blue tees arranged in the stars and stripes pattern in a matted frame',
    title: 'American Flag',
  },
  {
    src:   '/images/art2.webp',
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
    src:   '/images/art6.webp',
    alt:   'NC State Wolfpack logo made from recycled golf tees — red, black, and white tees forming the Wolfpack insignia',
    title: 'NC State',
  },
  {
    src:   '/images/art7.webp',
    alt:   'The Masters golf tournament logo made from recycled golf tees — green and gold tees representing the Augusta National Invitational',
    title: 'The Masters',
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
];

// Duplicate for seamless infinite loop
const TRACK_ITEMS = [...ARTWORKS, ...ARTWORKS];

interface ArtworkCarouselProps {
  onOpenInquiry: () => void;
}

export default function ArtworkCarousel({ onOpenInquiry }: ArtworkCarouselProps) {
  const { ref: headRef, inView: headIn } = useInView();
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const openLightbox = (trackIndex: number) => {
    // Map duplicated track index back to original artwork index
    setLightboxIndex(trackIndex % ARTWORKS.length);
  };

  const closeLightbox = () => setLightboxIndex(null);

  const prevArtwork = () =>
    setLightboxIndex(i => (i === null ? 0 : (i - 1 + ARTWORKS.length) % ARTWORKS.length));

  const nextArtwork = () =>
    setLightboxIndex(i => (i === null ? 0 : (i + 1) % ARTWORKS.length));

  return (
    <>
      <section
        id="artwork"
        className="py-20 sm:py-28 overflow-hidden"
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

        {/* Infinite marquee */}
        <div className="marquee-container">
          <div className="marquee-track" aria-label="Artwork carousel">
            {TRACK_ITEMS.map((artwork, i) => (
              <div key={i} className="flex-shrink-0 artwork-card-wrapper">
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
