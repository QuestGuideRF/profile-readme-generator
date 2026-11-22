"use strict";

(function () {
  var GLOBAL_KEY = "__PRG_TROPHY__";
  var ENGINE_SRC = "/assets/github-trophies-engine.js?v=20260430-6";
  var enginePromise = null;
  var queuedEnhance = false;

  function loadEngine() {
    if (window.__PRG_TROPHY_ENGINE__) {
      return Promise.resolve(window.__PRG_TROPHY_ENGINE__);
    }
    if (enginePromise) {
      return enginePromise;
    }
    enginePromise = new Promise(function (resolve, reject) {
      var script = document.createElement("script");
      script.src = ENGINE_SRC;
      script.async = true;
      script.onload = function () {
        if (window.__PRG_TROPHY_ENGINE__) {
          resolve(window.__PRG_TROPHY_ENGINE__);
          return;
        }
        reject(new Error("GitHub trophy engine was not initialized"));
      };
      script.onerror = function () {
        reject(new Error("Could not load GitHub trophy engine"));
      };
      document.head.appendChild(script);
    });
    return enginePromise;
  }

  function call(method, args) {
    return loadEngine().then(function (engine) {
      return engine[method].apply(engine, args);
    });
  }

  function shouldEnhance() {
    return !!document.querySelector("[data-prg-local-trophy],[data-prg-local-card]");
  }

  function scheduleEnhance() {
    if (queuedEnhance || !shouldEnhance()) {
      return;
    }
    queuedEnhance = true;
    var run = function () {
      queuedEnhance = false;
      loadEngine().then(function (engine) {
        engine.enhance(document);
      });
    };
    if (window.requestIdleCallback) {
      window.requestIdleCallback(run, { timeout: 1200 });
      return;
    }
    setTimeout(run, 300);
  }

  window[GLOBAL_KEY] = {
    buildCardSvg: function () {
      return call("buildCardSvg", arguments);
    },
    buildSvg: function () {
      return call("buildSvg", arguments);
    },
    buildExportTree: function () {
      return call("buildExportTree", arguments);
    },
    enhance: function () {
      return call("enhance", arguments);
    },
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", scheduleEnhance);
  } else {
    scheduleEnhance();
  }

  new MutationObserver(scheduleEnhance).observe(document.documentElement, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: [
      "data-prg-local-card",
      "data-prg-local-trophy",
      "data-username",
      "data-theme",
      "data-custom-title",
      "data-height",
      "data-align",
      "data-radius",
      "data-area",
      "data-bg-color",
      "data-color",
      "data-title-color",
      "data-line",
      "data-point",
      "data-area-color",
    ],
  });
})();