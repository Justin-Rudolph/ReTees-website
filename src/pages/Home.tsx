import { useState } from 'react';
import Header         from '@/components/layout/Header';
import Footer         from '@/components/layout/Footer';
import HeroSection    from '@/components/sections/HeroSection';
import ArtworkCarousel from '@/components/sections/ArtworkCarousel';
import AboutSection   from '@/components/sections/AboutSection';
import TournamentSection from '@/components/sections/TournamentSection';
import SponsorSection from '@/components/sections/SponsorSection';
import HatSection     from '@/components/sections/HatSection';
import InquiryModal      from '@/components/modals/InquiryModal';
import SponsorModal      from '@/components/modals/SponsorModal';
import TourWaitlistModal from '@/components/modals/TourWaitlistModal';

export default function Home() {
  const [inquiryOpen,    setInquiryOpen]    = useState(false);
  const [sponsorOpen,    setSponsorOpen]    = useState(false);
  const [sponsorFormId,  setSponsorFormId]  = useState('');
  const [waitlistOpen,   setWaitlistOpen]   = useState(false);

  const openInquiry    = () => setInquiryOpen(true);
  const openSponsor    = (formId: string) => { setSponsorFormId(formId); setSponsorOpen(true); };

  return (
    <>
      <Header onOpenInquiry={openInquiry} onOpenTour={() => setWaitlistOpen(true)} />

      <main>
        <HeroSection     onOpenInquiry={openInquiry} onOpenTour={() => setWaitlistOpen(true)} />
        <ArtworkCarousel onOpenInquiry={openInquiry} />
        <TournamentSection onOpenTour={() => setWaitlistOpen(true)} />
        <SponsorSection  onOpenSponsor={openSponsor} />
        <AboutSection    />
        <HatSection      />
      </main>

      <Footer onOpenInquiry={openInquiry} />

      <InquiryModal      open={inquiryOpen}    onClose={() => setInquiryOpen(false)}    />
      <SponsorModal      open={sponsorOpen}    onClose={() => setSponsorOpen(false)}    formId={sponsorFormId} />
      <TourWaitlistModal open={waitlistOpen}   onClose={() => setWaitlistOpen(false)}   />
    </>
  );
}
