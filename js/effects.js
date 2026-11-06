/*
 * Brain.exe — effects
 * Sound (Web Audio), terminal typewriter, ambient particle background,
 * toasts, and the obligatory fake error dialog.
 * Everything degrades gracefully when an API is unavailable.
 */
(function (ns) {
  'use strict';

  var audioCtx = null;
  var toastTimer = null;
  var bgStarted = false;
  var motionQuery = window.matchMedia ? window.matchMedia('(prefers-reduced-motion: reduce)') : null;

  function prefersReducedMotion() {
    return motionQuery ? motionQuery.matches : false;
  }

  function rand(min, max) {
    return min + Math.random() * (max - min);
  }

  function randInt(min, max) {
    return Math.floor(rand(min, max + 1));
  }

  function pick(list) {
    return list[Math.floor(Math.random() * list.length)];
  }

  function soundEnabled() {
    return !!(ns.Storage && ns.Storage.getPrefs().sound);
  }

  function ensureAudio() {
    if (!soundEnabled()) return null;
    var AudioCtor = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtor) return null;
    try {
      if (!audioCtx) audioCtx = new AudioCtor();
      if (audioCtx.state === 'suspended') audioCtx.resume();
      return audioCtx;
    } catch (err) {
      return null;
    }
  }

  function tone(freq, duration, type, volume, delay) {
    var ctx = ensureAudio();
    if (!ctx) return;
    try {
      var now = ctx.currentTime + (delay || 0);
      var osc = ctx.createOscillator();
      var gain = ctx.createGain();
      osc.type = type || 'sine';
      osc.frequency.setValueAtTime(freq, now);
      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.exponentialRampToValueAtTime(Math.max(0.0002, volume || 0.06), now + 0.012);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + duration + 0.03);
    } catch (err) {
      /* audio is a luxury, not a requirement */
    }
  }

  function sweep(from, to, duration, type, volume) {
    var ctx = ensureAudio();
    if (!ctx) return;
    try {
      var now = ctx.currentTime;
      var osc = ctx.createOscillator();
      var gain = ctx.createGain();
      osc.type = type || 'square';
      osc.frequency.setValueAtTime(from, now);
      osc.frequency.exponentialRampToValueAtTime(Math.max(1, to), now + duration);
      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.exponentialRampToValueAtTime(Math.max(0.0002, volume || 0.05), now + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + duration + 0.03);
    } catch (err) {
      /* noop */
    }
  }

  var sounds = {
    click: function () { tone(220, 0.055, 'square', 0.035); },
    hover: function () { tone(880, 0.03, 'sine', 0.012); },
    select: function () { tone(540, 0.07, 'triangle', 0.05); tone(760, 0.09, 'triangle', 0.04, 0.06); },
    next: function () { tone(420, 0.08, 'sine', 0.04); tone(620, 0.1, 'sine', 0.035, 0.05); },
    back: function () { tone(330, 0.08, 'sine', 0.035); },
    type: function () { tone(1200, 0.012, 'square', 0.008); },
    error: function () { sweep(340, 110, 0.35, 'sawtooth', 0.055); },
    success: function () {
      tone(523.25, 0.12, 'sine', 0.05, 0);
      tone(659.25, 0.12, 'sine', 0.05, 0.1);
      tone(783.99, 0.12, 'sine', 0.05, 0.2);
      tone(1046.5, 0.22, 'sine', 0.05, 0.3);
    },
    start: function () { sweep(220, 880, 0.3, 'triangle', 0.05); },
    tick: function () { tone(1500, 0.02, 'square', 0.014); }
  };

  function play(name) {
    if (sounds[name]) sounds[name]();
  }

  /* ------------------------------ Typewriter ---------------------------- */

  function typeLine(container, text, options) {
    options = options || {};
    return new Promise(function (resolve) {
      if (!container) { resolve(); return; }

      var line = document.createElement('div');
      line.className = options.className || 'term-line';
      container.appendChild(line);

      if (options.instant || prefersReducedMotion()) {
        line.textContent = text;
        resolve();
        return;
      }

      var index = 0;
      var speed = options.speed || 16;
      var timer = window.setInterval(function () {
        index += 1;
        line.textContent = text.slice(0, index);
        if (options.sound && index % 3 === 0) play('type');
        if (index >= text.length) {
          window.clearInterval(timer);
          resolve();
        }
      }, speed);
    });
  }

  function wait(ms) {
    if (prefersReducedMotion()) return Promise.resolve();
    return new Promise(function (resolve) { window.setTimeout(resolve, ms); });
  }

  /* -------------------------------- Toasts ------------------------------ */

  function toast(message, options) {
    options = options || {};
    var el = document.getElementById('toast');
    if (!el) return;
    el.textContent = message;
    el.classList.add('show');
    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(function () {
      el.classList.remove('show');
    }, options.duration || 2800);
  }

  /* ---------------------------- Fake errors ----------------------------- */

  var ERROR_MESSAGES = [
    { m: 'brain.exe has stopped responding.', d: 'Do you want to keep pretending everything is fine?' },
    { m: 'ERROR: logic.dll could not be located.', d: 'Would you like to search the recycle bin?' },
    { m: 'Common sense is not responding.', d: 'Windows is checking for a solution. It gave up.' },
    { m: 'Too many thoughts detected.', d: 'Close 46 tabs and try again.' },
    { m: 'Memory leak detected in: feelings.', d: 'This has been happening since 2014.' },
    { m: 'Brain is running on 2% battery.', d: 'Please insert coffee to continue.' },
    { m: 'Overthinking service has crashed.', d: 'It is currently thinking about why it crashed.' }
  ];

  function showFakeError(custom) {
    var modal = document.getElementById('errorModal');
    if (!modal) return;
    var chosen = custom || pick(ERROR_MESSAGES);
    var messageEl = document.getElementById('errorMessage');
    var detailEl = document.getElementById('errorDetail');
    if (messageEl) messageEl.textContent = chosen.m;
    if (detailEl) detailEl.textContent = chosen.d;
    play('error');
    if (ns.App && typeof ns.App.openModal === 'function') {
      ns.App.openModal('errorModal');
    }
  }

  /* --------------------------- Ambient background ----------------------- */

  function initBackground() {
    if (bgStarted) return;
    bgStarted = true;

    var canvas = document.getElementById('bgCanvas');
    if (!canvas) return;
    var ctx = canvas.getContext ? canvas.getContext('2d') : null;
    if (!ctx) return;

    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    var width = 0;
    var height = 0;
    var particles = [];
    var rafId = null;
    var resizeTimer = null;

    function resize() {
      width = canvas.clientWidth || window.innerWidth;
      height = canvas.clientHeight || window.innerHeight;
      canvas.width = Math.max(1, Math.floor(width * dpr));
      canvas.height = Math.max(1, Math.floor(height * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      seed();
      if (prefersReducedMotion()) drawStatic();
    }

    function seed() {
      var count = prefersReducedMotion() ? 24 : Math.min(70, Math.floor((width * height) / 26000));
      particles = [];
      for (var i = 0; i < count; i++) {
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: rand(-0.18, 0.18),
          vy: rand(-0.12, 0.12),
          r: rand(0.6, 1.9),
          alpha: rand(0.12, 0.5),
          color: pick(['#38ff9c', '#3cf0ff', '#b06bff'])
        });
      }
    }

    function paint(advance) {
      ctx.clearRect(0, 0, width, height);
      for (var i = 0; i < particles.length; i++) {
        var p = particles[i];
        if (advance) {
          p.x += p.vx;
          p.y += p.vy;
          if (p.x < -10) p.x = width + 10;
          if (p.x > width + 10) p.x = -10;
          if (p.y < -10) p.y = height + 10;
          if (p.y > height + 10) p.y = -10;
        }
        ctx.globalAlpha = p.alpha;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
    }

    function drawStatic() {
      paint(false);
    }

    function loop() {
      paint(true);
      rafId = window.requestAnimationFrame(loop);
    }

    resize();
    if (!prefersReducedMotion()) loop();

    window.addEventListener('resize', function () {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(resize, 180);
    });

    if (motionQuery && motionQuery.addEventListener) {
      motionQuery.addEventListener('change', function () {
        if (rafId) {
          window.cancelAnimationFrame(rafId);
          rafId = null;
        }
        if (prefersReducedMotion()) {
          drawStatic();
        } else {
          loop();
        }
      });
    }
  }

  ns.Effects = {
    play: play,
    sounds: sounds,
    typeLine: typeLine,
    wait: wait,
    toast: toast,
    showFakeError: showFakeError,
    initBackground: initBackground,
    prefersReducedMotion: prefersReducedMotion,
    rand: rand,
    randInt: randInt,
    pick: pick,
    ensureAudio: ensureAudio
  };
})(window.BrainExe = window.BrainExe || {});
