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
import TournamentModal   from '@/components/modals/TournamentModal';
import RegistrationModal from '@/components/modals/RegistrationModal';

export default function Home() {
  const [inquiryOpen,    setInquiryOpen]    = useState(false);
  const [sponsorOpen,    setSponsorOpen]    = useState(false);
  const [sponsorFormId,  setSponsorFormId]  = useState('');
  const [tournamentOpen, setTournamentOpen] = useState(false);
  const [registerOpen,   setRegisterOpen]   = useState(false);

  const openInquiry    = () => setInquiryOpen(true);
  const openSponsor    = (formId: string) => { setSponsorFormId(formId); setSponsorOpen(true); };
  const openTournament = () => setTournamentOpen(true);
  const openRegister   = () => setRegisterOpen(true);

  return (
    <>
      <Header onOpenInquiry={openInquiry} />

      <main>
        <HeroSection     onOpenInquiry={openInquiry} />
        <ArtworkCarousel onOpenInquiry={openInquiry} />
        <AboutSection    />
        <TournamentSection onOpenDetails={openTournament} onOpenRegister={openRegister} />
        <SponsorSection  onOpenSponsor={openSponsor} />
        <HatSection      />
      </main>

      <Footer onOpenInquiry={openInquiry} />

      <InquiryModal      open={inquiryOpen}    onClose={() => setInquiryOpen(false)}    />
      <SponsorModal      open={sponsorOpen}    onClose={() => setSponsorOpen(false)}    formId={sponsorFormId} />
      <TournamentModal   open={tournamentOpen} onClose={() => setTournamentOpen(false)} onRegister={() => { setTournamentOpen(false); setRegisterOpen(true); }} />
      <RegistrationModal open={registerOpen}   onClose={() => setRegisterOpen(false)}   />
    </>
  );
}
