// src/plugins/viewFilterPlugin.js

let hideCompleted = false; // local plugin state

function walkGroups(nodes, fn) {
  if (!Array.isArray(nodes)) return;
  for (const node of nodes) {
    if (node.kind === "group") {
      fn(node);
      if (node.children && node.children.length > 0) {
        walkGroups(node.children, fn);
      }
    }
  }
}

export const viewFilterPlugin = {
  id: "view_filter",
  name: "View & Filters",

  onInit(ctx) {
    // nothing yet
  },

  onSubjectLoaded(subject, ctx) {
    // nothing yet
  },

  contributeControls(containerEl, ctx) {
    const wrapper = document.createElement("div");
    wrapper.className = "control-chip";

    // --- Hide completed toggle ---
    const hideCheckbox = document.createElement("input");
    hideCheckbox.type = "checkbox";
    hideCheckbox.checked = hideCompleted;

    hideCheckbox.addEventListener("change", () => {
      hideCompleted = hideCheckbox.checked;
      if (typeof ctx.requestRender === "function") {
        ctx.requestRender();
      }
    });

    const hideLabel = document.createElement("label");
    hideLabel.textContent = "Hide completed";

    wrapper.appendChild(hideCheckbox);
    wrapper.appendChild(hideLabel);

    // small separator
    const sep = document.createElement("span");
    sep.textContent = "|";
    sep.style.opacity = "0.6";
    sep.style.padding = "0 3px";
    wrapper.appendChild(sep);

    // --- Expand all button ---
    const expandBtn = document.createElement("button");
    expandBtn.type = "button";
    expandBtn.textContent = "Expand all";

    expandBtn.addEventListener("click", () => {
      if (!ctx.subject || !ctx.subject.root) return;
      ctx.expandedGroups.clear();
      walkGroups(ctx.subject.root, (group) => {
        ctx.expandedGroups.add(group.id);
      });
      if (typeof ctx.requestRender === "function") {
        ctx.requestRender();
      }
    });

    // --- Collapse all button ---
    const collapseBtn = document.createElement("button");
    collapseBtn.type = "button";
    collapseBtn.textContent = "Collapse all";

    collapseBtn.addEventListener("click", () => {
      // collapse everything: no group ids in the set
      ctx.expandedGroups.clear();
      if (typeof ctx.requestRender === "function") {
        ctx.requestRender();
      }
    });

    wrapper.appendChild(expandBtn);
    wrapper.appendChild(collapseBtn);

    containerEl.appendChild(wrapper);
  },

  decorateNode(rowEl, node, ctx) {
    // this plugin doesn't decorate nodes (yet)
  },

  // visibility logic for endpoints
  filterEndpoint(node, ctx) {
    if (!hideCompleted) return true;

    const aspect = ctx.getAspect(node.id);
    if (aspect.completed) return false;
    return true;
  }
};
