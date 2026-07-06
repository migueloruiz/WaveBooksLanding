/* Wave Books — script.js
   Behavior only: config injection, mobile menu, sticky header, reveal-on-scroll.
   Core content works without this file. */
(function () {
  "use strict";

  document.documentElement.classList.remove("no-js");

  // --- Shared configuration (single source of truth: config.json) ----------
  // Defaults mirror config.json so the site works if the fetch is blocked
  // (e.g. file:// origin). config.json still wins when reachable.
  var siteConfig = {
    appStoreUrl: "https://apps.apple.com/app/idAPP_STORE_ID",
    supportEmail: "wavebooks+privacy@proton.me",
    features: {
      jellyfinComingSoon: true,
      audiobookShelfComingSoon: true
    },
    sections: {
      featureCards: true,
      howItWorks: true,
      cta: true
    },
    // Wave dividers. All percentages are of the divider's height; values are
    // clamped in wavePath() so no config can push the wave off-canvas.
    wave: {
      enabled: true,   // false = keep the static SVG waves
      waves: 1,        // full crests visible across the page width
      amplitude: 25,   // % the wave swings above/below its centerline (0–45)
      baseline: 52,    // % from the top where the wave centers (5–95)
      speed: 1         // 1 = one gentle swell every 10s; 2 = twice as fast
    }
  };

  function applyConfig(cfg) {
    document.querySelectorAll("[data-app-store-link]").forEach(function (el) {
      el.setAttribute("href", cfg.appStoreUrl);
    });
    document.querySelectorAll("[data-support-email]").forEach(function (el) {
      el.setAttribute("href", "mailto:" + cfg.supportEmail);
      if (!el.textContent.trim() || el.textContent.indexOf("@") !== -1) {
        el.textContent = cfg.supportEmail;
      }
    });
    document.querySelectorAll("[data-current-year]").forEach(function (el) {
      el.textContent = new Date().getFullYear();
    });
  }

  var COMING_SOON_FEATURES = {
    jellyfinComingSoon: "[data-jellyfin-feature]",
    audiobookShelfComingSoon: "[data-audiobookshelf-feature]"
  };

  function applyFeatures(features) {
    if (!features) return;
    Object.keys(COMING_SOON_FEATURES).forEach(function (key) {
      var enabled = !!features[key];
      document.querySelectorAll(COMING_SOON_FEATURES[key]).forEach(function (el) {
        var heading = el.querySelector("h3");
        if (!heading) return;
        var badge = heading.querySelector(".badge-soon");
        if (enabled && !badge) {
          badge = document.createElement("span");
          badge.className = "badge-soon";
          badge.textContent = "Coming soon";
          heading.appendChild(document.createTextNode(" "));
          heading.appendChild(badge);
        } else if (!enabled && badge) {
          badge.remove();
        }
      });
    });
  }

  // Sections carry data-section="<key>"; wave dividers share the key of the
  // band they belong to, so the page keeps flowing when a band is off.
  function applySections(sections) {
    if (!sections) return;
    Object.keys(sections).forEach(function (key) {
      var hide = sections[key] === false;
      document.querySelectorAll('[data-section="' + key + '"]').forEach(function (el) {
        el.hidden = hide;
        // Nav anchors into a hidden section lead nowhere — hide those too.
        if (el.id) {
          document.querySelectorAll('a[href="#' + el.id + '"]').forEach(function (link) {
            (link.closest("li") || link).hidden = hide;
          });
        }
      });
    });
  }

  applyConfig(siteConfig);
  applyFeatures(siteConfig.features);
  applySections(siteConfig.sections);

  fetch("config.json")
    .then(function (r) { return r.ok ? r.json() : null; })
    .then(function (cfg) {
      if (!cfg) return;
      siteConfig.appStoreUrl = cfg.appStoreUrl || siteConfig.appStoreUrl;
      siteConfig.supportEmail = cfg.supportEmail || siteConfig.supportEmail;
      applyConfig(siteConfig);
      applyFeatures(cfg.features);
      applySections(cfg.sections);
      applyWave(cfg.wave);
    })
    .catch(function () { /* offline / file:// — defaults already applied */ });

  // --- Mobile menu ---------------------------------------------------------
  var toggle = document.querySelector("[data-menu-toggle]");
  var menu = document.querySelector("[data-mobile-nav]");

  if (toggle && menu) {
    var openMenu = function () {
      toggle.setAttribute("aria-expanded", "true");
      toggle.setAttribute("aria-label", "Close menu");
      menu.setAttribute("data-open", "true");
      document.body.setAttribute("data-menu-open", "true");
    };
    var closeMenu = function (returnFocus) {
      toggle.setAttribute("aria-expanded", "false");
      toggle.setAttribute("aria-label", "Open menu");
      menu.removeAttribute("data-open");
      document.body.removeAttribute("data-menu-open");
      if (returnFocus) toggle.focus();
    };

    toggle.addEventListener("click", function () {
      if (toggle.getAttribute("aria-expanded") === "true") closeMenu(false);
      else openMenu();
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && toggle.getAttribute("aria-expanded") === "true") {
        closeMenu(true);
      }
    });

    document.addEventListener("click", function (e) {
      if (toggle.getAttribute("aria-expanded") !== "true") return;
      if (!menu.contains(e.target) && !toggle.contains(e.target)) closeMenu(false);
    });

    menu.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () { closeMenu(false); });
    });
  }

  // --- Sticky header visual state ------------------------------------------
  var header = document.querySelector("[data-site-header]");
  if (header) {
    var onScroll = function () {
      header.classList.toggle("site-header--scrolled", window.scrollY > 24);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  // --- Reveal on scroll ----------------------------------------------------
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var revealables = document.querySelectorAll(".reveal");

  if (!reduceMotion && "IntersectionObserver" in window) {
    var observer = new IntersectionObserver(function (entries, obs) {
      var queue = entries.filter(function (e) { return e.isIntersecting; });
      queue.forEach(function (entry, i) {
        var el = entry.target;
        // Stagger items that enter together (e.g. cards in one row),
        // then clear the delay so it never slows hover transitions.
        el.style.transitionDelay = (i * 90) + "ms";
        el.classList.add("is-visible");
        window.setTimeout(function () { el.style.transitionDelay = ""; }, i * 90 + 700);
        obs.unobserve(el);
      });
    }, { rootMargin: "0px 0px -6% 0px", threshold: 0 });
    revealables.forEach(function (el) { observer.observe(el); });
  } else {
    revealables.forEach(function (el) { el.classList.add("is-visible"); });
  }

  // --- Animated wave dividers (wavify-style, vanilla) -----------------------
  // Same idea as peacepostman/wavify: sample "bones" along the width with
  // sine-driven heights, join them with cubic béziers, rewrite the path's
  // `d` each frame — but with rAF instead of TweenMax. Static paths in the
  // HTML remain the no-JS / reduced-motion fallback.
  var wavePaths = document.querySelectorAll(".wave-divider svg path");
  var waveStaticD = [];
  // Each .wave-divider names its config via data-wave="<key>"; the matching
  // config.json `wave.dividers[<key>]` block overrides the global wave config.
  var waveKeys = [];
  wavePaths.forEach(function (p) {
    waveStaticD.push(p.getAttribute("d"));
    waveKeys.push(((p.closest(".wave-divider") || {}).dataset || {}).wave);
  });
  var waveRafId = 0;
  var W = 1440;

  var clamp = function (v, min, max) { return Math.min(max, Math.max(min, v)); };

  var wavePath = function (t, phase, key) {
    var dividers = siteConfig.wave.dividers || {};
    var w = Object.assign({}, siteConfig.wave, key ? dividers[key] : null);
    var waves = clamp(w.waves, 0.25, 8);
    var baseline = clamp(w.baseline, 5, 95);
    // Amplitude may never push a crest past the top or a trough past the bottom.
    var amplitude = clamp(w.amplitude, 0, Math.min(baseline - 2, 98 - baseline));
    // speed 1 = a 10-second swell cycle.
    var omega = (2 * Math.PI / 10) * clamp(w.speed, 0.1, 60);
    // Enough sample points to trace the sine smoothly; users never tune this.
    var bones = clamp(Math.round(waves * 8), 6, 60);

    var pts = [];
    for (var i = 0; i <= bones; i++) {
      var x = (i / bones) * W;
      pts.push({
        x: x,
        // Spatial phase from x makes the wave roll sideways, not bob.
        y: baseline + Math.sin(t * omega + phase + 2 * Math.PI * waves * (x / W)) * amplitude
      });
    }
    // Catmull-Rom -> cubic Bézier: each node keeps its real local slope, so the
    // curve follows the sine instead of flattening at every node (the old
    // midpoint control points forced a horizontal tangent everywhere, which
    // left shelves/ondulations mid-slope).
    var d = "M0," + pts[0].y.toFixed(2);
    for (var j = 0; j < bones; j++) {
      var p0 = pts[j > 0 ? j - 1 : 0];
      var p1 = pts[j];
      var p2 = pts[j + 1];
      var p3 = pts[j + 2 <= bones ? j + 2 : bones];
      var c1x = p1.x + (p2.x - p0.x) / 6;
      var c1y = p1.y + (p2.y - p0.y) / 6;
      var c2x = p2.x - (p3.x - p1.x) / 6;
      var c2y = p2.y - (p3.y - p1.y) / 6;
      d += " C" + c1x.toFixed(1) + "," + c1y.toFixed(2) +
           " " + c2x.toFixed(1) + "," + c2y.toFixed(2) +
           " " + p2.x.toFixed(1) + "," + p2.y.toFixed(2);
    }
    // 101 keeps the existing 1px seam overshoot.
    return d + " L1440,101 L0,101 Z";
  };

  var waveFrame = function (now) {
    var t = now / 1000;
    wavePaths.forEach(function (path, i) {
      path.setAttribute("d", wavePath(t, i * 2.4, waveKeys[i]));
    });
    waveRafId = window.requestAnimationFrame(waveFrame);
  };

  // Merges config.json's `wave` block and starts/stops the loop accordingly.
  function applyWave(wave) {
    siteConfig.wave = Object.assign({}, siteConfig.wave, wave);
    var run = siteConfig.wave.enabled && !reduceMotion && wavePaths.length;
    if (run && !waveRafId) {
      waveRafId = window.requestAnimationFrame(waveFrame);
    } else if (!run && waveRafId) {
      window.cancelAnimationFrame(waveRafId);
      waveRafId = 0;
      wavePaths.forEach(function (p, i) { p.setAttribute("d", waveStaticD[i]); });
    }
  }
  applyWave(null);

  // --- Gentle blob parallax -------------------------------------------------
  // Uses the `translate` property so it composes with the blobs' morphing
  // `transform` animation. ponytail: rect lookups per frame are fine at 6 blobs.
  var blobs = document.querySelectorAll(".blob");
  if (!reduceMotion && blobs.length) {
    var blobTick = false;
    var updateBlobs = function () {
      blobTick = false;
      blobs.forEach(function (el) {
        var rect = el.parentElement.getBoundingClientRect();
        var offset = rect.top + rect.height / 2 - window.innerHeight / 2;
        el.style.translate = "0 " + (offset * -0.04).toFixed(1) + "px";
      });
    };
    var onBlobScroll = function () {
      if (!blobTick) { blobTick = true; window.requestAnimationFrame(updateBlobs); }
    };
    updateBlobs();
    window.addEventListener("scroll", onBlobScroll, { passive: true });
  }
})();
