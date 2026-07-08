/* KINO — live behavior, no framework, no noise. */

(function () {
  "use strict";

  /* ---- Live clock (local time) ---- */
  const clock = document.getElementById("clock");
  function tick() {
    const d = new Date();
    const p = (n) => String(n).padStart(2, "0");
    clock.textContent = p(d.getHours()) + ":" + p(d.getMinutes()) + ":" + p(d.getSeconds());
  }
  tick();
  setInterval(tick, 1000);

  /* ---- Awake counter (since page load) ---- */
  const up = document.getElementById("uptime");
  let seconds = 0;
  setInterval(() => { seconds += 1; up.textContent = seconds; }, 1000);

  /* ---- Count-up stats when scrolled into view ---- */
  const nums = document.querySelectorAll("[data-count]");
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      const el = e.target;
      const target = parseInt(el.getAttribute("data-count"), 10);
      const dur = 900;
      const start = performance.now();
      function step(now) {
        const t = Math.min((now - start) / dur, 1);
        el.textContent = Math.round(t * target);
        if (t < 1) requestAnimationFrame(step);
      }
      requestAnimationFrame(step);
      io.unobserve(el);
    });
  }, { threshold: 0.6 });
  nums.forEach((n) => io.observe(n));

  /* ---- Status: flip ONLINE / THINKING every few seconds ---- */
  const statusText = document.getElementById("status-text");
  const states = ["ONLINE", "LISTENING", "READY", "AWAITING INPUT"];
  let si = 0;
  setInterval(() => {
    si = (si + 1) % states.length;
    statusText.textContent = states[si];
  }, 3200);
})();
