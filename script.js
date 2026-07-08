/* KINO — minimal behavior. Theme, nav, count-up. */

(function () {
  "use strict";

  /* ---- Theme toggle (persisted) ---- */
  var root = document.documentElement;
  var themeBtn = document.getElementById("theme-toggle");

  function applyTheme(t) {
    root.setAttribute("data-theme", t);
    if (themeBtn) themeBtn.textContent = t === "dark" ? "LIGHT" : "DARK";
  }

  // initial state is set pre-paint by an inline script in <head>
  applyTheme(root.getAttribute("data-theme") || "light");

  if (themeBtn) {
    themeBtn.addEventListener("click", function () {
      var next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
      applyTheme(next);
      try { localStorage.setItem("kino-theme", next); } catch (e) {}
    });
  }

  /* ---- Mobile nav toggle ---- */
  var navToggle = document.getElementById("navtoggle");
  var navLinks = document.getElementById("navlinks");
  if (navToggle && navLinks) {
    navToggle.addEventListener("click", function () {
      navLinks.classList.toggle("is-open");
    });
    navLinks.addEventListener("click", function (e) {
      if (e.target.tagName === "A") navLinks.classList.remove("is-open");
    });
  }

  /* ---- Count-up stats when scrolled into view ---- */
  var nums = document.querySelectorAll("[data-count]");
  if (!("IntersectionObserver" in window) || !nums.length) return;

  var io = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        var el = e.target;
        var target = parseFloat(el.getAttribute("data-count"));
        var decimals = parseInt(el.getAttribute("data-decimals") || "0", 10);
        var dur = 1200;
        var start = null;
        function step(ts) {
          if (!start) start = ts;
          var p = Math.min((ts - start) / dur, 1);
          var val = p * target;
          el.textContent = decimals ? val.toFixed(decimals) : Math.round(val);
          if (p < 1) requestAnimationFrame(step);
        }
        requestAnimationFrame(step);
        io.unobserve(el);
      });
    },
    { threshold: 0.4 }
  );
  nums.forEach(function (n) {
    io.observe(n);
  });
})();
