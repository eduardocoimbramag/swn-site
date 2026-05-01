import React from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import About from './components/About';
import LogoParallax from './components/LogoParallax';
import Services from './components/Services';
import Process from './components/Process';
import FinalCTA from './components/FinalCTA';
import Footer from './components/Footer';

function App() {
  return (
    <>
      <Header />
      <Hero />
      <About />
      <LogoParallax />
      <Services />
      <Process />
      <FinalCTA />
      <Footer />
    </>
  );
}

export default App;