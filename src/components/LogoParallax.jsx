import React, { useState, useEffect, useRef } from 'react';
import { useScroll, useTransform } from 'framer-motion';

const LogoParallax = () => {
  const [width, setWidth] = useState(window.innerWidth);
  const targetRef = useRef(null);

  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isMobile = width < 768;

  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start start", "end end"]
  });

  // Desktop values
  const desktopX = useTransform(scrollYProgress, [0, 0.45, 1], ["-70vw", "0vw", "0vw"]);
  const desktopScale = useTransform(scrollYProgress, [0, 0.45, 1], [0.75, 1, 12]);
  const desktopOpacity = useTransform(scrollYProgress, [0, 0.15, 0.85, 1], [0, 1, 1, 0.15]);

  // Mobile values
  const mobileX = useTransform(scrollYProgress, [0, 0.45, 1], ["-85vw", "0vw", "0vw"]);
  const mobileScale = useTransform(scrollYProgress, [0, 0.45, 1], [0.75, 1, 8]);
  const mobileOpacity = useTransform(scrollYProgress, [0, 0.15, 0.85, 1], [0, 1, 1, 0.15]);

  const x = isMobile ? mobileX : desktopX;
  const scale = isMobile ? mobileScale : desktopScale;
  const opacity = isMobile ? mobileOpacity : desktopOpacity;

  return (
    <section ref={targetRef} style={{ height: isMobile ? '160vh' : '220vh' }} className="logo-parallax">
      <div className="logo-parallax-sticky">
        <img
          src="/logo-ciano.png"
          alt="SWN Studio"
          style={{ x, scale, opacity }}
          className="parallax-logo"
        />
      </div>
    </section>
  );
};

export default LogoParallax;