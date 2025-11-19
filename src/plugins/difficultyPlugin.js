// src/plugins/difficultyPlugin.js

// difficulty is stored as an aspect: { difficulty: 1|2|3|4 }
// filter uses a set of active levels

const LEVELS = [1, 2, 3, 4];
let activeLevels = new Set(LEVELS); // all shown by default

export const difficultyPlugin = {
  id: "difficulty",
  name: "Difficulty",

  onInit(ctx) {
    // could migrate old data later if needed
  },

  onSubjectLoaded(subject, ctx) {
    // nothing for now
  },

  contributeControls(containerEl, ctx) {
    const wrapper = document.createElement("div");
    wrapper.className = "control-chip";

    const label = document.createElement("span");
    label.textContent = "Difficulty";

    wrapper.appendChild(label);

    LEVELS.forEach((level) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.textContent = String(level);
      btn.dataset.level = String(level);

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
          // at least one level must stay on, don't allow empty set
          if (activeLevels.size === 1) return;
          activeLevels.delete(level);
        } else {
          activeLevels.add(level);
        }
        updateStyle();
        if (typeof ctx.requestRender === "function") {
          ctx.requestRender();
        }
      });

      updateStyle();
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

    if (level == null) {
      badge.textContent = "?";
      badge.title = "Click to set difficulty (1–4)";
    } else {
      badge.textContent = String(level);
      badge.dataset.level = String(level);
      badge.title = `Difficulty ${level}`;
    }

    // Clicking cycles difficulty: undefined → 1 → 2 → 3 → 4 → undefined
    badge.addEventListener("click", () => {
      const current = ctx.getAspect(node.id).difficulty;
      let next;
      if (current == null || current === 4) next = 1;
      else next = current + 1;

      ctx.updateAspect(node.id, { difficulty: next });
      // let badge reflect immediately without full rerender
      badge.textContent = String(next);
      badge.dataset.level = String(next);
      badge.title = `Difficulty ${next}`;
    });

    // insert before completion checkbox (which is appended with margin-left:auto)
    // so we append badge before other plugins that might push content
    rowEl.appendChild(badge);
  },

  filterEndpoint(node, ctx) {
    // If level not set, don't filter it out
    const aspect = ctx.getAspect(node.id);
    const level = aspect.difficulty;
    if (level == null) return true;
    return activeLevels.has(level);
  }
};
