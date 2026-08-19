/**
 * Background Wedding Audio Controller with Volume Booster
 */
const WeddingAudio = (() => {
  let audioElement = null;
  let toggleBtn = null;
  let isPlaying = false;
  let audioCtx = null;
  let gainNode = null;
  let sourceNode = null;
  let isBoosted = false;

  function init() {
    audioElement = document.getElementById('wedding-audio');
    toggleBtn = document.getElementById('music-toggle');

    if (!audioElement || !toggleBtn) return;

    // Set standard element volume to 100% maximum
    audioElement.volume = 1.0;

    toggleBtn.addEventListener('click', toggleAudio);
  }

  function setupAudioBoost() {
    if (isBoosted || !audioElement) return;
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        audioCtx = new AudioContext();
        if (audioCtx.state === 'suspended') {
          audioCtx.resume();
        }
        sourceNode = audioCtx.createMediaElementSource(audioElement);
        gainNode = audioCtx.createGain();
        
        // Boost volume multiplier (2.5x volume boost for soft audio files)
        gainNode.gain.value = 2.5;

        // Connect source -> gain -> speakers
        sourceNode.connect(gainNode);
        gainNode.connect(audioCtx.destination);
        isBoosted = true;
      }
    } catch (e) {
      console.warn("AudioContext booster initialized or fallback:", e);
    }
  }

  function play() {
    if (!audioElement) return;

    // Initialize Web Audio volume booster on first user gesture
    setupAudioBoost();
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }

    audioElement.volume = 1.0;
    audioElement.play().then(() => {
      isPlaying = true;
      updateUI();
    }).catch(err => {
      console.warn("Audio autoplay prevented or error:", err);
      isPlaying = false;
      updateUI();
    });
  }

  function pause() {
    if (!audioElement) return;
    audioElement.pause();
    isPlaying = false;
    updateUI();
  }

  function toggleAudio() {
    if (isPlaying) {
      pause();
    } else {
      play();
    }
  }

  function updateUI() {
    if (!toggleBtn) return;
    if (isPlaying) {
      toggleBtn.classList.add('playing');
      toggleBtn.setAttribute('title', 'Pause Music');
      toggleBtn.innerHTML = `
        <svg viewBox="0 0 24 24">
          <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/>
        </svg>
      `;
    } else {
      toggleBtn.classList.remove('playing');
      toggleBtn.setAttribute('title', 'Play Music');
      toggleBtn.innerHTML = `
        <svg viewBox="0 0 24 24">
          <path d="M4.27 3L3 4.27l9 9v.28c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4v-1.73l4.27 4.27c-.4.27-.86.46-1.37.46-1.5 0-2.73-1.07-2.95-2.5h-1.5c.23 2.27 2.13 4 4.45 4 .93 0 1.79-.28 2.51-.77l2.82 2.82L21 20.73 4.27 3zM14 7h4V3h-6v5.18l2 2V7z"/>
        </svg>
      `;
    }
  }

  function showButton() {
    if (toggleBtn) {
      toggleBtn.classList.add('visible');
    }
  }

  return {
    init,
    play,
    pause,
    showButton
  };
})();

