// viewFilterPlugin: hide completed, expand all, collapse all

const STORAGE_KEY = "js_filter_view_v1";
const ALL_STATUSES = ["todo", "in-progress", "done"];
let hideCompleted = false;
let visibleStatuses = new Set(ALL_STATUSES);

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
    if (parsed && Array.isArray(parsed.statuses)) {
      const next = parsed.statuses.filter((s) => ALL_STATUSES.includes(s));
      if (next.length > 0) {
        visibleStatuses = new Set(next);
      }
    }
  } catch (_) {}
}

function saveState() {
  try {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        hideCompleted,
        statuses: Array.from(visibleStatuses)
      })
    );
  } catch (_) {}
}

loadState();

export const viewFilterPlugin = {
  id: "view_filter",
  name: "View & Filters",
  reset(ctx) {
    hideCompleted = false;
    visibleStatuses = new Set(ALL_STATUSES);
    if (this._hideBox) this._hideBox.checked = hideCompleted;
    if (this._statusBoxes) {
      this._statusBoxes.forEach((box) => (box.checked = true));
    }
    saveState();
    if (typeof ctx?.requestRender === "function") ctx.requestRender();
  },

  onInit(ctx) {},
  onSubjectLoaded(subject, ctx) {},

  contributeControls(containerEl, ctx) {
    const wrapper = document.createElement("div");
    wrapper.className = "control-chip stacked";

    this._statusBoxes = [];
    this._statusButtons = [];

    // Hide completed
    const hideRow = document.createElement("div");
    hideRow.className = "control-row";
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

    hideRow.appendChild(hideCheckbox);
    hideRow.appendChild(hideLabel);
    wrapper.appendChild(hideRow);
    this._hideBox = hideCheckbox;

    // Status filters (buttons for friendliness)
    const statusRow = document.createElement("div");
    statusRow.className = "control-row status-filter-row";
    const statusLabel = document.createElement("span");
    statusLabel.textContent = "Status:";
    statusRow.appendChild(statusLabel);

    const statusNames = {
      todo: "Queued",
      "in-progress": "In progress",
      done: "Done"
    };

    const refreshButtons = () => {
      this._statusButtons.forEach((btn) => {
        const active = visibleStatuses.has(btn.dataset.status);
        btn.dataset.active = active ? "true" : "false";
      });
    };

    ALL_STATUSES.forEach((status) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "filter-pill";
      btn.dataset.status = status;
      btn.textContent = statusNames[status] || status;
      btn.dataset.active = visibleStatuses.has(status) ? "true" : "false";

      btn.addEventListener("click", () => {
        const active = visibleStatuses.has(status);
        if (active && visibleStatuses.size === 1) return;
        if (active) visibleStatuses.delete(status);
        else visibleStatuses.add(status);
        saveState();
        refreshButtons();
        if (typeof ctx.requestRender === "function") ctx.requestRender();
      });

      this._statusButtons.push(btn);
      statusRow.appendChild(btn);
    });

    const allBtn = document.createElement("button");
    allBtn.type = "button";
    allBtn.className = "filter-pill";
    allBtn.textContent = "All";
    allBtn.addEventListener("click", () => {
      visibleStatuses = new Set(ALL_STATUSES);
      saveState();
      refreshButtons();
      if (typeof ctx.requestRender === "function") ctx.requestRender();
    });
    statusRow.appendChild(allBtn);

    wrapper.appendChild(statusRow);

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
    const aspect = ctx.getAspect(node.id);
    const status = normalizeStatus(aspect);
    if (!visibleStatuses.has(status)) return false;
    if (hideCompleted && status === "done") return false;
    return true;
  }
};
