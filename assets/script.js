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
