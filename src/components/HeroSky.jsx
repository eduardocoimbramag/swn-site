import React, { useEffect, useRef } from 'react';
import usePrefersReducedMotion from '../hooks/usePrefersReducedMotion';
import { SkyScene } from '../lib/skyScene';

/**
 * Céu do Hero — estrelas e estrelas cadentes num canvas (ver SkyScene).
 *
 * O loop só corre com o Hero na tela e a aba ativa. O cursor (apenas em
 * dispositivos com mouse) dá profundidade às estrelas mais próximas. Com
 * movimento reduzido o céu é desenhado uma vez, parado e sem cadentes.
 */
const HeroSky = () => {
  const reduced = usePrefersReducedMotion();
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;

    const scene = new SkyScene(canvas);
    scene.still = reduced;

    let raf = 0;
    let last = 0;
    let inView = true;

    const loop = (now) => {
      const dt = last ? Math.min((now - last) / 1000, 0.05) : 0;
      last = now;
      scene.update(dt);
      scene.draw();
      raf = requestAnimationFrame(loop);
    };
    const start = () => {
      if (raf || reduced || !inView || document.hidden) return;
      last = 0;
      raf = requestAnimationFrame(loop);
    };
    const stop = () => {
      cancelAnimationFrame(raf);
      raf = 0;
    };

    const ro = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      scene.resize(width, height);
      if (!raf) scene.draw();
    });
    ro.observe(canvas);

    const io = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting;
      if (inView) start();
      else stop();
    });
    io.observe(canvas);

    const onVisibility = () => (document.hidden ? stop() : start());
    document.addEventListener('visibilitychange', onVisibility);

    const finePointer = window.matchMedia?.('(hover: hover) and (pointer: fine)').matches;
    const onPointer = (e) => {
      scene.pointer((e.clientX / window.innerWidth) * 2 - 1, (e.clientY / window.innerHeight) * 2 - 1);
    };
    if (finePointer && !reduced) window.addEventListener('pointermove', onPointer, { passive: true });

    start();

    return () => {
      stop();
      ro.disconnect();
      io.disconnect();
      document.removeEventListener('visibilitychange', onVisibility);
      window.removeEventListener('pointermove', onPointer);
    };
  }, [reduced]);

  return <canvas ref={canvasRef} className="hero-sky" aria-hidden="true" />;
};

export default HeroSky;
