// uiScalePlugin: adjust global UI scale via CSS var --ui-scale with +/- buttons

const UI_SCALE_STORAGE_KEY = "js_knowledge_ui_scale";
const DEFAULT_SCALE = 1.25;
const MIN_SCALE = 0.9;
const MAX_SCALE = 1.6;
const STEP = 0.05;

let currentScale = loadScale();

function clampScale(value) {
  if (Number.isFinite(value)) {
    return Math.min(MAX_SCALE, Math.max(MIN_SCALE, value));
  }
  return DEFAULT_SCALE;
}

function loadScale() {
  try {
    const raw = localStorage.getItem(UI_SCALE_STORAGE_KEY);
    if (!raw) return DEFAULT_SCALE;
    const parsed = parseFloat(raw);
    return clampScale(parsed);
  } catch (_) {
    return DEFAULT_SCALE;
  }
}

function saveScale(scale) {
  try {
    localStorage.setItem(UI_SCALE_STORAGE_KEY, String(scale));
  } catch (_) {}
}

function applyScale(scale) {
  document.documentElement.style.setProperty("--ui-scale", String(scale));
}

export const uiScalePlugin = {
  id: "ui_scale",
  name: "UI Scale",

  onInit(ctx) {
    applyScale(currentScale);
  },

  onSubjectLoaded(subject, ctx) {},

  contributeControls(containerEl, ctx) {
    const wrapper = document.createElement("div");
    wrapper.className = "control-chip";

    const label = document.createElement("span");
    label.textContent = "UI scale";

    const valueEl = document.createElement("span");
    const updateValueText = () => {
      valueEl.textContent = `${Math.round(currentScale * 100)}%`;
    };
    updateValueText();

    const makeBtn = (text, delta) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.textContent = text;
      btn.addEventListener("click", () => {
        const next = clampScale(currentScale + delta);
        if (next === currentScale) return;
        currentScale = next;
        applyScale(currentScale);
        saveScale(currentScale);
        updateValueText();
        if (typeof ctx.requestRender === "function") {
          ctx.requestRender();
        }
      });
      return btn;
    };

    const minusBtn = makeBtn("-", -STEP);
    const plusBtn = makeBtn("+", STEP);

    wrapper.appendChild(label);
    wrapper.appendChild(minusBtn);
    wrapper.appendChild(valueEl);
    wrapper.appendChild(plusBtn);

    containerEl.appendChild(wrapper);
  },

  decorateNode(rowEl, node, ctx) {
    // scaling is global; nothing per-node
  }
};
