/*
 * Brain.exe — app orchestration
 * Screens, navigation, prefs, history, modals, easter egg, and the
 * random system chatter on the landing page.
 */
(function (ns) {
  'use strict';

  var E = ns.Effects;
  var S = ns.Storage;

  var lastFocused = null;
  var brandClicks = 0;
  var brandTimer = null;
  var terminalRunning = false;
  var statusTimer = null;

  var HERO_TERMINAL_LINES = [
    { t: 'Initializing brain.exe...', c: '' },
    { t: 'Checking common sense...', c: '' },
    { t: 'Detecting overthinking...', c: '' },
    { t: 'Warning: Too many thoughts detected.', c: 'warn' },
    { t: 'System ready.', c: 'ok' }
  ];

  var STATUS_MESSAGES = [
    'calibrating nonsense...',
    'checking vibes...',
    'loading common sense... 3%',
    'brain cells: 2 found',
    'thinking about lunch...',
    'overthinking detected',
    'please remain calm',
    'scanning for logic...',
    'no logic found',
    'warming up excuses...'
  ];

  function el(id) {
    return document.getElementById(id);
  }

  function init() {
    var year = el('year');
    if (year) year.textContent = String(new Date().getFullYear());

    E.initBackground();
    ns.Quiz.init();

    updateSoundUI();
    wireNavigation();
    wireQuizStart();
    wireResultActions();
    wireModals();
    wireEasterEgg();
    wireKeyboardHelp();

    startHeroTerminal();
    startStatusChatter();

    ns.Quiz.onComplete = function (scores) {
      showScreen('screen-analysis');
      ns.Results.runAnalysis(scores, function (result) {
        ns.Results.render(result);
        showScreen('screen-result');
      });
    };

    // Unlock audio on the first real interaction (browser policy).
    document.addEventListener('pointerdown', function unlock() {
      E.ensureAudio();
    }, { once: true });
  }

  /* ------------------------------- Screens ------------------------------ */

  function showScreen(id) {
    var screens = document.querySelectorAll('.screen');
    for (var i = 0; i < screens.length; i++) {
      screens[i].classList.toggle('active', screens[i].id === id);
    }

    var screen = el(id);
    if (screen) {
      screen.classList.remove('enter');
      void screen.offsetWidth;
      screen.classList.add('enter');
      if (!screen.hasAttribute('tabindex')) screen.setAttribute('tabindex', '-1');
      try { screen.focus({ preventScroll: true }); } catch (err) { /* noop */ }
    }

    if (typeof window.scrollTo === 'function') {
      try {
        window.scrollTo({ top: 0, behavior: E.prefersReducedMotion() ? 'auto' : 'smooth' });
      } catch (err) {
        window.scrollTo(0, 0);
      }
    }
  }

  /* ----------------------------- Navigation ----------------------------- */

  function wireNavigation() {
    var soundToggle = el('soundToggle');
    if (soundToggle) {
      soundToggle.addEventListener('click', function () {
        var prefs = S.getPrefs();
        var next = !prefs.sound;
        S.setPref('sound', next);
        updateSoundUI();
        if (next) E.play('select');
        E.toast(next ? 'Sound enabled. Regret incoming.' : 'Sound muted. Peace at last.');
      });
    }

    var historyBtn = el('historyBtn');
    if (historyBtn) {
      historyBtn.addEventListener('click', function () {
        E.play('click');
        renderHistory();
        showScreen('screen-history');
      });
    }

    var resetBtn = el('resetBtn');
    if (resetBtn) {
      resetBtn.addEventListener('click', function () {
        E.play('click');
        openModal('confirmModal');
      });
    }

    var backHomeBtn = el('backHomeBtn');
    if (backHomeBtn) {
      backHomeBtn.addEventListener('click', function () {
        E.play('back');
        showScreen('screen-hero');
      });
    }

    var clearHistoryBtn = el('clearHistoryBtn');
    if (clearHistoryBtn) {
      clearHistoryBtn.addEventListener('click', function () {
        S.clearHistory();
        renderHistory();
        E.play('success');
        E.toast('History cleared. The past cannot hurt you. (It can.)');
      });
    }
  }

  function updateSoundUI() {
    var prefs = S.getPrefs();
    var button = el('soundToggle');
    var icon = el('soundIcon');
    var label = el('soundLabel');
    if (button) {
      button.setAttribute('aria-pressed', String(!!prefs.sound));
      button.classList.toggle('muted', !prefs.sound);
    }
    if (icon) icon.textContent = prefs.sound ? '🔊' : '🔇';
    if (label) label.textContent = prefs.sound ? 'SOUND ON' : 'SOUND OFF';
  }

  function wireQuizStart() {
    var startBtn = el('startBtn');
    if (startBtn) {
      startBtn.addEventListener('click', function () {
        E.ensureAudio();
        E.play('start');
        ns.Quiz.start();
      });
    }

    var againBtn = el('againBtn');
    if (againBtn) {
      againBtn.addEventListener('click', function () {
        E.play('start');
        ns.Quiz.start();
      });
    }
  }

  /* --------------------------- Result actions --------------------------- */

  function wireResultActions() {
    var shareBtn = el('shareBtn');
    if (shareBtn) {
      shareBtn.addEventListener('click', function () {
        E.play('click');
        ns.Results.share();
      });
    }

    var downloadBtn = el('downloadBtn');
    if (downloadBtn) {
      downloadBtn.addEventListener('click', function () {
        E.play('click');
        ns.Results.download();
      });
    }

    var copyBtn = el('copyBtn');
    if (copyBtn) {
      copyBtn.addEventListener('click', function () {
        E.play('click');
        ns.Results.copy();
      });
    }

    var modalCopyBtn = el('modalCopyBtn');
    if (modalCopyBtn) {
      modalCopyBtn.addEventListener('click', function () {
        E.play('click');
        ns.Results.copy();
      });
    }

    var modalDownloadBtn = el('modalDownloadBtn');
    if (modalDownloadBtn) {
      modalDownloadBtn.addEventListener('click', function () {
        E.play('click');
        ns.Results.download();
      });
    }

    var modalNativeShareBtn = el('modalNativeShareBtn');
    if (modalNativeShareBtn) {
      modalNativeShareBtn.addEventListener('click', function () {
        E.play('click');
        if (navigator.share) {
          closeModal('shareModal');
          ns.Results.share();
        } else {
          E.toast('Native sharing is not supported here. Copy or download instead.');
        }
      });
    }
  }

  /* ----------------------------- History UI ----------------------------- */

  function renderHistory() {
    var list = el('historyList');
    if (!list) return;

    var history = S.getHistory();
    list.innerHTML = '';

    if (!history.length) {
      var empty = document.createElement('div');
      empty.className = 'history-empty';

      var glyph = document.createElement('div');
      glyph.className = 'history-empty-glyph';
      glyph.setAttribute('aria-hidden', 'true');
      glyph.textContent = '🗃️';

      var title = document.createElement('p');
      title.className = 'history-empty-title';
      title.textContent = 'No tests on record.';

      var text = document.createElement('p');
      text.className = 'history-empty-text';
      text.textContent = 'Your brain remains an unexplored mystery. Terrifying.';

      var cta = document.createElement('button');
      cta.type = 'button';
      cta.className = 'btn primary';
      cta.textContent = 'TEST MY BRAIN';
      cta.addEventListener('click', function () {
        E.play('start');
        ns.Quiz.start();
      });

      empty.appendChild(glyph);
      empty.appendChild(title);
      empty.appendChild(text);
      empty.appendChild(cta);
      list.appendChild(empty);
      return;
    }

    history.forEach(function (entry) {
      var item = document.createElement('article');
      item.className = 'history-item';

      var glyph = document.createElement('div');
      glyph.className = 'history-glyph';
      glyph.setAttribute('aria-hidden', 'true');
      glyph.textContent = entry.glyph;

      var body = document.createElement('div');
      body.className = 'history-body';

      var title = document.createElement('h3');
      title.className = 'history-title';
      title.textContent = entry.title;

      var meta = document.createElement('p');
      meta.className = 'history-meta';

      var date = new Date(entry.date);
      var dateText = isNaN(date.getTime()) ? 'Unknown date' : date.toLocaleString();

      var dateSpan = document.createElement('span');
      dateSpan.textContent = dateText;

      var statusSpan = document.createElement('span');
      statusSpan.className = 'history-status';
      statusSpan.textContent = entry.status;

      meta.appendChild(dateSpan);
      meta.appendChild(statusSpan);

      var scores = document.createElement('p');
      scores.className = 'history-scores';
      scores.textContent = 'INTEL ' + entry.intelligence + '% · OVERTHINK ' + entry.overthinking + '% · SENSE ' + entry.commonSense + '%';

      body.appendChild(title);
      body.appendChild(meta);
      body.appendChild(scores);

      item.appendChild(glyph);
      item.appendChild(body);
      list.appendChild(item);
    });
  }

  /* -------------------------------- Modals ------------------------------ */

  function openModal(id) {
    var modal = el(id);
    if (!modal) return;

    lastFocused = document.activeElement;
    modal.hidden = false;
    document.body.classList.add('modal-open');

    window.requestAnimationFrame(function () {
      modal.classList.add('open');
    });

    var focusTarget = modal.querySelector('[data-autofocus]') || modal.querySelector('button');
    if (focusTarget) {
      window.setTimeout(function () {
        try { focusTarget.focus({ preventScroll: true }); } catch (err) { /* noop */ }
      }, 60);
    }
  }

  function closeModal(id) {
    var modal = el(id);
    if (!modal) return;

    modal.classList.remove('open');
    modal.hidden = true;

    if (!document.querySelector('.modal.open')) {
      document.body.classList.remove('modal-open');
    }

    if (lastFocused && typeof lastFocused.focus === 'function' && document.contains(lastFocused)) {
      try { lastFocused.focus({ preventScroll: true }); } catch (err) { /* noop */ }
    }
  }

  function closeTopModal() {
    var open = document.querySelectorAll('.modal.open');
    if (open.length) {
      closeModal(open[open.length - 1].id);
    }
  }

  function wireModals() {
    var closers = document.querySelectorAll('[data-close-modal]');
    for (var i = 0; i < closers.length; i++) {
      closers[i].addEventListener('click', function (event) {
        var modal = event.currentTarget.closest('.modal');
        if (modal) closeModal(modal.id);
      });
    }

    var confirmResetBtn = el('confirmResetBtn');
    if (confirmResetBtn) {
      confirmResetBtn.addEventListener('click', function () {
        S.clearAll();
        updateSoundUI();
        renderHistory();
        closeModal('confirmModal');
        E.play('success');
        E.toast('System reset. Your brain is exactly the same. Sorry.');
        showScreen('screen-hero');
      });
    }

    var errorRetryBtn = el('errorRetryBtn');
    if (errorRetryBtn) {
      errorRetryBtn.addEventListener('click', function () {
        closeModal('errorModal');
        E.toast('Retry failed successfully.');
      });
    }

    var errorIgnoreBtn = el('errorIgnoreBtn');
    if (errorIgnoreBtn) {
      errorIgnoreBtn.addEventListener('click', function () {
        closeModal('errorModal');
        E.toast('Error ignored. Mature.');
      });
    }
  }

  function trapFocus(event, modal) {
    var focusable = modal.querySelectorAll('button, [href], textarea, input, select, [tabindex]:not([tabindex="-1"])');
    var visible = [];
    for (var i = 0; i < focusable.length; i++) {
      if (focusable[i].offsetParent !== null || focusable[i] === document.activeElement) {
        visible.push(focusable[i]);
      }
    }
    if (!visible.length) return;

    var first = visible[0];
    var last = visible[visible.length - 1];

    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }

  /* ------------------------------ Easter egg ---------------------------- */

  function wireEasterEgg() {
    var brand = el('brandLogo');
    if (!brand) return;

    brand.addEventListener('click', function () {
      brandClicks += 1;
      E.play('hover');

      brand.classList.remove('poked');
      void brand.offsetWidth;
      brand.classList.add('poked');

      window.clearTimeout(brandTimer);
      brandTimer = window.setTimeout(function () {
        brandClicks = 0;
      }, 4000);

      if (brandClicks >= 5) {
        brandClicks = 0;
        E.play('success');
        openModal('secretModal');
      }
    });
  }

  /* ------------------------------- Keyboard ----------------------------- */

  function wireKeyboardHelp() {
    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape') {
        var open = document.querySelector('.modal.open');
        if (open) {
          event.preventDefault();
          closeTopModal();
        }
        return;
      }

      if (event.key === 'Tab') {
        var modal = document.querySelector('.modal.open');
        if (modal) trapFocus(event, modal);
      }
    });
  }

  /* ---------------------------- Hero terminal --------------------------- */

  function startHeroTerminal() {
    var body = el('heroTerminalBody');
    if (!body || terminalRunning) return;
    terminalRunning = true;

    if (E.prefersReducedMotion()) {
      HERO_TERMINAL_LINES.forEach(function (line) {
        var div = document.createElement('div');
        div.className = 'term-line ' + (line.c || '');
        div.textContent = line.t;
        body.appendChild(div);
      });
      return;
    }

    function sleep(ms) {
      return new Promise(function (resolve) { window.setTimeout(resolve, ms); });
    }

    function cycle() {
      var hero = el('screen-hero');
      if (hero && hero.classList.contains('active')) {
        body.innerHTML = '';
        var chain = Promise.resolve();

        HERO_TERMINAL_LINES.forEach(function (line) {
          chain = chain
            .then(function () {
              return E.typeLine(body, line.t, {
                className: 'term-line ' + (line.c || ''),
                speed: 26,
                sound: false
              });
            })
            .then(function () {
              return sleep(380);
            });
        });

        chain.then(function () {
          return sleep(3400);
        }).then(cycle);
      } else {
        sleep(1800).then(cycle);
      }
    }

    cycle();
  }

  function startStatusChatter() {
    if (statusTimer) window.clearInterval(statusTimer);

    var messages = STATUS_MESSAGES.slice();
    statusTimer = window.setInterval(function () {
      var hero = el('screen-hero');
      if (!hero || !hero.classList.contains('active')) return;

      var status = el('sysStatus');
      if (status) status.textContent = E.pick(messages);

      var cpu = el('statCpu');
      if (cpu) cpu.textContent = E.randInt(85, 99) + '%';

      var sense = el('statSense');
      if (sense) sense.textContent = E.pick(['SEARCHING…', 'NOT FOUND', 'OFFLINE', '3% LOADED']);

      var hope = el('statHope');
      if (hope) hope.textContent = E.pick(['LOW', 'VERY LOW', 'MISPLACED', 'OPTIMISTIC?']);

      var thoughts = el('statThoughts');
      if (thoughts) thoughts.textContent = E.randInt(38, 74) + ' OPEN';
    }, 3600);
  }

  /* --------------------------------- Init -------------------------------- */

  ns.App = {
    init: init,
    showScreen: showScreen,
    openModal: openModal,
    closeModal: closeModal,
    renderHistory: renderHistory
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})(window.BrainExe = window.BrainExe || {});
