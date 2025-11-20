// difficultyPlugin: difficulty aspect + badges + level filter

const STORAGE_KEY = "js_filter_difficulty_v1";
const LEVELS = [1, 2, 3, 4];
let activeLevels = new Set(LEVELS); // all visible by default
let buttonUpdaters = [];

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return;
    const parsed = JSON.parse(raw);
    if (parsed && Array.isArray(parsed.levels)) {
      activeLevels = new Set(parsed.levels.filter((l) => LEVELS.includes(l)));
      if (activeLevels.size === 0) activeLevels = new Set(LEVELS);
    }
  } catch (_) {}
}

function saveState() {
  try {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ levels: Array.from(activeLevels) })
    );
  } catch (_) {}
}

loadState();

export const difficultyPlugin = {
  id: "difficulty",
  name: "Difficulty",
  reset(ctx) {
    activeLevels = new Set(LEVELS);
    buttonUpdaters.forEach((fn) => fn());
    saveState();
    if (typeof ctx?.requestRender === "function") ctx.requestRender();
  },

  onInit(ctx) {},
  onSubjectLoaded(subject, ctx) {},

  contributeControls(containerEl, ctx) {
    const wrapper = document.createElement("div");
    wrapper.className = "control-chip";

    const label = document.createElement("span");
    label.textContent = "Difficulty";

    wrapper.appendChild(label);

    buttonUpdaters = [];

    LEVELS.forEach((level) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.textContent = String(level);

      const updateStyle = () => {
        const on = activeLevels.has(level);
        btn.style.border = `1px solid ${
          on ? "var(--glow)" : "var(--border)"
        }`;
        btn.style.color = on ? "var(--glow)" : "var(--text-soft)";
        btn.style.background = on
          ? "var(--glow-soft)"
          : "rgba(0,0,0,0.8)";
        btn.style.fontSize = "10px";
        btn.style.padding = "1px 5px";
        btn.style.cursor = "pointer";
      };

      btn.addEventListener("click", () => {
        if (activeLevels.has(level)) {
          // don't allow turning off all levels
          if (activeLevels.size === 1) return;
          activeLevels.delete(level);
        } else {
          activeLevels.add(level);
        }
        updateStyle();
        saveState();
        if (typeof ctx.requestRender === "function") {
          ctx.requestRender();
        }
      });

      updateStyle();
      buttonUpdaters.push(updateStyle);
      wrapper.appendChild(btn);
    });

    containerEl.appendChild(wrapper);
  },

  decorateNode(rowEl, node, ctx) {
    if (!ctx.isEndpoint(node)) return;

    const aspect = ctx.getAspect(node.id);
    const level = aspect.difficulty;

    const badge = document.createElement("span");
    badge.className = "difficulty-badge";
    badge.style.marginLeft = "auto";
    badge.tabIndex = 0;
    badge.role = "button";

    if (level == null) {
      badge.textContent = "?";
      badge.title = "Click to set difficulty (1–4)";
    } else {
      badge.textContent = String(level);
      badge.dataset.level = String(level);
      badge.title = `Difficulty ${level}`;
    }

    const cycle = () => {
      const current = ctx.getAspect(node.id).difficulty;
      let next;
      if (current == null || current === 4) next = 1;
      else next = current + 1;

      ctx.updateAspect(node.id, { difficulty: next });

      badge.textContent = String(next);
      badge.dataset.level = String(next);
      badge.title = `Difficulty ${next}`;
    };

    badge.addEventListener("click", cycle);
    badge.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " " || e.key === "Spacebar") {
        e.preventDefault();
        cycle();
      }
    });

    rowEl.appendChild(badge);
  },

  filterEndpoint(node, ctx) {
    const aspect = ctx.getAspect(node.id);
    const level = aspect.difficulty;
    if (level == null) return true; // don't hide untagged
    return activeLevels.has(level);
  }
};
