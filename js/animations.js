/**
 * Royal Wedding Particle & Flower Shower Engine
 * Features: Cascading Rose Petal Rain, Golden Glitter Sparks, 3D Tumbling Physics, Burst Explosions
 */
const ParticleEngine = (() => {
  let canvas, ctx;
  let particles = [];
  let burstParticles = [];
  let isRunning = false;
  let isSpawning = false;
  let showerTimer = null;
  let animFrameId = null;

  // Petal Color Palettes (Velvety Red, Romantic Pink, Golden Silk, Cream Ivory)
  const petalColors = [
    { fill: '#C41E3A', edge: '#8B0000', dark: '#5E0000' }, // Rich Red Rose
    { fill: '#E63956', edge: '#B81D39', dark: '#7A0E22' }, // Crimson Rose
    { fill: '#F8B4BF', edge: '#E88B9C', dark: '#C45C72' }, // Soft Blush Pink
    { fill: '#FFD700', edge: '#D4AF37', dark: '#AA820A' }, // Royal Gold Flake
    { fill: '#FFF5EB', edge: '#F3E5D8', dark: '#DBC5B0' }  // Jasmine Ivory
  ];

  class FlowerPetal {
    constructor(w, h, isTopDrop = false) {
      this.reset(w, h, isTopDrop);
    }

    reset(w, h, isTopDrop = false) {
      this.x = Math.random() * (w + 100) - 50;
      this.y = isTopDrop ? -(15 + Math.random() * 90) : (Math.random() * (h * 0.7) - 30);
      this.size = 12 + Math.random() * 16;
      this.speedY = 1.5 + Math.random() * 2.2;
      this.speedX = (Math.random() - 0.5) * 1.5;
      
      // 3D Rotation angles and speeds
      this.rotX = Math.random() * 360;
      this.rotY = Math.random() * 360;
      this.rotZ = Math.random() * 360;
      this.rotSpeedX = 0.8 + Math.random() * 2.2;
      this.rotSpeedY = 0.5 + Math.random() * 1.8;
      this.rotSpeedZ = (Math.random() - 0.5) * 2.0;

      // Sway dynamics
      this.swayFreq = 0.015 + Math.random() * 0.02;
      this.swayAmp = 1.2 + Math.random() * 2.0;
      this.swayOffset = Math.random() * 100;

      this.opacity = 0.8 + Math.random() * 0.2;
      this.color = petalColors[Math.floor(Math.random() * petalColors.length)];
      this.type = Math.random() > 0.18 ? 'petal' : 'gold_sparkle';
    }

    update(w, h, canRecycle = true) {
      this.y += this.speedY;
      this.x += this.speedX + Math.sin((this.y + this.swayOffset) * this.swayFreq) * this.swayAmp;
      
      this.rotX += this.rotSpeedX;
      this.rotY += this.rotSpeedY;
      this.rotZ += this.rotSpeedZ;

      // Out of bounds check
      if (this.y > h + 50 || this.x < -70 || this.x > w + 70) {
        if (canRecycle) {
          this.reset(w, h, true);
          return true;
        }
        return false; // Remove petal once shower duration has ended
      }
      return true;
    }

    draw(ctx) {
      ctx.save();
      ctx.translate(this.x, this.y);

      // Simulate 3D rotation with 2D transformations
      const radX = (this.rotX * Math.PI) / 180;
      const radY = (this.rotY * Math.PI) / 180;
      const radZ = (this.rotZ * Math.PI) / 180;

      const scaleX = Math.cos(radY);
      const scaleY = Math.cos(radX);

      ctx.rotate(radZ);
      ctx.scale(Math.abs(scaleX) < 0.1 ? 0.1 : scaleX, Math.abs(scaleY) < 0.1 ? 0.1 : scaleY);
      ctx.globalAlpha = this.opacity;

      if (this.type === 'petal') {
        // High quality realistic 3D curved rose petal
        const grad = ctx.createLinearGradient(-this.size / 2, -this.size / 2, this.size / 2, this.size / 2);
        grad.addColorStop(0, this.color.fill);
        grad.addColorStop(0.6, this.color.edge);
        grad.addColorStop(1, this.color.dark);

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.moveTo(0, -this.size);
        ctx.bezierCurveTo(this.size * 0.9, -this.size * 0.8, this.size * 0.95, this.size * 0.4, 0, this.size * 0.9);
        ctx.bezierCurveTo(-this.size * 0.95, this.size * 0.4, -this.size * 0.9, -this.size * 0.8, 0, -this.size);
        ctx.closePath();
        ctx.fill();

        // Subtle petal vein highlight
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.25)';
        ctx.lineWidth = 0.8;
        ctx.beginPath();
        ctx.moveTo(0, -this.size * 0.8);
        ctx.quadraticCurveTo(this.size * 0.1, 0, 0, this.size * 0.7);
        ctx.stroke();
      } else {
        // Shimmering 4-point gold star particle
        const size = this.size * 0.55;
        const grad = ctx.createRadialGradient(0, 0, 0, 0, 0, size);
        grad.addColorStop(0, '#FFFFFF');
        grad.addColorStop(0.4, '#FFE57F');
        grad.addColorStop(0.8, '#D4AF37');
        grad.addColorStop(1, 'rgba(212, 175, 55, 0)');

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(0, 0, size, 0, Math.PI * 2);
        ctx.fill();

        // Cross sparkle
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(-size * 1.5, -0.8, size * 3, 1.6);
        ctx.fillRect(-0.8, -size * 1.5, 1.6, size * 3);
      }

      ctx.restore();
    }
  }

  // Burst particle for explosive celebration on wax seal click
  class BurstSparks {
    constructor(originX, originY) {
      this.x = originX;
      this.y = originY;
      const angle = Math.random() * Math.PI * 2;
      const force = 3 + Math.random() * 8.5;
      this.vx = Math.cos(angle) * force;
      this.vy = Math.sin(angle) * force - 2.5;
      this.gravity = 0.18;
      this.friction = 0.96;
      this.size = 5 + Math.random() * 10;
      this.alpha = 1.0;
      this.decay = 0.012 + Math.random() * 0.02;
      this.color = Math.random() > 0.4 ? petalColors[0] : petalColors[3];
      this.rot = Math.random() * 360;
      this.rotSpeed = (Math.random() - 0.5) * 15;
    }

    update() {
      this.vx *= this.friction;
      this.vy *= this.friction;
      this.vy += this.gravity;
      this.x += this.vx;
      this.y += this.vy;
      this.rot += this.rotSpeed;
      this.alpha -= this.decay;
      return this.alpha > 0;
    }

    draw(ctx) {
      if (this.alpha <= 0) return;
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate((this.rot * Math.PI) / 180);
      ctx.globalAlpha = Math.max(0, this.alpha);
      ctx.fillStyle = this.color.fill;
      ctx.beginPath();
      ctx.ellipse(0, 0, this.size, this.size * 0.6, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  function init() {
    canvas = document.getElementById('particles-canvas');
    if (!canvas) return;
    ctx = canvas.getContext('2d');
    resize();
    window.addEventListener('resize', resize);
  }

  function resize() {
    if (!canvas) return;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  // Trigger grand explosive burst from coordinates
  function burst(x, y) {
    if (!canvas || !ctx) init();
    resize();
    const count = 55;
    for (let i = 0; i < count; i++) {
      burstParticles.push(new BurstSparks(x || canvas.width / 2, y || canvas.height / 2));
    }
    if (!animFrameId) {
      loop();
    }
  }

  // Start timed flower rain shower falling from top
  function startFlowerShower(initialCount = 70, durationMs = 5000) {
    if (!canvas || !ctx) init();
    resize();
    
    if (showerTimer) {
      clearTimeout(showerTimer);
      showerTimer = null;
    }

    isRunning = true;
    isSpawning = true;

    // Create rich flower shower particles originating mostly from the top
    particles = [];
    for (let i = 0; i < initialCount; i++) {
      particles.push(new FlowerPetal(canvas.width, canvas.height, false));
    }

    // After durationMs, stop recycling petals so the shower gracefully concludes
    if (durationMs > 0) {
      showerTimer = setTimeout(() => {
        isSpawning = false;
        showerTimer = null;
      }, durationMs);
    }

    if (!animFrameId) {
      loop();
    }
  }

  function loop() {
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Update & draw background raining petals
    if (isRunning) {
      for (let i = particles.length - 1; i >= 0; i--) {
        const isAlive = particles[i].update(canvas.width, canvas.height, isSpawning);
        if (isAlive) {
          particles[i].draw(ctx);
        } else {
          particles.splice(i, 1);
        }
      }
    }

    // Update & draw active burst particles
    for (let i = burstParticles.length - 1; i >= 0; i--) {
      const alive = burstParticles[i].update();
      if (alive) {
        burstParticles[i].draw(ctx);
      } else {
        burstParticles.splice(i, 1);
      }
    }

    // If all particles have fallen and spawning is finished, clean up & stop loop
    if (particles.length === 0 && burstParticles.length === 0 && !isSpawning) {
      stop();
      return;
    }

    animFrameId = requestAnimationFrame(loop);
  }

  function stop() {
    isRunning = false;
    isSpawning = false;
    if (showerTimer) {
      clearTimeout(showerTimer);
      showerTimer = null;
    }
    if (animFrameId) {
      cancelAnimationFrame(animFrameId);
      animFrameId = null;
    }
    if (ctx && canvas) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  }

  return {
    init,
    start: startFlowerShower,
    burst,
    stop
  };
})();

window.ParticleEngine = ParticleEngine;

/**
 * Scroll Reveal Observer
 */
const ScrollReveals = (() => {
  function init() {
    const items = document.querySelectorAll('.reveal-item');
    if (!items.length) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');

          // Auto-play videos when revealed in viewport
          const video = entry.target.querySelector('video') || (entry.target.tagName === 'VIDEO' ? entry.target : null);
          if (video && video.paused) {
            video.play().catch(() => {});
          }
        }
      });
    }, {
      rootMargin: '0px 0px -40px 0px',
      threshold: 0.15
    });

    items.forEach(item => observer.observe(item));
  }

  return {
    init
  };
})();

