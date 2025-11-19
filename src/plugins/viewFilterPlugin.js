// viewFilterPlugin: hide completed, expand all, collapse all

const STORAGE_KEY = "js_filter_view_v1";
let hideCompleted = false;

function normalizeStatus(aspect = {}) {
  if (
    aspect.status === "todo" ||
    aspect.status === "in-progress" ||
    aspect.status === "done"
  ) {
    return aspect.status;
  }
  return aspect.completed ? "done" : "todo";
}

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return;
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed.hideCompleted === "boolean") {
      hideCompleted = parsed.hideCompleted;
    }
  } catch (_) {}
}

function saveState() {
  try {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ hideCompleted })
    );
  } catch (_) {}
}

loadState();

export const viewFilterPlugin = {
  id: "view_filter",
  name: "View & Filters",
  reset(ctx) {
    hideCompleted = false;
    if (this._hideBox) this._hideBox.checked = hideCompleted;
    saveState();
    if (typeof ctx?.requestRender === "function") ctx.requestRender();
  },

  onInit(ctx) {},
  onSubjectLoaded(subject, ctx) {},

  contributeControls(containerEl, ctx) {
    const wrapper = document.createElement("div");
    wrapper.className = "control-chip";

    // Hide completed
    const hideCheckbox = document.createElement("input");
    hideCheckbox.type = "checkbox";
    hideCheckbox.checked = hideCompleted;

    hideCheckbox.addEventListener("change", () => {
      hideCompleted = hideCheckbox.checked;
      saveState();
      if (typeof ctx.requestRender === "function") {
        ctx.requestRender();
      }
    });

    const hideLabel = document.createElement("label");
    hideLabel.textContent = "Hide completed";

    wrapper.appendChild(hideCheckbox);
    wrapper.appendChild(hideLabel);
    this._hideBox = hideCheckbox;

    // separator
    const sep = document.createElement("span");
    sep.textContent = "|";
    sep.style.opacity = "0.6";
    sep.style.padding = "0 3px";
    wrapper.appendChild(sep);

    // Expand all
    const expandBtn = document.createElement("button");
    expandBtn.type = "button";
    expandBtn.textContent = "Expand all";

    expandBtn.addEventListener("click", () => {
      if (typeof ctx.setAllGroupsExpanded === "function") {
        ctx.setAllGroupsExpanded(true);
      }
      if (typeof ctx.requestRender === "function") {
        ctx.requestRender();
      }
    });

    // Collapse all
    const collapseBtn = document.createElement("button");
    collapseBtn.type = "button";
    collapseBtn.textContent = "Collapse all";

    collapseBtn.addEventListener("click", () => {
      if (typeof ctx.setAllGroupsExpanded === "function") {
        ctx.setAllGroupsExpanded(false);
      }
      if (typeof ctx.requestRender === "function") {
        ctx.requestRender();
      }
    });

    wrapper.appendChild(expandBtn);
    wrapper.appendChild(collapseBtn);

    containerEl.appendChild(wrapper);
  },

  decorateNode(rowEl, node, ctx) {
    // no per-node decoration for now
  },

  filterEndpoint(node, ctx) {
    if (!hideCompleted) return true;

    const aspect = ctx.getAspect(node.id);
    const status = normalizeStatus(aspect);
    if (status === "done") return false;
    return true;
  }
};
