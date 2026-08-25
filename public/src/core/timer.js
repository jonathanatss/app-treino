// Rest timer logic.
// Depends on: globals timerEl, stopTimer, timerId, timerEndsAt, activeRest

function formatTime(totalSeconds) {
  const seconds = Math.max(0, Math.ceil(totalSeconds));
  const minutes = Math.floor(seconds / 60);
  const restSeconds = seconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(restSeconds).padStart(2, "0")}`;
}

function startRest(seconds) {
  activeRest = seconds;
  timerEndsAt = Date.now() + seconds * 1000;
  document.querySelector(".rest-bar")?.classList.remove("is-complete");
  document.querySelectorAll(".rest-button").forEach((b) => {
    b.classList.toggle("active", Number(b.dataset.rest) === seconds);
  });
  stopTimer.classList.remove("hidden");
  tickTimer();
  clearInterval(timerId);
  timerId = setInterval(tickTimer, 250);
}

function stopRest() {
  clearInterval(timerId);
  timerId = null;
  timerEndsAt = 0;
  activeRest = 0;
  if (timerEl) {
    timerEl.textContent = "00:00";
    timerEl.classList.remove("running");
  }
  document.querySelector(".rest-bar")?.classList.remove("is-complete");
  if (stopTimer) stopTimer.classList.add("hidden");
  document.querySelectorAll(".rest-button").forEach((b) => b.classList.remove("active"));
}

function signalRestComplete() {
  document.querySelector(".rest-bar")?.classList.add("is-complete");
  if ("vibrate" in navigator) navigator.vibrate([180, 80, 180]);
}

function tickTimer() {
  const remaining = (timerEndsAt - Date.now()) / 1000;
  timerEl.textContent = formatTime(remaining);
  timerEl.classList.toggle("running", remaining > 0);
  if (remaining <= 0) {
    clearInterval(timerId);
    timerId = null;
    if (activeRest) {
      signalRestComplete();
      timerEl.textContent = "Fim";
      stopTimer.classList.add("hidden");
      document.querySelectorAll(".rest-button").forEach((b) => b.classList.remove("active"));
      activeRest = 0;
    }
  }
}

