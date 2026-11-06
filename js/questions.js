/*
 * Brain.exe — question bank
 * Every answer carries three comedy weights:
 *   i = intelligence, o = overthinking, c = common sense
 * These are for entertainment only. Nobody is measuring anything real here.
 */
(function (ns) {
  'use strict';

  var QUESTIONS = [
    /* ---------------------------- OVERTHINKING --------------------------- */
    {
      id: 'ov1',
      cat: 'Overthinking',
      q: 'You send a text. They reply "K." What happens next?',
      a: [
        { t: 'Reply "ok" and go on with my day like a normal human', f: 'Suspiciously well-adjusted. The system is confused.', s: { i: 6, o: -8, c: 10 } },
        { t: 'Draft a four-paragraph essay about what "K" really means', f: 'That is a lot of words for one letter. Iconic.', s: { i: 2, o: 16, c: -6 } },
        { t: 'Delete the conversation and fake my own disappearance', f: 'A calm, measured response. No notes.', s: { i: -4, o: 14, c: -10 } },
        { t: 'Stare at it until the phone battery dies', f: 'The phone died. The thoughts did not.', s: { i: -2, o: 12, c: -4 } }
      ]
    },
    {
      id: 'ov2',
      cat: 'Overthinking',
      q: 'Someone says "we need to talk." Your brain immediately:',
      a: [
        { t: 'Plans my funeral in high definition', f: 'You are not dying. Probably. But the flowers were lovely.', s: { i: -2, o: 18, c: -8 } },
        { t: 'Assumes it is fine and keeps eating', f: 'Emotionally stable? In this economy?', s: { i: 4, o: -10, c: 12 } },
        { t: 'Compiles a list of everything I have ever done wrong', f: 'Chapter 1: The Sandwich Incident of 2014.', s: { i: 1, o: 15, c: -6 } }
      ]
    },
    {
      id: 'ov3',
      cat: 'Overthinking',
      q: 'At 2 A.M., your brain decides it is the perfect time to:',
      a: [
        { t: 'Replay a thing I said seven years ago', f: 'The director\'s cut, with commentary.', s: { i: 0, o: 17, c: -6 } },
        { t: 'Sleep. Like a functioning organism', f: 'Bold of you to assume that is an option.', s: { i: 5, o: -12, c: 10 } },
        { t: 'Solve a problem that does not exist yet', f: 'Pre-traumatic stress disorder. Innovative.', s: { i: 3, o: 13, c: -4 } }
      ]
    },
    {
      id: 'ov4',
      cat: 'Overthinking',
      q: 'The group chat has been silent for two hours. Obviously:',
      a: [
        { t: 'Everyone secretly hates me', f: 'They are eating dinner. You are not the main character. (You are, though.)', s: { i: -2, o: 16, c: -8 } },
        { t: 'They are just busy living their lives', f: 'Radical. Disturbingly reasonable.', s: { i: 5, o: -10, c: 12 } },
        { t: 'I should send "hey" and then panic about it', f: 'That "hey" has been typing for 45 minutes.', s: { i: 1, o: 14, c: -6 } }
      ]
    },
    {
      id: 'ov5',
      cat: 'Overthinking',
      q: 'You have three tabs open and music playing. Do you know where the music is coming from?',
      a: [
        { t: 'Yes. Obviously. I am in control.', f: 'We both know that is a lie.', s: { i: 6, o: -8, c: 8 } },
        { t: 'No, and I have accepted this as my identity', f: 'The music is coming from inside the house.', s: { i: 0, o: 10, c: -4 } },
        { t: 'I will close tabs until the music stops', f: 'You closed the wrong tab. It got louder.', s: { i: 2, o: 12, c: -2 } }
      ]
    },
    {
      id: 'ov6',
      cat: 'Overthinking',
      q: 'You rehearsed a five-minute phone call. It lasted thirty seconds. How do you feel?',
      a: [
        { t: 'Cheated. I prepared a whole speech.', f: 'The director is furious. The scene was cut.', s: { i: 1, o: 14, c: -4 } },
        { t: 'Relieved it is over', f: 'Emotionally efficient. Rare.', s: { i: 4, o: -6, c: 10 } },
        { t: 'I will replay it tonight to find my mistakes', f: 'There were none. That will not stop you.', s: { i: 2, o: 15, c: -6 } }
      ]
    },

    /* ---------------------------- COMMON SENSE --------------------------- */
    {
      id: 'cs1',
      cat: 'Common Sense',
      q: 'If tomatoes are fruits, is ketchup a smoothie?',
      a: [
        { t: 'Technically yes, emotionally absolutely not', f: 'The correct answer to a cursed question.', s: { i: 6, o: 2, c: 8 } },
        { t: 'Yes, and I drink it with a straw', f: 'The system has flagged this for review.', s: { i: -4, o: 2, c: -14 } },
        { t: 'Ketchup is a condiment. Please stop.', f: 'The voice of reason has entered the chat.', s: { i: 4, o: -6, c: 12 } }
      ]
    },
    {
      id: 'cs2',
      cat: 'Common Sense',
      q: 'If you clean a vacuum cleaner, are you the vacuum cleaner?',
      a: [
        { t: 'No, but I have become something worse', f: 'Existential. The system is concerned.', s: { i: 1, o: 12, c: -6 } },
        { t: 'A vacuum cleaner cleans. I clean it. Simple.', f: 'Logic detected. Rare but welcome.', s: { i: 6, o: -4, c: 10 } },
        { t: 'Yes, and I am now full of dust', f: 'Please seek maintenance.', s: { i: -4, o: 4, c: -12 } }
      ]
    },
    {
      id: 'cs3',
      cat: 'Common Sense',
      q: 'Is a hot dog a sandwich?',
      a: [
        { t: 'Yes. The bread surrounds the filling. Case closed.', f: 'A lawyer has entered the chat.', s: { i: 6, o: 2, c: 6 } },
        { t: 'No. A hot dog is a lifestyle.', f: 'The system has no response to this.', s: { i: 0, o: 4, c: -4 } },
        { t: 'I have never thought about this and I refuse to start', f: 'Ignorance is a valid coping strategy.', s: { i: -2, o: -2, c: 2 } }
      ]
    },
    {
      id: 'cs4',
      cat: 'Common Sense',
      q: 'You put the milk in the cupboard and the cereal in the fridge. What happened?',
      a: [
        { t: 'I have become the thing I feared', f: 'A tragic transformation. Very cinematic.', s: { i: 0, o: 10, c: -8 } },
        { t: 'The fridge was hungry. It deserved a snack.', f: 'Please do not feed the appliances.', s: { i: -2, o: 6, c: -10 } },
        { t: 'My brain just autosaved to the wrong folder', f: 'System error: cereal.exe misplaced.', s: { i: 3, o: 8, c: -4 } }
      ]
    },
    {
      id: 'cs5',
      cat: 'Common Sense',
      q: 'Do fish ever get thirsty?',
      a: [
        { t: 'They live in water. Thirst is not their problem.', f: 'Correct. Their problem is the plastic.', s: { i: 6, o: -4, c: 10 } },
        { t: 'Yes, that is why they drink so much', f: 'The system is crying. In water.', s: { i: -4, o: 2, c: -12 } },
        { t: 'I am not going to sleep until I know', f: 'You will not sleep. That is a promise.', s: { i: 1, o: 14, c: -6 } }
      ]
    },
    {
      id: 'cs6',
      cat: 'Common Sense',
      q: 'Why do we park in driveways and drive on parkways?',
      a: [
        { t: 'Because language is a prank we all agreed to', f: 'Finally, someone said it.', s: { i: 5, o: 4, c: 6 } },
        { t: 'I have never noticed and I am not ok now', f: 'You are welcome for the new sleepless nights.', s: { i: 1, o: 10, c: -4 } },
        { t: 'This question has broken me', f: 'Hello, broken. I am the system.', s: { i: -2, o: 12, c: -6 } }
      ]
    },

    /* -------------------------------- LOGIC ------------------------------ */
    {
      id: 'lg1',
      cat: 'Logic',
      q: 'A plane crashes on the border of two countries. Where do you bury the survivors?',
      a: [
        { t: 'You do not bury survivors. They are alive.', f: 'Logic detected. The system is impressed.', s: { i: 12, o: -6, c: 8 } },
        { t: 'On the border, obviously', f: 'They are alive. Please stop digging.', s: { i: -8, o: 2, c: -10 } },
        { t: 'This is a trick question and I will not fall for it', f: 'Correct, but the confidence is alarming.', s: { i: 8, o: 4, c: 4 } }
      ]
    },
    {
      id: 'lg2',
      cat: 'Logic',
      q: 'How many months have 28 days?',
      a: [
        { t: 'All of them', f: 'Correct. The calendar has no exceptions.', s: { i: 12, o: -8, c: 10 } },
        { t: 'Only February', f: 'Only February got the memo. It is wrong.', s: { i: -6, o: 2, c: -6 } },
        { t: 'Whatever number makes this end', f: 'The system respects the honesty.', s: { i: -2, o: 6, c: -2 } }
      ]
    },
    {
      id: 'lg3',
      cat: 'Logic',
      q: 'If you sleep for eight hours, why are you still tired?',
      a: [
        { t: 'Because sleep is a subscription and I am on the free plan', f: 'The most accurate thing said today.', s: { i: 6, o: 6, c: 4 } },
        { t: 'Because I did not sleep, I just closed my eyes and thought', f: 'The thoughts do not rest. Ever.', s: { i: 4, o: 14, c: -4 } },
        { t: 'I have never been tired in my life', f: 'The system has detected a lie.', s: { i: -2, o: -2, c: -8 } }
      ]
    },
    {
      id: 'lg4',
      cat: 'Logic',
      q: 'If you close your eyes, can you still see?',
      a: [
        { t: 'Only my regrets', f: 'A little too real. The system is taking notes.', s: { i: 2, o: 10, c: -2 } },
        { t: 'No, that is literally what eyelids are for', f: 'Technically correct. The best kind of correct.', s: { i: 8, o: -6, c: 10 } },
        { t: 'Yes, the inside of my eyelids is a whole cinema', f: 'What is playing? Please say something good.', s: { i: 2, o: 6, c: -4 } }
      ]
    },
    {
      id: 'lg5',
      cat: 'Logic',
      q: 'Which is heavier: a kilogram of feathers or a kilogram of steel?',
      a: [
        { t: 'They are the same. It says kilogram.', f: 'Correct. The trap has failed.', s: { i: 12, o: -8, c: 10 } },
        { t: 'Steel, obviously', f: 'The trap has succeeded. The system rejoices.', s: { i: -8, o: 2, c: -8 } },
        { t: 'Feathers, because of the emotional weight', f: 'Unexpectedly profound. Still wrong.', s: { i: 2, o: 8, c: -2 } }
      ]
    },
    {
      id: 'lg6',
      cat: 'Logic',
      q: 'If money does not grow on trees, why do banks have branches?',
      a: [
        { t: 'Because banks are trees that charge fees', f: 'The system is suing for emotional damages.', s: { i: 6, o: 4, c: 4 } },
        { t: 'Because puns are the real currency', f: 'This answer has been approved by the board.', s: { i: 5, o: 6, c: 2 } },
        { t: 'I am going to think about this all week', f: 'And you will, too. Sorry.', s: { i: 1, o: 15, c: -4 } }
      ]
    },

    /* --------------------------- RANDOM THOUGHTS ------------------------- */
    {
      id: 'rt1',
      cat: 'Random Thoughts',
      q: 'Do you talk to yourself when nobody is around?',
      a: [
        { t: 'Yes, and I give great advice', f: 'The best conversations are the ones you win.', s: { i: 3, o: 8, c: 2 } },
        { t: 'No. Never. Not even now.', f: 'The system heard you reading this out loud.', s: { i: 2, o: -4, c: 4 } },
        { t: 'I talk to myself when people ARE around', f: 'Bold. Unhinged. Respect.', s: { i: 0, o: 6, c: -6 } }
      ]
    },
    {
      id: 'rt2',
      cat: 'Random Thoughts',
      q: 'Have you ever checked your phone while holding it?',
      a: [
        { t: 'Yes, and I looked for it while holding it', f: 'Peak human performance. Gold medal.', s: { i: 0, o: 8, c: -4 } },
        { t: 'No, I am always fully aware of my hands', f: 'The system has flagged this as a fantasy.', s: { i: 4, o: -6, c: 6 } },
        { t: 'I am doing it right now', f: 'Caught. Red-handed. Phone-handed.', s: { i: -1, o: 6, c: -2 } }
      ]
    },
    {
      id: 'rt3',
      cat: 'Random Thoughts',
      q: 'Do you sometimes narrate your own life in third person?',
      a: [
        { t: 'He opened the fridge. He found nothing. He opened it again.', f: 'A gripping saga. Ten out of ten.', s: { i: 2, o: 10, c: -2 } },
        { t: 'No, my narrator is on strike', f: 'Fair. The working conditions are terrible.', s: { i: 4, o: 4, c: 2 } },
        { t: 'Only when I do something embarrassing', f: 'So, constantly. Understood.', s: { i: 2, o: 8, c: 0 } }
      ]
    },
    {
      id: 'rt4',
      cat: 'Random Thoughts',
      q: 'Have you ever entered a room and forgotten why?',
      a: [
        { t: 'Yes, so I left and came back to reset the thought', f: 'Did it work? No. But you tried.', s: { i: 1, o: 10, c: -2 } },
        { t: 'No, I enter rooms with purpose and clarity', f: 'The system does not believe you.', s: { i: 5, o: -6, c: 6 } },
        { t: 'I forgot I was in a room while reading this', f: 'Current status: lost in your own home.', s: { i: -2, o: 8, c: -8 } }
      ]
    },
    {
      id: 'rt5',
      cat: 'Random Thoughts',
      q: 'How many tabs are open in your brain right now?',
      a: [
        { t: '47, and none of them are the music', f: 'The diagnosis is writing itself.', s: { i: 2, o: 16, c: -4 } },
        { t: 'Three. All saved. All organized.', f: 'The system is suspicious of this calm.', s: { i: 8, o: -10, c: 8 } },
        { t: 'I lost count and now I am scared', f: 'That is the correct response.', s: { i: 0, o: 12, c: -4 } }
      ]
    },
    {
      id: 'rt6',
      cat: 'Random Thoughts',
      q: 'Have you ever said "I will remember this" and immediately forgot?',
      a: [
        { t: 'Yes, and I forgot I said that too', f: 'Memory: not found.', s: { i: 0, o: 8, c: -4 } },
        { t: 'No, my memory is a fortress', f: 'The fortress has no doors. Or memory.', s: { i: 4, o: -4, c: 6 } },
        { t: 'I forgot the question while answering it', f: 'The system is impressed by the commitment.', s: { i: -2, o: 10, c: -8 } }
      ]
    },

    /* ------------------------- EVERYDAY SITUATIONS ----------------------- */
    {
      id: 'ev1',
      cat: 'Everyday Situations',
      q: 'You see an old friend at the store. You hide in the cereal aisle. Why?',
      a: [
        { t: 'I am not prepared for a 15-minute life update', f: 'The cereal understands. The cereal will not ask.', s: { i: 3, o: 10, c: -2 } },
        { t: 'I did not hide. I simply relocated with purpose.', f: 'Stealth mode: engaged.', s: { i: 5, o: 4, c: 2 } },
        { t: 'I actually live in the cereal aisle now', f: 'Rent is cheap. Fibre is high.', s: { i: -2, o: 6, c: -6 } }
      ]
    },
    {
      id: 'ev2',
      cat: 'Everyday Situations',
      q: 'The waiter says "enjoy your meal." You reply "you too." What happens next?',
      a: [
        { t: 'I die a little inside and never return', f: 'The system has initiated your funeral.', s: { i: 2, o: 12, c: -2 } },
        { t: 'I laugh it off and continue', f: 'Emotionally regulated. Admirable.', s: { i: 6, o: -4, c: 10 } },
        { t: 'I say "you too" to the chef, the table, and the exit', f: 'You too. You too. You too. You too.', s: { i: 0, o: 8, c: -6 } }
      ]
    },
    {
      id: 'ev3',
      cat: 'Everyday Situations',
      q: 'You wave at someone who was not waving at you. Recovery plan?',
      a: [
        { t: 'Pretend to stretch. Casually. Naturally.', f: 'The stretch was neither casual nor natural.', s: { i: 4, o: 8, c: 2 } },
        { t: 'Turn the wave into a hair adjustment', f: 'Flawless execution. The system applauds.', s: { i: 6, o: 4, c: 6 } },
        { t: 'Accept my fate and wave at everyone now', f: 'The wave has become a lifestyle.', s: { i: 0, o: 6, c: -2 } }
      ]
    },
    {
      id: 'ev4',
      cat: 'Everyday Situations',
      q: 'Someone is walking toward you in a long hallway. What do you do with your arms?',
      a: [
        { t: 'I have no idea. They are just there.', f: 'Hands: installed, instructions missing.', s: { i: 2, o: 10, c: -2 } },
        { t: 'Nod, smile, and keep walking', f: 'A functional human. We found one.', s: { i: 6, o: -6, c: 10 } },
        { t: 'I check my phone that has no notifications', f: 'The oldest trick in the hallway.', s: { i: 1, o: 8, c: 0 } }
      ]
    },
    {
      id: 'ev5',
      cat: 'Everyday Situations',
      q: 'Your phone rings. Unknown number. You:',
      a: [
        { t: 'Stare at it like it is a bomb', f: 'Do not answer. It is definitely a scam. Or your future.', s: { i: 2, o: 12, c: -2 } },
        { t: 'Answer it like a brave adult', f: 'Reckless. Inspiring.', s: { i: 6, o: -6, c: 8 } },
        { t: 'Let it ring, then Google the number', f: 'Excellent detective work, useless result.', s: { i: 3, o: 8, c: 2 } }
      ]
    },
    {
      id: 'ev6',
      cat: 'Everyday Situations',
      q: 'You sneeze and someone says "bless you" from across the room. You:',
      a: [
        { t: 'Say thank you loud enough for the whole room', f: 'The room did not need to be involved.', s: { i: 2, o: 6, c: 2 } },
        { t: 'Nod awkwardly and question my whole existence', f: 'The sneeze was the easy part.', s: { i: 1, o: 12, c: -4 } },
        { t: 'Sneeze again to assert dominance', f: 'The system fears you.', s: { i: -1, o: 4, c: -6 } }
      ]
    },

    /* ------------------------------ IMAGINATION -------------------------- */
    {
      id: 'im1',
      cat: 'Imagination',
      q: 'If your brain had an operating system, what would it be?',
      a: [
        { t: 'Windows 95 that has never been updated', f: 'Please do not click anything.', s: { i: 2, o: 8, c: -2 } },
        { t: 'A custom Linux build nobody understands', f: 'Impressive. Completely unsupported.', s: { i: 8, o: 2, c: 4 } },
        { t: 'A beta version that crashes when you sneeze', f: 'Please report the bug. It will be ignored.', s: { i: 0, o: 10, c: -6 } }
      ]
    },
    {
      id: 'im2',
      cat: 'Imagination',
      q: 'Your brain is a browser. What is the most embarrassing search history?',
      a: [
        { t: '"how to stop thinking about the thing"', f: 'Result: this quiz. You are welcome.', s: { i: 3, o: 12, c: 0 } },
        { t: '"is it normal to reheat coffee four times"', f: 'The system says yes. The system is lying.', s: { i: 4, o: 4, c: 2 } },
        { t: '"how to look busy while doing nothing"', f: 'You are currently nailing it.', s: { i: 2, o: 6, c: -2 } }
      ]
    },
    {
      id: 'im3',
      cat: 'Imagination',
      q: 'Your life has a loading screen. What tip does it show?',
      a: [
        { t: 'Tip: Sleep is not optional. Please reboot.', f: 'The system is begging you.', s: { i: 4, o: 2, c: 6 } },
        { t: 'Tip: You have 47 thoughts and one brain.', f: 'Efficiency: questionable.', s: { i: 2, o: 12, c: -2 } },
        { t: 'Tip: Have you tried turning yourself off and on?', f: 'Classic. Effective. Devastating.', s: { i: 3, o: 6, c: 2 } }
      ]
    },
    {
      id: 'im4',
      cat: 'Imagination',
      q: 'You can have any superpower. Your brain chooses:',
      a: [
        { t: 'The ability to stop overthinking. Immediately. Please.', f: 'The system has denied your request.', s: { i: 4, o: 14, c: 0 } },
        { t: 'Invisibility, for the hallway situations', f: 'Finally, a practical power.', s: { i: 3, o: 6, c: 2 } },
        { t: 'Remembering where I put my keys', f: 'A modest dream. The system respects it.', s: { i: 6, o: 0, c: 8 } }
      ]
    },
    {
      id: 'im5',
      cat: 'Imagination',
      q: 'You are the CEO of your brain. What is the company policy?',
      a: [
        { t: 'No meetings after midnight', f: 'The board has rejected this motion.', s: { i: 5, o: -4, c: 8 } },
        { t: 'All decisions require 400 revisions', f: 'Efficiently inefficient.', s: { i: 2, o: 15, c: -4 } },
        { t: 'We do not have a policy. We have vibes.', f: 'The system has filed for bankruptcy.', s: { i: 1, o: 6, c: -6 } }
      ]
    },
    {
      id: 'im6',
      cat: 'Imagination',
      q: 'Your brain storage is full. What do you delete first?',
      a: [
        { t: 'That one embarrassing thing from 2012', f: 'Deleted. Recovering... recovering...', s: { i: 2, o: 8, c: 2 } },
        { t: 'The name of every person I have ever met', f: 'Name not found. Nice to meet you, again.', s: { i: 0, o: 6, c: -6 } },
        { t: 'Nothing. I will just buy more storage.', f: 'The upgrade is not available. You are stuck.', s: { i: 3, o: 4, c: 0 } }
      ]
    }
  ];

  var CATEGORY_ORDER = [
    'Overthinking',
    'Common Sense',
    'Logic',
    'Random Thoughts',
    'Everyday Situations',
    'Imagination'
  ];

  function shuffle(list) {
    var arr = list.slice();
    for (var i = arr.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var tmp = arr[i];
      arr[i] = arr[j];
      arr[j] = tmp;
    }
    return arr;
  }

  function pickOne(pool) {
    return pool[Math.floor(Math.random() * pool.length)];
  }

  /**
   * Returns a balanced, non-repeating set of questions.
   * Tries to avoid questions seen in the previous session and to include
   * every category at least once.
   */
  function selectQuestions(count, recentIds) {
    count = Math.max(1, Math.min(count || 12, QUESTIONS.length));
    var recent = Array.isArray(recentIds) ? recentIds : [];

    var available = QUESTIONS.filter(function (q) {
      return recent.indexOf(q.id) === -1;
    });
    // If the "fresh" pool is too small, allow repeats rather than break the test.
    if (available.length < count) available = QUESTIONS.slice();

    var selected = [];
    var pickedIds = {};

    // Round-robin across shuffled categories for variety.
    var categories = shuffle(CATEGORY_ORDER);
    var changed = true;
    while (selected.length < count && changed) {
      changed = false;
      for (var c = 0; c < categories.length && selected.length < count; c++) {
        var cat = categories[c];
        var pool = available.filter(function (q) {
          return q.cat === cat && !pickedIds[q.id];
        });
        if (pool.length) {
          var pick = pickOne(pool);
          selected.push(pick);
          pickedIds[pick.id] = true;
          changed = true;
        }
      }
    }

    // Fill any remaining slots from whatever is left.
    if (selected.length < count) {
      var leftovers = shuffle(available.filter(function (q) {
        return !pickedIds[q.id];
      }));
      for (var i = 0; i < leftovers.length && selected.length < count; i++) {
        selected.push(leftovers[i]);
        pickedIds[leftovers[i].id] = true;
      }
    }

    return shuffle(selected).slice(0, count);
  }

  ns.Questions = {
    all: QUESTIONS,
    categories: CATEGORY_ORDER,
    select: selectQuestions
  };
})(window.BrainExe = window.BrainExe || {});
