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

  const updateCountdown = () => {
    const distance = Math.max(0, target - Date.now());
    fields.days.textContent = String(Math.floor(distance / 86_400_000)).padStart(2, "0");
    fields.hours.textContent = String(Math.floor((distance % 86_400_000) / 3_600_000)).padStart(2, "0");
    fields.minutes.textContent = String(Math.floor((distance % 3_600_000) / 60_000)).padStart(2, "0");
    fields.seconds.textContent = String(Math.floor((distance % 60_000) / 1_000)).padStart(2, "0");
    if (distance === 0) message.textContent = "The session has begun";
  };

  updateCountdown();
  window.setInterval(updateCountdown, 1000);
}

if (schedule) {
  const tabs = [...schedule.querySelectorAll("[data-tab]")];
  const panels = [...schedule.querySelectorAll("[data-panel]")];

  const selectDay = (index) => {
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
    tab.addEventListener("click", () => selectDay(index));
    tab.addEventListener("keydown", (event) => {
      if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
      event.preventDefault();

      let nextIndex = index;
      if (event.key === "ArrowLeft") nextIndex = (index - 1 + tabs.length) % tabs.length;
      if (event.key === "ArrowRight") nextIndex = (index + 1) % tabs.length;
      if (event.key === "Home") nextIndex = 0;
      if (event.key === "End") nextIndex = tabs.length - 1;

      selectDay(nextIndex);
      tabs[nextIndex].focus();
    });
  });

  selectDay(1);
}
