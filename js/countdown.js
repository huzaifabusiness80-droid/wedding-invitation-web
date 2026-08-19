/**
 * Live Countdown Timer Module
 */
const CountdownTimer = (() => {
  let daysEl, hoursEl, minutesEl, secondsEl;
  let targetDate = null;
  let timerInterval = null;

  function init() {
    daysEl = document.getElementById('cd-days');
    hoursEl = document.getElementById('cd-hours');
    minutesEl = document.getElementById('cd-minutes');
    secondsEl = document.getElementById('cd-seconds');

    if (!daysEl || !hoursEl || !minutesEl || !secondsEl) return;

    if (window.weddingConfig && weddingConfig.dates && weddingConfig.dates.targetCountdownDate) {
      targetDate = new Date(weddingConfig.dates.targetCountdownDate).getTime();
    } else {
      targetDate = new Date('2026-09-27T17:00:00-04:00').getTime();
    }

    updateCountdown();
    timerInterval = setInterval(updateCountdown, 1000);
  }

  function updateCountdown() {
    const now = new Date().getTime();
    const difference = targetDate - now;

    if (difference <= 0) {
      daysEl.textContent = '00';
      hoursEl.textContent = '00';
      minutesEl.textContent = '00';
      secondsEl.textContent = '00';
      if (timerInterval) clearInterval(timerInterval);
      return;
    }

    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((difference % (1000 * 60)) / 1000);

    animateValue(daysEl, days);
    animateValue(hoursEl, formatNumber(hours));
    animateValue(minutesEl, formatNumber(minutes));
    animateValue(secondsEl, formatNumber(seconds));
  }

  function formatNumber(num) {
    return num < 10 ? '0' + num : '' + num;
  }

  function animateValue(element, newValue) {
    if (element.textContent !== String(newValue)) {
      element.textContent = newValue;
    }
  }

  return {
    init
  };
})();
