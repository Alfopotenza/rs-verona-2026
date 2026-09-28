const schedule = document.querySelector("[data-schedule]");
const countdown = document.querySelector("[data-countdown]");

if (countdown) {
  const target = new Date(countdown.dataset.target).getTime();
  const fields = {
    days: countdown.querySelector("[data-countdown-days]"),
    hours: countdown.querySelector("[data-countdown-hours]"),
    minutes: countdown.querySelector("[data-countdown-minutes]"),
    seconds: countdown.querySelector("[data-countdown-seconds]"),
  };
  const message = countdown.querySelector("[data-countdown-message]");
  const italian = document.documentElement.lang === "it";
  const end = Date.parse("2026-10-26T00:00:00+01:00");

  const updateCountdown = () => {
    const distance = Math.max(0, target - Date.now());
    fields.days.textContent = String(Math.floor(distance / 86_400_000)).padStart(2, "0");
    fields.hours.textContent = String(Math.floor((distance % 86_400_000) / 3_600_000)).padStart(2, "0");
    fields.minutes.textContent = String(Math.floor((distance % 3_600_000) / 60_000)).padStart(2, "0");
    fields.seconds.textContent = String(Math.floor((distance % 60_000) / 1_000)).padStart(2, "0");
    if (Date.now() >= end) {
      message.textContent = italian ? "Grazie per aver vissuto RS Verona 2026" : "Thank you for being part of RS Verona 2026";
    } else if (distance === 0) {
      message.textContent = italian ? "RS Verona 2026 è in corso" : "RS Verona 2026 is happening now";
    }
  };

  updateCountdown();
  window.setInterval(updateCountdown, 1000);
}

const initTabs = (container, defaultIndex = 0) => {
  if (!container) return;
  const tabs = [...container.querySelectorAll("[data-tab]")];
  const panels = [...container.querySelectorAll("[data-panel]")];

  const select = (index) => {
    tabs.forEach((tab, tabIndex) => {
      const selected = tabIndex === index;
      tab.classList.toggle("active", selected);
      tab.setAttribute("aria-selected", String(selected));
      tab.tabIndex = selected ? 0 : -1;
    });

    panels.forEach((panel, panelIndex) => {
      panel.hidden = panelIndex !== index;
    });
  };

  tabs.forEach((tab, index) => {
    tab.addEventListener("click", () => select(index));
    tab.addEventListener("keydown", (event) => {
      if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
      event.preventDefault();

      let nextIndex = index;
      if (event.key === "ArrowLeft") nextIndex = (index - 1 + tabs.length) % tabs.length;
      if (event.key === "ArrowRight") nextIndex = (index + 1) % tabs.length;
      if (event.key === "Home") nextIndex = 0;
      if (event.key === "End") nextIndex = tabs.length - 1;

      select(nextIndex);
      tabs[nextIndex].focus();
    });
  });

  select(defaultIndex);
};

// Interpret the event day in Verona, including visitors in other time zones.
const veronaDate = new Intl.DateTimeFormat("en-CA", {
  timeZone: "Europe/Rome", year: "numeric", month: "2-digit", day: "2-digit",
}).format(new Date());
const eventDays = ["2026-10-22", "2026-10-23", "2026-10-24", "2026-10-25"];
const currentDay = eventDays.indexOf(veronaDate);
initTabs(schedule, currentDay >= 0 ? currentDay : veronaDate > eventDays[3] ? 3 : 1);
initTabs(document.querySelector("[data-audience]"), 0);
initTabs(document.querySelector("[data-roles]"), 0);

document.querySelectorAll("[data-modal-open]").forEach((trigger) => {
  trigger.addEventListener("click", () => {
    const dialog = document.getElementById(trigger.dataset.modalOpen);
    if (dialog) dialog.showModal();
  });
});

document.querySelectorAll("dialog.brochure").forEach((dialog) => {
  dialog.querySelectorAll("[data-modal-close]").forEach((btn) => {
    btn.addEventListener("click", () => dialog.close());
  });
  dialog.addEventListener("click", (event) => {
    if (event.target === dialog) dialog.close();
  });
});

const counters = document.querySelectorAll("[data-counter]");

if (counters.length && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  const animateCounter = (el) => {
    const target = parseInt(el.dataset.counter, 10);
    const suffix = el.dataset.counterSuffix ?? "%";
    const duration = 1400;
    const start = performance.now();

    const step = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(target * eased) + suffix;
      if (progress < 1) window.requestAnimationFrame(step);
    };

    window.requestAnimationFrame(step);
  };

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      animateCounter(entry.target);
      counterObserver.unobserve(entry.target);
    });
  }, { threshold: 0.5 });

  counters.forEach((el) => counterObserver.observe(el));
} else {
  counters.forEach((el) => {
    el.textContent = el.dataset.counter + (el.dataset.counterSuffix ?? "%");
  });
}

// Keep the same navigation usable on touch, keyboard, and desktop.
document.querySelectorAll(".site-header").forEach((header) => {
  const toggle = header.querySelector(".menu-toggle");
  const nav = header.querySelector(".main-nav");
  if (!toggle || !nav) return;
  const close = () => {
    toggle.setAttribute("aria-expanded", "false");
    nav.classList.remove("is-open");
  };
  toggle.addEventListener("click", () => {
    const open = toggle.getAttribute("aria-expanded") !== "true";
    toggle.setAttribute("aria-expanded", String(open));
    nav.classList.toggle("is-open", open);
    if (open) nav.querySelector("a")?.focus();
  });
  nav.addEventListener("click", (event) => { if (event.target.closest("a")) close(); });
  header.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && toggle.getAttribute("aria-expanded") === "true") {
      close(); toggle.focus();
    }
  });
  document.addEventListener("click", (event) => {
    if (!header.contains(event.target)) close();
  });
  window.matchMedia("(min-width: 1181px)").addEventListener("change", close);
});

// "Which team are you?" quiz (Me in EYP). Questions, profiles and labels live in
// the HTML, so the English and Italian pages share this code.
document.querySelectorAll("[data-quiz]").forEach((quiz) => {
  const ROLES = ["academic", "media", "organising"];
  const KEYS = { a: "academic", m: "media", o: "organising" };
  // Corners of the compass triangle (same coordinates as the SVG).
  const CORNERS = { academic: [150, 20], media: [20, 245], organising: [280, 245] };
  const CENTRE = [150, 170];

  const names = quiz.dataset.names.split(",");
  const questions = [...quiz.querySelectorAll(".quiz-items li")].map((item) => ({
    text: item.textContent,
    weights: Object.fromEntries(item.dataset.w.split(",").map((pair) => {
      const [key, value] = pair.split(":");
      return [KEYS[key], parseFloat(value)];
    })),
  }));
  const $ = (selector) => quiz.querySelector(selector);
  const start = $("[data-quiz-start]");
  const run = $("[data-quiz-run]");
  const result = $("[data-quiz-result]");
  const questionEl = $("[data-quiz-question]");
  const count = $("[data-quiz-count]");
  const bar = $("[data-quiz-bar]");
  const back = $("[data-quiz-back]");
  const answerButtons = [...quiz.querySelectorAll(".quiz-scale button")];
  let answers = [];
  let current = 0;
  let shareText = "";

  const show = (panel) => {
    [start, run, result].forEach((p) => { p.hidden = p !== panel; });
  };

  const renderQuestion = () => {
    questionEl.textContent = questions[current].text;
    count.textContent = `${current + 1} ${quiz.dataset.of} ${questions.length}`;
    bar.style.width = `${(current / questions.length) * 100}%`;
    back.hidden = current === 0;
    answerButtons.forEach((button) => {
      button.setAttribute("aria-pressed", String(Number(button.dataset.a) === answers[current]));
    });
  };

  const score = () => {
    const shares = {};
    ROLES.forEach((role) => {
      let raw = 0;
      let max = 0;
      questions.forEach((q, i) => {
        const w = q.weights[role] || 0;
        raw += (answers[i] || 0) * w;
        max += 2 * Math.abs(w);
      });
      const normalised = max ? (raw + max) / (2 * max) : 0;
      shares[role] = normalised ** 2; // squared, so a clear preference stands out
    });
    const total = ROLES.reduce((sum, role) => sum + shares[role], 0);
    ROLES.forEach((role) => { shares[role] = total ? shares[role] / total : 1 / 3; });
    return shares;
  };

  const renderResult = () => {
    const shares = score();
    const ranked = [...ROLES].sort((x, y) => shares[y] - shares[x]);

    // Whole percentages that add up to 100 (largest remainder), ranked like the shares.
    const pct = Object.fromEntries(ROLES.map((role) => [role, Math.floor(shares[role] * 100)]));
    [...ROLES]
      .sort((x, y) => (shares[y] * 100 - pct[y]) - (shares[x] * 100 - pct[x]))
      .slice(0, 100 - ROLES.reduce((sum, role) => sum + pct[role], 0))
      .forEach((role) => { pct[role] += 1; });
    ranked.sort((x, y) => pct[y] - pct[x] || shares[y] - shares[x]);

    const profileKey = pct[ranked[0]] < 40 ? "balanced" : ranked[0];
    let profile;
    quiz.querySelectorAll("[data-quiz-profile]").forEach((el) => {
      el.hidden = el.dataset.quizProfile !== profileKey;
      if (!el.hidden) profile = el;
    });
    quiz.querySelectorAll("[data-bar]").forEach((row) => {
      row.querySelector("i").style.width = "0%";
      row.querySelector("em").textContent = `${pct[row.dataset.bar]}%`;
      row.classList.toggle("is-top", row.dataset.bar === ranked[0]);
    });
    const runnerUp = ranked[1];
    const runnerEl = $("[data-quiz-runner]");
    runnerEl.hidden = profileKey === "balanced" || pct[runnerUp] < 5;
    const close = pct[ranked[0]] - pct[runnerUp] <= 5;
    runnerEl.classList.toggle("is-close", close);
    runnerEl.textContent = (close ? quiz.dataset.close : quiz.dataset.runner)
      .replace("{name}", names[ROLES.indexOf(runnerUp)])
      .replace("{pct}", pct[runnerUp]);
    shareText = quiz.dataset.shareText
      .replace("{title}", profile.dataset.title)
      .replace("{team}", profile.dataset.team);

    // Move the dot from the centre to the weighted point of the triangle.
    // Kept slightly inside the triangle so the dot never covers a corner label.
    const x = CENTRE[0] + 0.86 * (ROLES.reduce((sum, role) => sum + shares[role] * CORNERS[role][0], 0) - CENTRE[0]);
    const y = CENTRE[1] + 0.86 * (ROLES.reduce((sum, role) => sum + shares[role] * CORNERS[role][1], 0) - CENTRE[1]);
    const dot = result.querySelector("[data-quiz-dot]");
    dot.style.transform = `translate(${CENTRE[0]}px, ${CENTRE[1]}px)`;
    show(result);
    result.querySelector("[data-quiz-result-copy]").focus({ preventScroll: true });
    result.scrollIntoView({ block: "start" });
    requestAnimationFrame(() => requestAnimationFrame(() => {
      dot.style.transform = `translate(${x}px, ${y}px)`;
      quiz.querySelectorAll("[data-bar]").forEach((row) => {
        row.querySelector("i").style.width = `${pct[row.dataset.bar]}%`;
      });
    }));
  };

  const begin = () => {
    answers = [];
    current = 0;
    show(run);
    renderQuestion();
    questionEl.scrollIntoView({ block: "center" });
  };

  $("[data-quiz-go]").addEventListener("click", begin);
  $("[data-quiz-retake]").addEventListener("click", begin);

  answerButtons.forEach((button) => {
    button.addEventListener("click", () => {
      answers[current] = Number(button.dataset.a);
      if (current < questions.length - 1) {
        current += 1;
        renderQuestion();
      } else {
        renderResult();
      }
    });
  });

  back.addEventListener("click", () => {
    if (current === 0) return;
    current -= 1;
    renderQuestion();
  });

  // Keys 1–4 answer, like the on-screen scale.
  quiz.addEventListener("keydown", (event) => {
    if (run.hidden || !/^[1-4]$/.test(event.key)) return;
    answerButtons[Number(event.key) - 1].click();
  });

  $("[data-quiz-share]").addEventListener("click", async (event) => {
    const url = `${location.href.split("#")[0]}#quiz`;
    if (navigator.share) {
      try { await navigator.share({ text: shareText, url }); } catch { /* closed */ }
      return;
    }
    try {
      await navigator.clipboard.writeText(`${shareText} ${url}`);
      const button = event.currentTarget;
      const label = button.textContent;
      button.textContent = quiz.dataset.copied;
      setTimeout(() => { button.textContent = label; }, 2000);
    } catch { /* clipboard unavailable */ }
  });
});

// Web app: offline support, install prompt and offline notice.
const siteRoot = new URL(document.querySelector('script[src$="assets/script.js"]').getAttribute("src").replace(/assets\/script\.js$/, ""), location.href);

if ("serviceWorker" in navigator && window.isSecureContext && location.protocol !== "file:") {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register(new URL("sw.js", siteRoot)).catch(() => {});
  });
}

const offlinePill = document.createElement("div");
offlinePill.className = "offline-pill";
offlinePill.setAttribute("role", "status");
offlinePill.hidden = navigator.onLine;
offlinePill.textContent = document.documentElement.lang === "it"
  ? "Sei offline: stai vedendo l'ultima versione salvata"
  : "You're offline: showing the last saved version";
document.body.append(offlinePill);
window.addEventListener("online", () => { offlinePill.hidden = true; });
window.addEventListener("offline", () => { offlinePill.hidden = false; });

const installBar = document.querySelector("[data-install]");
if (installBar) {
  const standalone = window.matchMedia("(display-mode: standalone)").matches || navigator.standalone === true;
  const dismissed = localStorage.getItem("rsv-install-dismissed") === "1";
  const isIOS = /iphone|ipad|ipod/i.test(navigator.userAgent)
    || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
  const button = installBar.querySelector("[data-install-button]");
  let deferredPrompt = null;

  if (!standalone && !dismissed) {
    if (isIOS) {
      installBar.querySelector("[data-install-ios]").hidden = false;
      installBar.hidden = false;
    } else if (window.matchMedia("(pointer: coarse)").matches) {
      // Phones without an install prompt (e.g. Firefox): explain the menu option.
      // Replaced by the Install button as soon as the browser offers it.
      setTimeout(() => {
        if (deferredPrompt) return;
        installBar.querySelector("[data-install-other]").hidden = false;
        installBar.hidden = false;
      }, 3000);
    }
  }

  window.addEventListener("beforeinstallprompt", (event) => {
    event.preventDefault();
    deferredPrompt = event;
    if (standalone || dismissed) return;
    installBar.querySelector("[data-install-other]").hidden = true;
    button.hidden = false;
    installBar.hidden = false;
  });

  button.addEventListener("click", async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    await deferredPrompt.userChoice.catch(() => null);
    deferredPrompt = null;
    button.hidden = true;
  });

  installBar.querySelector("[data-install-close]").addEventListener("click", () => {
    installBar.hidden = true;
    localStorage.setItem("rsv-install-dismissed", "1");
  });

  window.addEventListener("appinstalled", () => { installBar.hidden = true; });
}
