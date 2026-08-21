/**
 * Envelope 3D Physical Opening Handler
 * Coordinates: Wax seal crack, flap opening, card slide-up, flower petal explosion & shower
 */
const EnvelopeController = (() => {
  let envelopeScreen = null;
  let sealContainer = null;
  let hasOpened = false;

  // Synthesize a magical royal chime flourish on click
  function playRoyalChime() {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      if (ctx.state === 'suspended') ctx.resume();

      const notes = [523.25, 659.25, 783.99, 1046.50, 1318.51, 1567.98]; // C5, E5, G5, C6, E6, G6 (Celestial Arpeggio)
      const now = ctx.currentTime;

      notes.forEach((freq, index) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + index * 0.07);

        gain.gain.setValueAtTime(0, now + index * 0.07);
        gain.gain.linearRampToValueAtTime(0.3, now + index * 0.07 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, now + index * 0.07 + 0.8);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + index * 0.07);
        osc.stop(now + index * 0.07 + 0.9);
      });
    } catch (e) {
      // Graceful fallback
    }
  }

  function init() {
    envelopeScreen = document.getElementById('envelope-screen');
    sealContainer = document.getElementById('wax-seal-trigger');

    if (!envelopeScreen || !sealContainer) return;

    sealContainer.addEventListener('click', handleOpenEnvelope);
    envelopeScreen.addEventListener('click', (e) => {
      if (!hasOpened) handleOpenEnvelope(e);
    });

    sealContainer.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        handleOpenEnvelope(e);
      }
    });
  }

  function handleOpenEnvelope(e) {
    if (hasOpened) return;
    hasOpened = true;

    // Get click location for burst
    let clientX = window.innerWidth / 2;
    let clientY = window.innerHeight / 2;
    if (e && e.clientX) {
      clientX = e.clientX;
      clientY = e.clientY;
    } else if (sealContainer) {
      const rect = sealContainer.getBoundingClientRect();
      clientX = rect.left + rect.width / 2;
      clientY = rect.top + rect.height / 2;
    }

    // 1. Play magical chime + Boosted wedding audio
    playRoyalChime();
    WeddingAudio.play();

    // 2. Trigger instant 360-degree burst of petals and golden sparks from the seal
    if (window.ParticleEngine) {
      window.ParticleEngine.burst(clientX, clientY);
      // Grand celebratory flower shower for 5 seconds, then gracefully finishes & stops
      window.ParticleEngine.start(70, 5000);
    }

    // 3. Trigger 3D envelope animation phases
    envelopeScreen.classList.add('opening');

    // 4. Slide out invitation and smoothly reveal the full page
    setTimeout(() => {
      envelopeScreen.classList.add('opened');
      WeddingAudio.showButton();
    }, 2200);
  }

  return {
    init
  };
})();

