/*
 * Brain.exe — local storage layer
 * Every read/write is defensive: private browsing, disabled storage, or
 * corrupted JSON must never take the site down.
 */
(function (ns) {
  'use strict';

  var KEYS = {
    prefs: 'brainexe.prefs.v1',
    history: 'brainexe.history.v1',
    recent: 'brainexe.recent.v1',
    eggs: 'brainexe.eggs.v1'
  };

  var DEFAULT_PREFS = {
    sound: true
  };

  var MAX_HISTORY = 20;

  var usable = (function () {
    try {
      var probe = '__brainexe_probe__';
      window.localStorage.setItem(probe, '1');
      window.localStorage.removeItem(probe);
      return true;
    } catch (err) {
      return false;
    }
  })();

  function read(key, fallback) {
    if (!usable) return fallback;
    try {
      var raw = window.localStorage.getItem(key);
      if (!raw) return fallback;
      var parsed = JSON.parse(raw);
      return parsed === null || parsed === undefined ? fallback : parsed;
    } catch (err) {
      return fallback;
    }
  }

  function write(key, value) {
    if (!usable) return false;
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (err) {
      return false;
    }
  }

  function asArray(value) {
    return Array.isArray(value) ? value : [];
  }

  var Storage = {
    available: usable,

    getPrefs: function () {
      var saved = read(KEYS.prefs, {});
      var prefs = {};
      Object.keys(DEFAULT_PREFS).forEach(function (key) {
        prefs[key] = DEFAULT_PREFS[key];
      });
      if (saved && typeof saved === 'object') {
        Object.keys(DEFAULT_PREFS).forEach(function (key) {
          if (typeof saved[key] === typeof DEFAULT_PREFS[key]) {
            prefs[key] = saved[key];
          }
        });
      }
      return prefs;
    },

    setPref: function (key, value) {
      var prefs = this.getPrefs();
      prefs[key] = value;
      write(KEYS.prefs, prefs);
      return prefs;
    },

    resetPrefs: function () {
      write(KEYS.prefs, {});
    },

    getHistory: function () {
      var history = read(KEYS.history, []);
      if (!Array.isArray(history)) return [];
      return history.filter(function (entry) {
        return entry && typeof entry === 'object' && typeof entry.title === 'string';
      });
    },

    addHistory: function (entry) {
      var history = this.getHistory();
      var clean = {
        title: String(entry.title || 'Unknown Brain'),
        status: String(entry.status || 'UNKNOWN'),
        intelligence: clampScore(entry.intelligence),
        overthinking: clampScore(entry.overthinking),
        commonSense: clampScore(entry.commonSense),
        glyph: String(entry.glyph || '🧠'),
        date: entry.date || new Date().toISOString()
      };
      history.unshift(clean);
      write(KEYS.history, history.slice(0, MAX_HISTORY));
      return clean;
    },

    clearHistory: function () {
      write(KEYS.history, []);
    },

    getRecentIds: function () {
      return asArray(read(KEYS.recent, [])).filter(function (id) {
        return typeof id === 'string';
      });
    },

    setRecentIds: function (ids) {
      write(KEYS.recent, asArray(ids).slice(0, 40));
    },

    getSecretCount: function () {
      var value = read(KEYS.eggs, 0);
      return typeof value === 'number' && isFinite(value) ? value : 0;
    },

    setSecretCount: function (count) {
      write(KEYS.eggs, Math.max(0, count | 0));
    },

    clearAll: function () {
      this.clearHistory();
      write(KEYS.recent, []);
      write(KEYS.eggs, 0);
      write(KEYS.prefs, {});
    }
  };

  function clampScore(value) {
    var num = Number(value);
    if (!isFinite(num)) return 0;
    return Math.max(0, Math.min(99, Math.round(num)));
  }

  ns.Storage = Storage;
})(window.BrainExe = window.BrainExe || {});
