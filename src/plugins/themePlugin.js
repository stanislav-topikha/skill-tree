// themePlugin: switches Pip-Boy themes via data-theme on <body>

const THEME_STORAGE_KEY = "js_knowledge_theme";

const THEME_GROUPS = [
  {
    label: "Fallout",
    themes: [
      { id: "pipboy_green", label: "Pip-Boy Green" },
      { id: "pipboy_amber", label: "Pip-Boy Amber" },
      { id: "pipboy_blue", label: "Pip-Boy Blue" }
    ]
  },
  {
    label: "Mission",
    themes: [
      { id: "mil_dot_sci", label: "Mission Stealth" },
      { id: "mil_dot_desert", label: "Mission Dune" },
      { id: "mil_nasa", label: "Mission Apollo" }
    ]
  },
  {
    label: "Myth",
    themes: [{ id: "myth_diablo2", label: "Diablo II" }]
  }
];

const THEME_IDS = THEME_GROUPS.flatMap((g) => g.themes.map((t) => t.id));

let currentTheme = loadTheme();

function loadTheme() {
  try {
    const saved = localStorage.getItem(THEME_STORAGE_KEY);
    if (saved && THEME_IDS.includes(saved)) return saved;
    return THEME_IDS[0] || "pipboy_green";
  } catch (_) {
    return THEME_IDS[0] || "pipboy_green";
  }
}

function applyTheme(themeId) {
  document.body.setAttribute("data-theme", themeId);
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

  onSubjectLoaded(subject, ctx) {},

  contributeControls(containerEl, ctx) {
    const wrapper = document.createElement("div");
    wrapper.className = "control-chip";

    const label = document.createElement("span");
    label.textContent = "Theme";

    const select = document.createElement("select");

    THEME_GROUPS.forEach((group) => {
      const optGroup = document.createElement("optgroup");
      optGroup.label = group.label;

      group.themes.forEach((theme) => {
        const opt = document.createElement("option");
        opt.value = theme.id;
        opt.textContent = theme.label;
        if (theme.id === currentTheme) opt.selected = true;
        optGroup.appendChild(opt);
      });

      select.appendChild(optGroup);
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
    // theme is global via CSS vars; nothing per-node
  }
};
