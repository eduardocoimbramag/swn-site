import React from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import About from './components/About';
import LogoParallax from './components/LogoParallax';
import Services from './components/Services';
import Process from './components/Process';
import Portfolio from './components/Portfolio';
import Testimonials from './components/Testimonials';
import Contact from './components/Contact';
import Footer from './components/Footer';
import FloatingWhatsApp from './components/FloatingWhatsApp';
import WaveDivider from './components/svg/WaveDivider';

function App() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <About />
        <WaveDivider />
        <LogoParallax />
        <Services />
        <WaveDivider flip />
        <Process />
        <Portfolio />
        <Testimonials />
        <Contact />
      </main>
      <Footer />
      <FloatingWhatsApp />
    </>
  );
}

export default App;
