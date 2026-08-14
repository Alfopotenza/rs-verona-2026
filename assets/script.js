const schedule = document.querySelector("[data-schedule]");

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
