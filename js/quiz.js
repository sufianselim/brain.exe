/*
 * Brain.exe — quiz engine
 * Handles question selection, answer state, navigation, progress,
 * transitions, and keyboard shortcuts.
 */
(function (ns) {
  'use strict';

  var QUESTIONS_PER_TEST = 12;

  var questions = [];
  var responses = [];
  var index = 0;
  var initialized = false;

  function el(id) {
    return document.getElementById(id);
  }

  function padded(n) {
    return n < 10 ? '0' + n : String(n);
  }

  function isQuizActive() {
    var screen = el('screen-quiz');
    var modalOpen = document.querySelector('.modal.open');
    return !!(screen && screen.classList.contains('active') && !modalOpen);
  }

  function start() {
    var recent = ns.Storage.getRecentIds();
    questions = ns.Questions.select(QUESTIONS_PER_TEST, recent);
    responses = questions.map(function () { return null; });
    index = 0;

    ns.Storage.setRecentIds(questions.map(function (q) { return q.id; }));

    if (ns.App && ns.App.showScreen) ns.App.showScreen('screen-quiz');
    renderQuestion();
  }

  function renderQuestion() {
    var question = questions[index];
    if (!question) return;

    var card = el('questionCard');
    var counter = el('qCounter');
    var category = el('qCategory');
    var questionIndex = el('questionIndex');
    var questionText = el('questionText');
    var answersEl = el('answers');
    var feedback = el('feedback');
    var backBtn = el('backBtn');
    var nextBtn = el('nextBtn');
    var progress = el('quizProgress');
    var progressBar = el('quizProgressBar');

    if (counter) counter.textContent = 'QUESTION ' + padded(index + 1) + ' / ' + padded(questions.length);
    if (category) category.textContent = question.cat.toUpperCase();
    if (questionIndex) questionIndex.textContent = 'Q.' + padded(index + 1);
    if (questionText) questionText.textContent = question.q;

    if (answersEl) {
      answersEl.innerHTML = '';
      question.a.forEach(function (option, optionIndex) {
        var button = document.createElement('button');
        button.type = 'button';
        button.className = 'answer';
        button.setAttribute('aria-pressed', 'false');

        var key = document.createElement('span');
        key.className = 'answer-key';
        key.setAttribute('aria-hidden', 'true');
        key.textContent = String(optionIndex + 1);

        var text = document.createElement('span');
        text.className = 'answer-text';
        text.textContent = option.t;

        button.appendChild(key);
        button.appendChild(text);
        button.addEventListener('click', function () {
          selectAnswer(optionIndex);
        });

        answersEl.appendChild(button);
      });
    }

    var selected = responses[index];
    if (selected) {
      highlightAnswer(question.a.indexOf(selected));
      showFeedback(selected.f);
    } else if (feedback) {
      feedback.textContent = '';
      feedback.classList.remove('show');
    }

    var percent = Math.round(((index + 1) / questions.length) * 100);
    if (progress) progress.style.width = percent + '%';
    if (progressBar) progressBar.setAttribute('aria-valuenow', String(percent));

    if (backBtn) backBtn.disabled = index === 0;
    if (nextBtn) {
      nextBtn.disabled = !responses[index];
      nextBtn.textContent = index === questions.length - 1 ? 'FINISH TEST →' : 'NEXT →';
    }

    if (card) {
      card.classList.remove('enter');
      void card.offsetWidth;
      card.classList.add('enter');
      try { card.focus({ preventScroll: true }); } catch (err) { /* older browsers */ }
    }
  }

  function highlightAnswer(optionIndex) {
    var answersEl = el('answers');
    if (!answersEl) return;
    var buttons = answersEl.querySelectorAll('.answer');
    for (var i = 0; i < buttons.length; i++) {
      var isSelected = i === optionIndex;
      buttons[i].classList.toggle('selected', isSelected);
      buttons[i].setAttribute('aria-pressed', isSelected ? 'true' : 'false');
    }
  }

  function showFeedback(text) {
    var feedback = el('feedback');
    if (!feedback) return;
    feedback.textContent = text ? '>> ' + text : '';
    feedback.classList.toggle('show', !!text);
  }

  function selectAnswer(optionIndex) {
    var question = questions[index];
    if (!question || !question.a[optionIndex]) return;

    responses[index] = question.a[optionIndex];
    highlightAnswer(optionIndex);
    showFeedback(question.a[optionIndex].f);

    var nextBtn = el('nextBtn');
    if (nextBtn) nextBtn.disabled = false;
  }

  function goBack() {
    if (index <= 0) return;
    index -= 1;
    ns.Effects.play('back');
    renderQuestion();
  }

  function goNext() {
    if (!responses[index]) return;

    if (index < questions.length - 1) {
      index += 1;
      ns.Effects.play('next');
      renderQuestion();
      return;
    }

    finish();
  }

  function finish() {
    var answers = responses.filter(function (answer) { return !!answer; });
    var scores = ns.Results.computeScores(answers);
    ns.Effects.play('start');

    if (typeof ns.Quiz.onComplete === 'function') {
      ns.Quiz.onComplete(scores, answers);
    }
  }

  function onKeyDown(event) {
    if (!isQuizActive()) return;

    var target = event.target;
    var tag = target && target.tagName ? target.tagName.toLowerCase() : '';
    if (tag === 'input' || tag === 'textarea' || tag === 'select') return;

    var question = questions[index];
    if (!question) return;

    if (/^[1-4]$/.test(event.key)) {
      var optionIndex = parseInt(event.key, 10) - 1;
      if (optionIndex < question.a.length) {
        event.preventDefault();
        selectAnswer(optionIndex);
      }
      return;
    }

    if (event.key === 'ArrowRight') {
      event.preventDefault();
      goNext();
      return;
    }

    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      goBack();
      return;
    }

    if (event.key === 'Enter') {
      // Let the browser activate focused buttons normally.
      if (tag === 'button') return;
      if (!el('feedback') || document.activeElement === el('questionCard')) {
        event.preventDefault();
        goNext();
      }
    }
  }

  function init() {
    if (initialized) return;
    initialized = true;

    var backBtn = el('backBtn');
    var nextBtn = el('nextBtn');

    if (backBtn) {
      backBtn.addEventListener('click', function () {
        ns.Effects.play('click');
        goBack();
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', function () {
        if (!responses[index]) return;
        ns.Effects.play('click');
        goNext();
      });
    }

    document.addEventListener('keydown', onKeyDown);
  }

  ns.Quiz = {
    init: init,
    start: start,
    onComplete: null,
    getCurrentQuestionNumber: function () { return index + 1; }
  };
})(window.BrainExe = window.BrainExe || {});
