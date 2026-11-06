/*
 * Brain.exe — result generation, fake analysis, and sharing
 * Scores are derived from answer weights + a little chaos. The result
 * catalogue is deliberately absurd. None of this is real science.
 */
(function (ns) {
  'use strict';

  var E = ns.Effects;
  var S = ns.Storage;

  /* ------------------------------ Catalogue ----------------------------- */

  var RESULTS = [
    {
      id: 'overthinker',
      title: 'Certified Overthinker',
      status: 'CRITICAL OVERLOAD',
      level: 'critical',
      glyph: '🌀',
      color: '#b06bff',
      desc: [
        'Your brain has 47 tabs open, and the music is coming from one you cannot find.',
        'You have already read this description four times and found a typo that is not there.',
        'At any given moment you are having three conversations: one real, two imaginary.'
      ],
      diag: [
        'Your brain has 47 tabs open, and you do not know where the music is coming from.',
        'Patient reports "just thinking" — investigation reveals 3,000 simultaneous thoughts.',
        'Recommended treatment: one (1) decisive action. Side effects may include peace.'
      ],
      warn: [
        'WARNING: Prolonged overthinking may cause you to think about overthinking.',
        'WARNING: This diagnosis will be re-analyzed 12 times before you share it.'
      ],
      weight: function (s) { return 0.4 + s.overthinking * 1.1; }
    },
    {
      id: 'potato',
      title: 'Potato Brain',
      status: 'MASHED',
      level: 'warning',
      glyph: '🥔',
      color: '#ffcf4d',
      desc: [
        'Your brain is technically online, but only to update its status.',
        'You have the raw processing power of a toaster that is also a little tired.',
        'Somewhere in there is a brilliant mind. It is currently on a snack break.'
      ],
      diag: [
        'Patient attempted to think and produced a small, warm static noise.',
        'Brain activity detected. It was mostly the word "potato" on repeat.',
        'Test results show three brain cells. Two are arguing. One is asleep.'
      ],
      warn: [
        'WARNING: Do not operate heavy machinery. Or light machinery. Or opinions.',
        'WARNING: Potato brain may experience sudden cravings for fries during deep thought.'
      ],
      weight: function (s) { return 0.4 + (100 - s.intelligence) * 1.25; }
    },
    {
      id: 'daydreamer',
      title: 'Professional Daydreamer',
      status: 'BUFFERING REALITY',
      level: 'unstable',
      glyph: '☁️',
      color: '#3cf0ff',
      desc: [
        'You are physically present. Emotionally, you are in a montage.',
        'Your brain is playing a better version of this day somewhere else.',
        'You have been nodding along for ten minutes and heard absolutely nothing.'
      ],
      diag: [
        'Patient is buffering. Please wait. Patient has been buffering since Tuesday.',
        'Currently imagining this conversation going much better.',
        'Reality is loading. Estimated time remaining: unclear.'
      ],
      warn: [
        'WARNING: May drift off mid-sentence. Please repeat yourself forever.',
        'WARNING: Do not schedule this brain for anything before 11 A.M.'
      ],
      weight: function (s) { return 0.4 + s.overthinking * 0.6 + (100 - s.commonSense) * 0.65; }
    },
    {
      id: 'logic404',
      title: 'Logic Not Found',
      status: 'ERROR 404',
      level: 'critical',
      glyph: '❓',
      color: '#ff5cc8',
      desc: [
        'We searched your brain for logic. The search returned an empty folder.',
        'Your reasoning is creative, confident, and completely untraceable.',
        'If logic were a browser tab, yours would say "This page cannot be reached."'
      ],
      diag: [
        'ERROR: logic.dll is missing. Would you like to restore from a previous life?',
        'A equals B. B equals pickle. Conclusion: sandwich.',
        'Search completed: zero results for "logic". Four thousand for "vibes".'
      ],
      warn: [
        'WARNING: Do not attempt to reason with this brain. It will win by confusing you.',
        'WARNING: Logic not found. Please check under the couch.'
      ],
      weight: function (s) { return 0.4 + (100 - s.intelligence) * 0.95 + s.overthinking * 0.25; }
    },
    {
      id: 'loading',
      title: 'Human Loading Screen',
      status: '99% LOADED',
      level: 'unstable',
      glyph: '⏳',
      color: '#3cf0ff',
      desc: [
        'You are not stuck. You are simply at 99% and will remain there.',
        'Your brain is installing an update you did not ask for and cannot cancel.',
        'Please do not turn off your human. Installing common sense: 3%.'
      ],
      diag: [
        'Patient is 99% loaded. The last 1% contains everything important.',
        'Loading personality... loading motivation... loading... please wait.',
        'Your brain is buffering a thought. It has been buffering for 45 minutes.'
      ],
      warn: [
        'WARNING: Do not unplug the human during this update.',
        'WARNING: Progress bar is decorative. It has always been decorative.'
      ],
      weight: function (s) { return 0.4 + (100 - s.intelligence) * 0.7 + (100 - s.commonSense) * 0.5; }
    },
    {
      id: 'questionmark',
      title: 'Walking Question Mark',
      status: 'UNDEFINED',
      level: 'unknown',
      glyph: '⁉️',
      color: '#38ff9c',
      desc: [
        'You are not confused. You are simply deeply, professionally curious about everything.',
        'Your default facial expression is a question mark with eyebrows.',
        'You ask questions the universe is not prepared to answer.'
      ],
      diag: [
        'Patient responded to "how are you" with a 20-minute philosophical inquiry.',
        'Diagnosis unclear. Patient asked what "diagnosis" means, then what "means" means.',
        'Brain status: undecided. On everything. Always.'
      ],
      warn: [
        'WARNING: May answer a question with three more questions.',
        'WARNING: Do not ask this brain for directions. You will both get lost.'
      ],
      weight: function (s) { return 30 + Math.abs(s.intelligence - 52) * 0.2 + Math.abs(s.commonSense - 50) * 0.2; }
    },
    {
      id: 'useless',
      title: 'Master of Useless Knowledge',
      status: 'OVERQUALIFIED',
      level: 'stable',
      glyph: '🏆',
      color: '#ffcf4d',
      desc: [
        'You cannot remember where your keys are, but you know the lifespan of a mayfly.',
        'Your brain has storage for penguin facts but not for people\u2019s names.',
        'You are a walking pub quiz with no audience.'
      ],
      diag: [
        'Patient knows the airspeed velocity of an unladen swallow but not their own phone number.',
        'Brain is 90% trivia, 10% keys. Keys: lost.',
        'Recommended treatment: recite a fact nobody asked for. It will help you, not them.'
      ],
      warn: [
        'WARNING: Do not ask this brain a question unless you have twenty minutes.',
        'WARNING: Trivia may be dispensed without warning or invitation.'
      ],
      weight: function (s) { return 0.4 + s.intelligence * 1.1; }
    },
    {
      id: 'sleepmode',
      title: 'Sleep Mode Champion',
      status: 'HIBERNATING',
      level: 'unstable',
      glyph: '😴',
      color: '#7aa2ff',
      desc: [
        'Your brain has three settings: tired, very tired, and "just resting my eyes."',
        'You have mastered the ancient art of being awake but not conscious.',
        'You are one comfortable chair away from a full system shutdown.'
      ],
      diag: [
        'Patient fell asleep during a test designed to be about them.',
        'Brain requested a nap during the diagnosis. Diagnosis: fair.',
        'Energy levels: 2%. Sources: vibes, caffeine, and spite.'
      ],
      warn: [
        'WARNING: Do not place near a lecture, a meeting, or a warm room.',
        'WARNING: This brain may enter sleep mode mid-conversation. Again.'
      ],
      weight: function (s) { return 0.4 + (100 - s.intelligence) * 0.75 + (100 - s.overthinking) * 0.3; }
    },
    {
      id: 'sense404',
      title: '404 Common Sense Not Found',
      status: 'SENSE 404',
      level: 'critical',
      glyph: '🚫',
      color: '#ff4d6d',
      desc: [
        'Common sense was last seen entering a room and never coming back.',
        'You would try to dry yourself with a wet towel and be surprised by the outcome.',
        'Your decision-making runs on vibes, luck, and suspiciously calm confidence.'
      ],
      diag: [
        'ERROR 404: common sense not found. Please reinstall childhood.',
        'Patient tried to pour cereal into a full bowl. The bowl was upside down.',
        'Search for common sense returned: "Did you mean: chaos?"'
      ],
      warn: [
        'WARNING: This brain may attempt to microwave a fork "just to see."',
        'WARNING: Common sense missing. Operating on instinct and snacks.'
      ],
      weight: function (s) { return 0.4 + (100 - s.commonSense) * 1.45; }
    },
    {
      id: 'multitask',
      title: 'Multitasking Disaster',
      status: 'OVERHEATING',
      level: 'critical',
      glyph: '🧨',
      color: '#ff5cc8',
      desc: [
        'You are doing five things at once. None of them are the thing you should be doing.',
        'Your brain has twelve tabs open, a song stuck in it, and no idea why.',
        'You started reading this, checked your phone, and forgot you were reading this.'
      ],
      diag: [
        'Patient attempted five tasks. Completed zero. Started eleven. Excellent effort.',
        'Everything is happening at once. Nothing is happening correctly.',
        'Brain is running 47 processes. 46 of them are the same worry.'
      ],
      warn: [
        'WARNING: Do not add a sixth task. We both know you will.',
        'WARNING: Overheating detected. Fan noise may be internal screaming.'
      ],
      weight: function (s) { return 0.4 + s.overthinking * 0.85 + (100 - s.intelligence) * 0.7; }
    },
    {
      id: 'quantum',
      title: 'Quantum Confusion',
      status: 'SUPERPOSITION',
      level: 'unknown',
      glyph: '⚛️',
      color: '#b06bff',
      desc: [
        'Your brain is simultaneously brilliant and empty until someone asks you a question.',
        'You contain multitudes. Most of them are confused.',
        'You are both the smartest person in the room and the reason everyone is confused.'
      ],
      diag: [
        'Patient is in a superposition of smart and confused. Observation makes it worse.',
        'Brain exists in all possible states at once. None of them are "focused."',
        'Result is both accurate and meaningless. This is fine.'
      ],
      warn: [
        'WARNING: Do not observe this brain directly. It will change.',
        'WARNING: Schrödinger\u2019s opinion. Both good and bad until shared.'
      ],
      weight: function (s) { return 40 + Math.abs(s.intelligence - 50) * 0.2 + Math.abs(s.overthinking - 60) * 0.15; }
    },
    {
      id: 'genius',
      title: 'Certified Genius (Probably Fake)',
      status: 'SUSPICIOUSLY STABLE',
      level: 'stable',
      glyph: '🎓',
      color: '#38ff9c',
      desc: [
        'You answered so well that the system assumes you cheated.',
        'Your brain is running at full capacity. Or the test is broken. One of those.',
        'A rare specimen. Suspiciously articulate. Possibly a paid actor.'
      ],
      diag: [
        'Patient displayed unprecedented competence. Investigating for fraud.',
        'Scores are unusually high. Please verify that the brain is yours.',
        'Congratulations! Your brain is functioning. This has never happened before.'
      ],
      warn: [
        'WARNING: Genius unverified. May actually be good guessing.',
        'WARNING: Do not let this result go to your head. It is already crowded in there.'
      ],
      weight: function (s) { return 0.4 + s.intelligence * 0.8 + s.commonSense * 0.7; }
    }
  ];

  var lastResultId = null;
  var current = null;

  /* ------------------------------- Scoring ------------------------------ */

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  function computeScores(answers) {
    var sum = { i: 0, o: 0, c: 0 };
    var valid = 0;

    (answers || []).forEach(function (answer) {
      if (!answer || !answer.s) return;
      var s = answer.s;
      sum.i += Number(s.i) || 0;
      sum.o += Number(s.o) || 0;
      sum.c += Number(s.c) || 0;
      valid += 1;
    });

    var n = Math.max(1, valid);
    var noise = function () { return E.rand(-6, 6); };

    return {
      intelligence: Math.round(clamp(50 + (sum.i / n) * 2.3 + noise(), 5, 99)),
      overthinking: Math.round(clamp(50 + (sum.o / n) * 2.0 + noise(), 5, 99)),
      commonSense: Math.round(clamp(50 + (sum.c / n) * 2.3 + noise(), 5, 99))
    };
  }

  function generate(scores) {
    var safe = scores && typeof scores === 'object' ? scores : { intelligence: 50, overthinking: 50, commonSense: 50 };
    var weights = RESULTS.map(function (result) {
      var w = 1;
      try { w = Math.max(0.5, result.weight(safe)); } catch (err) { w = 1; }
      if (result.id === lastResultId) w *= 0.35;
      return w * E.rand(0.65, 1.35);
    });

    var total = weights.reduce(function (a, b) { return a + b; }, 0);
    var roll = Math.random() * total;
    var chosen = RESULTS[0];
    for (var i = 0; i < RESULTS.length; i++) {
      roll -= weights[i];
      if (roll <= 0) { chosen = RESULTS[i]; break; }
    }

    lastResultId = chosen.id;

    return {
      id: chosen.id,
      title: chosen.title,
      status: chosen.status,
      level: chosen.level,
      glyph: chosen.glyph,
      color: chosen.color,
      desc: E.pick(chosen.desc),
      diagnosis: E.pick(chosen.diag),
      warning: E.pick(chosen.warn),
      intelligence: clamp(Math.round(safe.intelligence), 0, 99),
      overthinking: clamp(Math.round(safe.overthinking), 0, 99),
      commonSense: clamp(Math.round(safe.commonSense), 0, 99),
      date: new Date().toISOString()
    };
  }

  /* ------------------------------ Analysis ------------------------------ */

  var ANALYSIS_LINES = [
    { t: '> initializing neural scanner...', c: 'dim', p: 6 },
    { t: 'Analyzing neural activity...', c: '', p: 14 },
    { t: 'Measuring common sense...', c: '', p: 24 },
    { t: 'Detecting brain cells...', c: '', p: 33 },
    { t: '  2 brain cells found. They are arguing.', c: 'warn', p: 39 },
    { t: 'Calculating overthinking level...', c: '', p: 50 },
    { t: '  overthinking.exe is using 97% of available CPU.', c: 'warn', p: 56 },
    { t: 'Searching for logic...', c: '', p: 64 },
    { t: 'ERROR: Logic not found.', c: 'error', p: 72 },
    { t: 'Retrying with vibes...', c: 'dim', p: 80 },
    { t: 'Brain.exe has stopped responding.', c: 'error', p: 87 },
    { t: '...', c: 'dim', p: 91 },
    { t: 'Brain.exe has stopped responding.', c: 'error', p: 95 },
    { t: '> diagnosis generated. Somehow.', c: 'ok', p: 100 }
  ];

  function setAnalysisProgress(percent) {
    var bar = document.getElementById('analysisProgress');
    var meter = document.getElementById('analysisProgressBar');
    var label = document.getElementById('analysisPercent');
    var value = Math.round(clamp(percent, 0, 100));
    if (bar) bar.style.width = value + '%';
    if (meter) meter.setAttribute('aria-valuenow', String(value));
    if (label) label.textContent = value + '%';
  }

  function runAnalysis(scores, onComplete) {
    var log = document.getElementById('analysisLog');
    var hint = document.getElementById('analysisHint');
    if (!log) { if (onComplete) onComplete(); return; }

    log.innerHTML = '';
    setAnalysisProgress(0);

    var result = generate(scores);
    var errorShown = false;
    var reduced = E.prefersReducedMotion();

    function maybeShowError(index) {
      if (errorShown) return;
      if (index === 8 && Math.random() < 0.65) {
        errorShown = true;
        E.showFakeError();
      }
    }

    function step(index) {
      if (index >= ANALYSIS_LINES.length) {
        if (hint) hint.textContent = 'Diagnosis complete. Please remain calm.';
        E.sounds.success();
        S.addHistory(result);
        current = result;
        window.setTimeout(function () {
          if (onComplete) onComplete(result);
        }, reduced ? 120 : 650);
        return;
      }

      var line = ANALYSIS_LINES[index];
      E.typeLine(log, line.t, {
        className: 'term-line ' + (line.c || ''),
        speed: 11,
        sound: true
      }).then(function () {
        log.scrollTop = log.scrollHeight;
        setAnalysisProgress(line.p);
        maybeShowError(index);
        E.wait(reduced ? 0 : E.randInt(70, 150)).then(function () {
          step(index + 1);
        });
      });
    }

    E.wait(reduced ? 0 : 320).then(function () { step(0); });
  }

  /* ------------------------------- Rendering ---------------------------- */

  function buildStat(label, value, colorClass) {
    var stat = document.createElement('div');
    stat.className = 'stat ' + colorClass;

    var head = document.createElement('div');
    head.className = 'stat-head';

    var labelEl = document.createElement('span');
    labelEl.className = 'stat-label';
    labelEl.textContent = label;

    var valueEl = document.createElement('span');
    valueEl.className = 'stat-value';
    valueEl.textContent = value + '%';

    head.appendChild(labelEl);
    head.appendChild(valueEl);

    var bar = document.createElement('div');
    bar.className = 'stat-bar';
    bar.setAttribute('role', 'progressbar');
    bar.setAttribute('aria-valuemin', '0');
    bar.setAttribute('aria-valuemax', '99');
    bar.setAttribute('aria-valuenow', String(value));
    bar.setAttribute('aria-label', label);

    var fill = document.createElement('div');
    fill.className = 'stat-fill';
    fill.style.width = '0%';
    bar.appendChild(fill);

    stat.appendChild(head);
    stat.appendChild(bar);

    // Animate after the element is in the document.
    window.setTimeout(function () {
      fill.style.width = value + '%';
    }, 120);

    return stat;
  }

  function render(result) {
    current = result;
    var card = document.getElementById('resultCard');
    if (!card) return;

    card.style.setProperty('--accent', result.color);

    var glyph = document.getElementById('resultGlyph');
    if (glyph) glyph.textContent = result.glyph;

    var status = document.getElementById('resultStatus');
    if (status) {
      status.textContent = 'BRAIN STATUS: ' + result.status;
      status.setAttribute('data-level', result.level || 'unknown');
    }

    var idEl = document.getElementById('resultId');
    if (idEl) {
      idEl.textContent = 'ID: #' + String(Math.floor(Math.random() * 900000) + 100000);
    }

    var title = document.getElementById('resultTitle');
    if (title) {
      title.textContent = result.title;
      title.setAttribute('data-text', result.title);
    }

    var desc = document.getElementById('resultDesc');
    if (desc) desc.textContent = result.desc;

    var diag = document.getElementById('resultDiagnosis');
    if (diag) diag.textContent = '"' + result.diagnosis + '"';

    var warning = document.getElementById('resultWarning');
    if (warning) warning.textContent = result.warning;

    var stats = document.getElementById('resultStats');
    if (stats) {
      stats.innerHTML = '';
      stats.appendChild(buildStat('INTELLIGENCE', result.intelligence, 'stat-intel'));
      stats.appendChild(buildStat('OVERTHINKING', result.overthinking, 'stat-over'));
      stats.appendChild(buildStat('COMMON SENSE', result.commonSense, 'stat-sense'));
    }

    var time = document.getElementById('resultTime');
    if (time) {
      var d = new Date(result.date);
      time.textContent = isNaN(d.getTime()) ? '' : d.toLocaleString();
    }
  }

  /* -------------------------------- Sharing ----------------------------- */

  function buildShareText() {
    if (!current) return '';
    var lines = [
      '🧠 BRAIN.EXE HAS STOPPED WORKING 🧠',
      '',
      'Result: ' + current.title,
      'Brain status: ' + current.status,
      'Intelligence: ' + current.intelligence + '%',
      'Overthinking: ' + current.overthinking + '%',
      'Common sense: ' + current.commonSense + '%',
      '',
      'Diagnosis: "' + current.diagnosis + '"',
      '',
      current.desc,
      ''
    ];

    if (window.location.protocol === 'http:' || window.location.protocol === 'https:') {
      lines.push('Take the test: ' + window.location.href);
    } else {
      lines.push('Take the test: Brain.exe Has Stopped Working');
    }
    lines.push('100% scientifically inaccurate.');
    return lines.join('\n');
  }

  function wrapLines(ctx, text, maxWidth) {
    var words = String(text).split(/\s+/);
    var lines = [];
    var line = '';
    for (var i = 0; i < words.length; i++) {
      var test = line ? line + ' ' + words[i] : words[i];
      if (ctx.measureText(test).width > maxWidth && line) {
        lines.push(line);
        line = words[i];
      } else {
        line = test;
      }
    }
    if (line) lines.push(line);
    return lines;
  }

  function roundRect(ctx, x, y, w, h, r) {
    var radius = Math.min(r, Math.abs(w) / 2, Math.abs(h) / 2);
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + w - radius, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + radius);
    ctx.lineTo(x + w, y + h - radius);
    ctx.quadraticCurveTo(x + w, y + h, x + w - radius, y + h);
    ctx.lineTo(x + radius, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
  }

  function buildShareCanvas(result) {
    var size = 1080;
    var canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    var ctx = canvas.getContext('2d');
    if (!ctx) return canvas;

    var MONO = 'Consolas, "Courier New", monospace';
    var SANS = '"Segoe UI", Arial, sans-serif';
    var EMOJI = '"Segoe UI Emoji", "Apple Color Emoji", Arial, sans-serif';

    // Background
    var bg = ctx.createLinearGradient(0, 0, size, size);
    bg.addColorStop(0, '#070a14');
    bg.addColorStop(0.55, '#0a0718');
    bg.addColorStop(1, '#120a24');
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, size, size);

    // Grid
    ctx.save();
    ctx.strokeStyle = 'rgba(56, 255, 156, 0.06)';
    ctx.lineWidth = 1;
    for (var gx = 0; gx < size; gx += 54) {
      ctx.beginPath();
      ctx.moveTo(gx, 0);
      ctx.lineTo(gx, size);
      ctx.stroke();
    }
    for (var gy = 0; gy < size; gy += 54) {
      ctx.beginPath();
      ctx.moveTo(0, gy);
      ctx.lineTo(size, gy);
      ctx.stroke();
    }
    ctx.restore();

    // Accent glow behind the glyph
    var glow = ctx.createRadialGradient(540, 250, 20, 540, 250, 260);
    glow.addColorStop(0, hexToRgba(result.color, 0.35));
    glow.addColorStop(1, hexToRgba(result.color, 0));
    ctx.fillStyle = glow;
    ctx.fillRect(240, -20, 600, 560);

    // Header
    ctx.textAlign = 'left';
    ctx.fillStyle = '#38ff9c';
    ctx.font = '700 34px ' + MONO;
    ctx.fillText('BRAIN.EXE', 84, 82);

    ctx.textAlign = 'right';
    ctx.fillStyle = 'rgba(215, 247, 230, 0.5)';
    ctx.font = '500 22px ' + MONO;
    ctx.fillText('HAS STOPPED WORKING', 996, 82);

    ctx.textAlign = 'left';
    ctx.strokeStyle = 'rgba(56, 255, 156, 0.25)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(84, 112);
    ctx.lineTo(996, 112);
    ctx.stroke();

    // Glyph medal
    ctx.save();
    ctx.beginPath();
    ctx.arc(540, 252, 108, 0, Math.PI * 2);
    ctx.fillStyle = hexToRgba(result.color, 0.1);
    ctx.fill();
    ctx.strokeStyle = hexToRgba(result.color, 0.7);
    ctx.lineWidth = 4;
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(540, 252, 138, 0, Math.PI * 2);
    ctx.strokeStyle = hexToRgba(result.color, 0.22);
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.font = '150px ' + EMOJI;
    ctx.fillStyle = '#ffffff';
    ctx.fillText(result.glyph, 540, 262);
    ctx.restore();

    // Status
    ctx.textAlign = 'center';
    ctx.textBaseline = 'alphabetic';
    ctx.fillStyle = result.color;
    ctx.font = '700 26px ' + MONO;
    ctx.fillText('BRAIN STATUS: ' + result.status, 540, 432);

    // Kicker + title
    ctx.fillStyle = 'rgba(215, 247, 230, 0.45)';
    ctx.font = '600 21px ' + MONO;
    ctx.fillText('YOUR BRAIN HAS BEEN CLASSIFIED AS', 540, 488);

    var titleSize = 64;
    ctx.font = '800 ' + titleSize + 'px ' + SANS;
    while (ctx.measureText(result.title).width > 900 && titleSize > 30) {
      titleSize -= 3;
      ctx.font = '800 ' + titleSize + 'px ' + SANS;
    }
    ctx.save();
    ctx.shadowColor = hexToRgba(result.color, 0.75);
    ctx.shadowBlur = 28;
    ctx.fillStyle = '#eafff6';
    ctx.fillText(result.title, 540, 562);
    ctx.restore();

    // Stats
    var statRows = [
      { label: 'INTELLIGENCE', value: result.intelligence, color: '#38ff9c' },
      { label: 'OVERTHINKING', value: result.overthinking, color: '#b06bff' },
      { label: 'COMMON SENSE', value: result.commonSense, color: '#3cf0ff' }
    ];

    var startY = 626;
    var rowHeight = 74;
    statRows.forEach(function (row, index) {
      var y = startY + index * rowHeight;

      ctx.textAlign = 'left';
      ctx.fillStyle = 'rgba(215, 247, 230, 0.82)';
      ctx.font = '600 24px ' + MONO;
      ctx.fillText(row.label, 90, y);

      ctx.textAlign = 'right';
      ctx.fillStyle = row.color;
      ctx.font = '700 24px ' + MONO;
      ctx.fillText(row.value + '%', 990, y);

      ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
      roundRect(ctx, 90, y + 14, 900, 16, 8);
      ctx.fill();

      var fillWidth = Math.max(4, (900 * clamp(row.value, 0, 99)) / 100);
      var grad = ctx.createLinearGradient(90, 0, 90 + fillWidth, 0);
      grad.addColorStop(0, hexToRgba(row.color, 0.55));
      grad.addColorStop(1, row.color);
      ctx.fillStyle = grad;
      roundRect(ctx, 90, y + 14, fillWidth, 16, 8);
      ctx.fill();
    });

    // Diagnosis
    var diagY = 912;
    ctx.textAlign = 'left';
    ctx.fillStyle = 'rgba(215, 247, 230, 0.45)';
    ctx.font = '600 19px ' + MONO;
    ctx.fillText('DIAGNOSIS:', 90, diagY);

    ctx.fillStyle = '#c9fbe0';
    ctx.font = 'italic 30px ' + SANS;
    var diagLines = wrapLines(ctx, '"' + result.diagnosis + '"', 900).slice(0, 2);
    diagLines.forEach(function (line, index) {
      ctx.fillText(line, 90, diagY + 40 + index * 40);
    });

    // Footer
    ctx.strokeStyle = 'rgba(60, 240, 255, 0.18)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(90, 1012);
    ctx.lineTo(990, 1012);
    ctx.stroke();

    ctx.textAlign = 'left';
    ctx.fillStyle = '#38ff9c';
    ctx.font = '700 22px ' + MONO;
    ctx.fillText('BRAIN.EXE', 90, 1050);

    ctx.textAlign = 'right';
    ctx.fillStyle = 'rgba(215, 247, 230, 0.45)';
    ctx.font = '500 20px ' + MONO;
    ctx.fillText('100% SCIENTIFICALLY INACCURATE', 990, 1050);

    return canvas;
  }

  function hexToRgba(hex, alpha) {
    var clean = String(hex || '#ffffff').replace('#', '');
    if (clean.length === 3) {
      clean = clean.charAt(0) + clean.charAt(0) + clean.charAt(1) + clean.charAt(1) + clean.charAt(2) + clean.charAt(2);
    }
    var num = parseInt(clean, 16);
    if (isNaN(num)) return 'rgba(255,255,255,' + alpha + ')';
    var r = (num >> 16) & 255;
    var g = (num >> 8) & 255;
    var b = num & 255;
    return 'rgba(' + r + ',' + g + ',' + b + ',' + alpha + ')';
  }

  function copyText(text) {
    if (navigator.clipboard && navigator.clipboard.writeText && window.isSecureContext) {
      return navigator.clipboard.writeText(text);
    }
    return new Promise(function (resolve, reject) {
      try {
        var area = document.createElement('textarea');
        area.value = text;
        area.setAttribute('readonly', '');
        area.style.position = 'fixed';
        area.style.top = '-1000px';
        area.style.opacity = '0';
        document.body.appendChild(area);
        area.select();
        area.setSelectionRange(0, area.value.length);
        var ok = document.execCommand('copy');
        document.body.removeChild(area);
        if (ok) resolve();
        else reject(new Error('Copy command was rejected'));
      } catch (err) {
        reject(err);
      }
    });
  }

  function openShareModal() {
    if (!current) return;
    var img = document.getElementById('sharePreviewImg');
    var area = document.getElementById('shareText');
    var hint = document.getElementById('shareHint');

    if (area) area.value = buildShareText();

    if (img) {
      try {
        img.src = buildShareCanvas(current).toDataURL('image/png');
      } catch (err) {
        img.removeAttribute('src');
      }
    }

    if (hint) {
      hint.textContent = navigator.share
        ? 'Native sharing is available — or copy the text and download the image below.'
        : 'Your browser does not support native sharing. Copy the text or download the image instead.';
    }

    if (ns.App && typeof ns.App.openModal === 'function') ns.App.openModal('shareModal');
  }

  function dataUrlToBlob(dataUrl) {
    var parts = String(dataUrl).split(',');
    if (parts.length < 2) throw new Error('Invalid data URL');
    var mimeMatch = parts[0].match(/:(.*?);/);
    var mime = mimeMatch ? mimeMatch[1] : 'image/png';
    var binary = window.atob(parts[1]);
    var bytes = new Uint8Array(binary.length);
    for (var i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    return new Blob([bytes], { type: mime });
  }

  function openShareOrCopy() {
    if (!current) return;

    if (!navigator.share) {
      openShareModal();
      return;
    }

    // Build the image synchronously so navigator.share() stays inside the
    // user gesture (required by Safari on iOS).
    var shareData = {
      title: 'Brain.exe Has Stopped Working',
      text: buildShareText()
    };

    try {
      var blob = dataUrlToBlob(buildShareCanvas(current).toDataURL('image/png'));
      if (window.File && navigator.canShare) {
        var file = new File([blob], 'brain-exe-result.png', { type: 'image/png' });
        if (navigator.canShare({ files: [file] })) {
          shareData.files = [file];
        }
      }
    } catch (err) {
      /* image sharing unavailable; text-only share still works */
    }

    try {
      navigator.share(shareData).catch(function (shareErr) {
        if (shareErr && shareErr.name === 'AbortError') return;
        openShareModal();
      });
    } catch (err) {
      openShareModal();
    }
  }

  function downloadImage() {
    if (!current) return;
    var canvas = buildShareCanvas(current);

    function triggerDownload(url, revoke) {
      var link = document.createElement('a');
      link.href = url;
      link.download = 'brain-exe-result.png';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      if (revoke) window.setTimeout(function () { URL.revokeObjectURL(url); }, 4000);
      E.toast('Result image downloaded. Share responsibly.');
      E.play('success');
    }

    if (canvas.toBlob) {
      canvas.toBlob(function (blob) {
        if (!blob) {
          triggerDownload(canvas.toDataURL('image/png'), false);
          return;
        }
        triggerDownload(URL.createObjectURL(blob), true);
      }, 'image/png');
    } else {
      triggerDownload(canvas.toDataURL('image/png'), false);
    }
  }

  function copyResult() {
    if (!current) return;
    copyText(buildShareText()).then(function () {
      E.toast('Result copied. Go ruin someone\u2019s day.');
      E.play('success');
    }).catch(function () {
      openShareModal();
      E.toast('Clipboard blocked. Select the text manually.');
    });
  }

  ns.Results = {
    computeScores: computeScores,
    generate: generate,
    runAnalysis: runAnalysis,
    render: render,
    buildShareText: buildShareText,
    buildShareCanvas: buildShareCanvas,
    openShareModal: openShareModal,
    share: openShareOrCopy,
    download: downloadImage,
    copy: copyResult,
    getCurrent: function () { return current; },
    catalogue: RESULTS
  };
})(window.BrainExe = window.BrainExe || {});
