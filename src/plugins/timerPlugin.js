// timerPlugin: simple clock-in/clock-out timer with total time tracking

const STORAGE_KEY = "js_learning_timer_v1";
const MIN_SESSION_MS = 60 * 1000;
const HISTORY_MAX = 10;

let totalMs = 0;
let activeStart = null;
let tickHandle = null;
let sessionCount = 0;
let sessionHistory = [];

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return;
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed === "object") {
      if (typeof parsed.totalMs === "number") totalMs = parsed.totalMs;
      if (typeof parsed.activeStart === "number") activeStart = parsed.activeStart;
      if (typeof parsed.sessionCount === "number") sessionCount = parsed.sessionCount;
      if (Array.isArray(parsed.sessionHistory)) {
        sessionHistory = parsed.sessionHistory.filter(
          (s) =>
            s &&
            typeof s.start === "number" &&
            typeof s.end === "number" &&
            typeof s.durationMs === "number"
        );
      }
    }
  } catch (_) {}
}

function saveState() {
  try {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ totalMs, activeStart, sessionCount, sessionHistory })
    );
  } catch (_) {}
}

function formatTime(ms) {
  const totalSeconds = Math.floor(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  const pad = (n) => String(n).padStart(2, "0");
  return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
}

function currentTotal() {
  if (activeStart == null) return totalMs;
  return totalMs + (Date.now() - activeStart);
}

function formatDate(ts) {
  const d = new Date(ts);
  const pad = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(
    d.getDate()
  )} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function startTick(onTick) {
  if (tickHandle) return;
  tickHandle = setInterval(onTick, 1000);
}

function stopTick() {
  if (tickHandle) {
    clearInterval(tickHandle);
    tickHandle = null;
  }
}

loadState();

export const timerPlugin = {
  id: "timer",
  name: "Learning Timer",

  onInit(ctx) {
    // nothing extra
  },

  onSubjectLoaded(subject, ctx) {},

  contributeControls(containerEl, ctx) {
    const wrapper = document.createElement("div");
    wrapper.className = "control-chip";

    const label = document.createElement("span");
    label.textContent = "Learning timer";

    const totalEl = document.createElement("span");
    totalEl.textContent = `Total ${formatTime(currentTotal())}`;
    totalEl.style.minWidth = "120px";

    const currentEl = document.createElement("span");
    currentEl.textContent = "Current 00:00:00";
    currentEl.style.minWidth = "120px";

    const sessionsEl = document.createElement("span");
    sessionsEl.textContent = `Sessions ${sessionCount}`;
    sessionsEl.style.minWidth = "100px";

    const toggleBtn = document.createElement("button");
    toggleBtn.type = "button";

    const historyTitle = document.createElement("div");
    historyTitle.className = "session-history-title";
    historyTitle.textContent = "Session history (>=1min)";

    const historyEl = document.createElement("div");
    historyEl.className = "session-history";

    const renderHistory = () => {
      historyEl.innerHTML = "";
      if (sessionHistory.length === 0) {
        const empty = document.createElement("div");
        empty.className = "session-history-empty";
        empty.textContent = "No sessions yet.";
        historyEl.appendChild(empty);
        return;
      }
      sessionHistory.forEach((s) => {
        const item = document.createElement("div");
        item.className = "session-history-item";
        const left = document.createElement("div");
        left.textContent = formatDate(s.start);
        const right = document.createElement("div");
        right.textContent = formatTime(s.durationMs);
        item.appendChild(left);
        item.appendChild(right);
        historyEl.appendChild(item);
      });
    };

    const updateUI = () => {
      totalEl.textContent = `Total ${formatTime(currentTotal())}`;
      const currentMs = activeStart == null ? 0 : Date.now() - activeStart;
      currentEl.textContent = `Current ${formatTime(currentMs)}`;
      sessionsEl.textContent = `Sessions ${sessionCount}`;
      toggleBtn.textContent = activeStart == null ? "Clock in" : "Clock out";
    };

    toggleBtn.addEventListener("click", () => {
      const now = Date.now();
      if (activeStart == null) {
        activeStart = now;
        saveState();
        startTick(updateUI);
      } else {
        const sessionMs = now - activeStart;
        const startedAt = activeStart;
        totalMs += sessionMs;
        if (sessionMs >= MIN_SESSION_MS) {
          sessionCount += 1;
          sessionHistory = [
            { start: startedAt, end: now, durationMs: sessionMs },
            ...sessionHistory
          ].slice(0, HISTORY_MAX);
        }
        activeStart = null;
        saveState();
        stopTick();
        renderHistory();
      }
      updateUI();
    });

    // if session active on load, keep ticking
    if (activeStart != null) {
      startTick(updateUI);
    }

    wrapper.appendChild(label);
    wrapper.appendChild(totalEl);
    wrapper.appendChild(currentEl);
    wrapper.appendChild(sessionsEl);
    wrapper.appendChild(toggleBtn);
    wrapper.appendChild(historyTitle);
    wrapper.appendChild(historyEl);
    containerEl.appendChild(wrapper);

    renderHistory();
    updateUI();
  },

  decorateNode(rowEl, node, ctx) {
    // no per-node UI
  }
};
