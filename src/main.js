import { createCoreContext } from "./core/coreContext.js";
import { renderTree } from "./core/treeRenderer.js";
import { PluginHost } from "./core/pluginHost.js";

import { completionPlugin } from "./plugins/completionPlugin.js";
import { viewFilterPlugin } from "./plugins/viewFilterPlugin.js";
import { searchPlugin } from "./plugins/searchPlugin.js";
import { themePlugin } from "./plugins/themePlugin.js";
import { difficultyPlugin } from "./plugins/difficultyPlugin.js";
import { uiScalePlugin } from "./plugins/uiScalePlugin.js";
import { timerPlugin } from "./plugins/timerPlugin.js";
import { notesPlugin } from "./plugins/notesPlugin.js";

let ctx = null;
let pluginHost = null;
let lastFocusedGroupId = null;
let lastFocusedNodeId = null;

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

// Simple toast helper
const toastStack = document.createElement("div");
toastStack.id = "toast-stack";
document.body.appendChild(toastStack);

function showToast(message, duration = 2000) {
  const toast = document.createElement("div");
  toast.className = "toast";
  toast.textContent = message;
  toastStack.appendChild(toast);
  requestAnimationFrame(() => toast.classList.add("show"));
  setTimeout(() => {
    toast.classList.remove("show");
    setTimeout(() => toast.remove(), 200);
  }, duration);
}

const setRenderHooks = () => {
  ctx.requestRender = () => {
    renderTree(ctx, treeContainer, pluginHost);

    if (lastFocusedGroupId) {
      setTimeout(() => {
        const btn = treeContainer.querySelector(
          `.toggle-btn[data-group-id="${lastFocusedGroupId}"]`
        );
        if (btn) btn.focus();
      }, 0);
    }

    if (lastFocusedNodeId) {
      setTimeout(() => {
        const row = treeContainer.querySelector(
          `.node-row[data-node-id="${lastFocusedNodeId}"]`
        );
        if (row) row.focus();
      }, 0);
    }
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
  ctx.toast = showToast;

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
  pluginHost.register(timerPlugin);
  pluginHost.register(notesPlugin);

  pluginHost.initAll();
  pluginHost.notifySubjectLoaded();

  // Menus for grouped controls
  const uiMenu = createPopupMenu("UI");
  const filterMenu = createPopupMenu("View/Filter");
  const timeMenu = createPopupMenu("Sessions");

  pluginControls.appendChild(uiMenu.wrapper);
  pluginControls.appendChild(filterMenu.wrapper);
  pluginControls.appendChild(timeMenu.wrapper);

  // Grouped controls inside menus
  themePlugin.contributeControls(uiMenu.panel, ctx);
  uiScalePlugin.contributeControls(uiMenu.panel, ctx);

  const filterSection = document.createElement("div");
  filterSection.className = "menu-section";
  const filterTitle = document.createElement("div");
  filterTitle.className = "menu-section-title";
  filterTitle.textContent = "Filters";
  filterSection.appendChild(filterTitle);
  searchPlugin.contributeControls(filterSection, ctx);
  difficultyPlugin.contributeControls(filterSection, ctx);

  const viewSection = document.createElement("div");
  viewSection.className = "menu-section";
  const viewTitle = document.createElement("div");
  viewTitle.className = "menu-section-title";
  viewTitle.textContent = "View";
  viewSection.appendChild(viewTitle);
  viewFilterPlugin.contributeControls(viewSection, ctx);

  filterMenu.panel.appendChild(filterSection);
  filterMenu.panel.appendChild(viewSection);

  timerPlugin.contributeControls(timeMenu.panel, ctx);

  // Clear filters button inside Filter menu
  const clearWrap = document.createElement("div");
  clearWrap.className = "control-chip";
  const clearBtn = document.createElement("button");
  clearBtn.type = "button";
  clearBtn.textContent = "Clear filters";
  clearBtn.addEventListener("click", () => {
    if (typeof searchPlugin.reset === "function") searchPlugin.reset(ctx);
    if (typeof difficultyPlugin.reset === "function") difficultyPlugin.reset(ctx);
    if (typeof viewFilterPlugin.reset === "function") viewFilterPlugin.reset(ctx);
  });
  clearWrap.appendChild(clearBtn);
  filterMenu.panel.appendChild(clearWrap);

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

  // Arrow shortcuts on focused group toggle
  window.addEventListener("keydown", (e) => {
    const target = document.activeElement;
    if (
      !target ||
      target.tagName === "INPUT" ||
      target.tagName === "TEXTAREA" ||
      target.tagName === "SELECT" ||
      target.isContentEditable
    ) {
      return;
    }

    const rowForControls = target.closest(".node-row");
    const isEndpointRow =
      rowForControls && rowForControls.dataset.kind === "endpoint";

    // Arrow key navigation within endpoint row controls
    if (
      isEndpointRow &&
      (e.key === "ArrowRight" || e.key === "ArrowLeft") &&
      rowForControls.contains(target)
    ) {
      const focusables = Array.from(
        rowForControls.querySelectorAll(
          'button, [role="button"], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        )
      ).filter(
        (el) =>
          !el.disabled &&
          el.tabIndex !== -1 &&
          el.offsetParent !== null &&
          rowForControls.contains(el)
      );

      if (focusables.length > 0) {
        const currentIdx =
          target === rowForControls ? -1 : focusables.indexOf(target);
        if (currentIdx !== -1 || target === rowForControls) {
          e.preventDefault();
          const delta = e.key === "ArrowRight" ? 1 : -1;
          const nextIdx = currentIdx + delta;

          if (nextIdx >= 0 && nextIdx < focusables.length) {
            focusables[nextIdx].focus();
            return;
          }

          if (nextIdx < 0) {
            rowForControls.focus();
            return;
          }
        }
      }
    }

    const isRow = target.classList && target.classList.contains("node-row");
    const isToggle = target.classList && target.classList.contains("toggle-btn");

    // Left/Right expand collapse on row or toggle
    if (isRow || isToggle) {
      const groupId =
        (isToggle && target.dataset.groupId) ||
        (isRow &&
          target.dataset.kind === "group" &&
          target.querySelector(".toggle-btn")?.dataset.groupId);

      const expandKey = e.key === "ArrowRight";
      const collapseKey = e.key === "ArrowLeft";

      if (groupId && (expandKey || collapseKey)) {
        e.preventDefault();
        lastFocusedGroupId = groupId;
        lastFocusedNodeId = target.dataset.nodeId || null;
        ctx.setGroupExpanded(groupId, expandKey);
        ctx.requestRender();
        return;
      }
    }

    // Up/Down navigation across rows
    if (isRow && (e.key === "ArrowDown" || e.key === "ArrowUp")) {
      e.preventDefault();
      const rows = Array.from(treeContainer.querySelectorAll(".node-row"));
      const idx = rows.indexOf(target);
      if (idx === -1) return;
      const nextIdx = e.key === "ArrowDown" ? idx + 1 : idx - 1;
      if (nextIdx < 0 || nextIdx >= rows.length) return;
      const nextRow = rows[nextIdx];
      lastFocusedNodeId = nextRow.dataset.nodeId || null;
      nextRow.focus();
      return;
    }
  });

  // Track focused node rows
  treeContainer.addEventListener(
    "focusin",
    (e) => {
      const row = e.target.closest(".node-row");
      if (row) {
        lastFocusedNodeId = row.dataset.nodeId || null;
      }
    },
    true
  );
})();
