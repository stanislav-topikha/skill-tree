// src/plugins/themePlugin.js

const THEME_STORAGE_KEY = "js_knowledge_theme";

const THEMES = [
  { id: "neutral", label: "Neutral dark" },
  { id: "pipboy_green", label: "Pip-Boy Green" },
  { id: "pipboy_amber", label: "Pip-Boy Amber" },
  { id: "pipboy_blue", label: "Pip-Boy Blue" }
];

let currentTheme = loadTheme();

function loadTheme() {
  try {
    const saved = localStorage.getItem(THEME_STORAGE_KEY);
    if (!saved) return "pipboy_green"; // default
    return saved;
  } catch (_) {
    return "pipboy_green";
  }
}

function applyTheme(themeId) {
  const body = document.body;
  if (themeId === "neutral") {
    body.removeAttribute("data-theme");
  } else {
    body.setAttribute("data-theme", themeId);
  }
}

function saveTheme(themeId) {
  try {
    localStorage.setItem(THEME_STORAGE_KEY, themeId);
  } catch (_) {}
}

export const themePlugin = {
  id: "theme",
  name: "Theme",

  onInit(ctx) {
    applyTheme(currentTheme);
  },

  onSubjectLoaded(subject, ctx) {
    // nothing special
  },

  contributeControls(containerEl, ctx) {
    const wrapper = document.createElement("div");
    wrapper.className = "control-chip";

    const label = document.createElement("span");
    label.textContent = "Theme";

    const select = document.createElement("select");

    THEMES.forEach((theme) => {
      const opt = document.createElement("option");
      opt.value = theme.id;
      opt.textContent = theme.label;
      if (theme.id === currentTheme) {
        opt.selected = true;
      }
      select.appendChild(opt);
    });

    select.addEventListener("change", () => {
      currentTheme = select.value;
      applyTheme(currentTheme);
      saveTheme(currentTheme);
      if (typeof ctx.requestRender === "function") {
        ctx.requestRender();
      }
    });

    wrapper.appendChild(label);
    wrapper.appendChild(select);

    containerEl.appendChild(wrapper);
  },

  decorateNode(rowEl, node, ctx) {
    // themes operate via CSS variables; nothing per-node
  }
};
