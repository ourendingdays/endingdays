(function initParticles() {
  const jsonPath = 'assets/particles/particles-stars-hovered.json?v=1';

  // If something initialized earlier, destroy it cleanly.
  if (window.pJSDom && pJSDom.length) {
    try { pJSDom[0].pJS.fn.vendors.destroypJS(); } catch (e) { /* noop */ }
  }

  if (!window.particlesJS) {
    console.error('particlesJS missing — check js/particles.min.js is loaded before main.js');
    return;
  }

  particlesJS.load('particles-js', jsonPath, () => {
    console.log('particles.js config loaded');
    // Optional: verify the active config
    const inst = pJSDom && pJSDom[0] && pJSDom[0].pJS;
    if (inst) {
      console.log('shape:', inst.particles.shape.type,
                  'lines:', inst.particles.line_linked.enable);
    }
  });
})();