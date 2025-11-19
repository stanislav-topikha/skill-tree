import { createCoreContext } from "./core/coreContext.js";
import { renderTree } from "./core/treeRenderer.js";
import { PluginHost } from "./core/pluginHost.js";

import { completionPlugin } from "./plugins/completionPlugin.js";
import { viewFilterPlugin } from "./plugins/viewFilterPlugin.js";
import { searchPlugin } from "./plugins/searchPlugin.js";
import { themePlugin } from "./plugins/themePlugin.js";
import { difficultyPlugin } from "./plugins/difficultyPlugin.js";
import { uiScalePlugin } from "./plugins/uiScalePlugin.js";

let ctx = null;
let pluginHost = null;

const treeContainer = document.getElementById("tree-container");
const coreControls = document.getElementById("core-controls");
const pluginControls = document.getElementById("plugin-controls");

function createPopupMenu(label) {
  const wrapper = document.createElement("div");
  wrapper.className = "control-chip pop-menu";

  const trigger = document.createElement("button");
  trigger.type = "button";
  trigger.className = "menu-trigger";
  trigger.textContent = `${label} ▾`;

  const panel = document.createElement("div");
  panel.className = "menu-panel";

  trigger.addEventListener("click", (e) => {
    e.stopPropagation();
    wrapper.classList.toggle("open");
  });

  document.addEventListener("click", (e) => {
    if (!wrapper.contains(e.target)) {
      wrapper.classList.remove("open");
    }
  });

  wrapper.appendChild(trigger);
  wrapper.appendChild(panel);

  return {
    wrapper,
    panel,
    open() {
      wrapper.classList.add("open");
    },
    close() {
      wrapper.classList.remove("open");
    },
    toggle() {
      wrapper.classList.toggle("open");
    }
  };
}

const setRenderHooks = () => {
  ctx.requestRender = () => {
    renderTree(ctx, treeContainer, pluginHost);
  };

  ctx.onAspectsChanged = () => {
    ctx.requestRender();
  };
};

(async function init() {
  // load base aspects (difficulty) - localStorage overrides inside createCoreContext
  let defaultAspects = {};
  try {
    const aspectsRes = await fetch("./data/subject_js.aspects.json");
    defaultAspects = await aspectsRes.json();
  } catch (_) {
    defaultAspects = {};
  }

  ctx = createCoreContext(defaultAspects);
  pluginHost = new PluginHost(ctx);
  setRenderHooks();

  const res = await fetch("./data/subject_js.json");
  const json = await res.json();

  ctx.setSubject(json.subject);

  // register plugins
  pluginHost.register(themePlugin);
  pluginHost.register(uiScalePlugin);
  pluginHost.register(completionPlugin);
  pluginHost.register(viewFilterPlugin);
  pluginHost.register(searchPlugin);
  pluginHost.register(difficultyPlugin);

  pluginHost.initAll();
  pluginHost.notifySubjectLoaded();

  // Menus for grouped controls
  const uiMenu = createPopupMenu("UI");
  const filterMenu = createPopupMenu("Filter");
  const viewMenu = createPopupMenu("View");

  pluginControls.appendChild(uiMenu.wrapper);
  pluginControls.appendChild(filterMenu.wrapper);
  pluginControls.appendChild(viewMenu.wrapper);

  // Grouped controls inside menus
  themePlugin.contributeControls(uiMenu.panel, ctx);
  uiScalePlugin.contributeControls(uiMenu.panel, ctx);
  searchPlugin.contributeControls(filterMenu.panel, ctx);
  difficultyPlugin.contributeControls(filterMenu.panel, ctx);
  viewFilterPlugin.contributeControls(viewMenu.panel, ctx);

  // Remaining controls rendered inline
  completionPlugin.contributeControls(pluginControls, ctx);

  renderTree(ctx, treeContainer, pluginHost);

  coreControls.textContent = `Subject: ${json.subject.title}`;

  // Cmd/Ctrl + K: open Filter menu and focus search field
  const filterSearchInput = filterMenu.panel.querySelector(
    'input[type="text"]'
  );
  window.addEventListener("keydown", (e) => {
    const isK = e.key && e.key.toLowerCase() === "k";
    if (isK && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      filterMenu.open();
      if (filterSearchInput) {
        filterSearchInput.focus();
        filterSearchInput.select();
      }
    }
  });
})();
