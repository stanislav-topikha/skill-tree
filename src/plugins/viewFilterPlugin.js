// viewFilterPlugin: hide completed, expand all, collapse all

let hideCompleted = false;

export const viewFilterPlugin = {
  id: "view_filter",
  name: "View & Filters",

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
      if (typeof ctx.requestRender === "function") {
        ctx.requestRender();
      }
    });

    const hideLabel = document.createElement("label");
    hideLabel.textContent = "Hide completed";

    wrapper.appendChild(hideCheckbox);
    wrapper.appendChild(hideLabel);

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
    if (aspect.completed) return false;
    return true;
  }
};
