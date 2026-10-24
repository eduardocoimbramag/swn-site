import React from 'react';
import { useLocation } from 'react-router-dom';
import Header from '../components/Header';
import Hero from '../components/Hero';
import LogoParallax from '../components/LogoParallax';
import Services from '../components/Services';
import Team from '../components/Team';
import Process from '../components/Process';
import Portfolio from '../components/Portfolio';
import Testimonials from '../components/Testimonials';
import Contact from '../components/Contact';
import Footer from '../components/Footer';
import WaveDivider from '../components/svg/WaveDivider';

const HomePage = () => {
  /* Force remount of <main> on every navigation back to "/".
     Framer Motion's useScroll measures its target via useLayoutEffect — under
     BrowserRouter that runs BEFORE the route's layout settles, caching wrong
     offsetTop/scrollHeight. Re-keying <main> tears down + remounts the whole
     section tree (including scroll-driven sections) AFTER the router resolved the
     route and ScrollToTop already ran, so the layoutEffect now reads the
     correct measurements. */
  const { key } = useLocation();

  return (
    <>
      <Header />
      <main key={key}>
        <Hero />
        <WaveDivider />
        <LogoParallax />
        <Services />
        <Team />
        <WaveDivider flip />
        <Process />
        <Portfolio />
        <Testimonials />
        <Contact />
      </main>
      <Footer />
    </>
  );
};

export default HomePage;
