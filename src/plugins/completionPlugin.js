// src/plugins/completionPlugin.js

export const completionPlugin = {
  id: "completion",
  name: "Completion",

  onInit(ctx) {
    // could do migration or stats later
  },

  onSubjectLoaded(subject, ctx) {
    // no-op for now
  },

  contributeControls(containerEl, ctx) {
    // Simple status text for now
    const span = document.createElement("span");
    span.textContent = "Completion: check endpoints as done";
    span.style.fontSize = "12px";
    span.style.opacity = "0.6";
    containerEl.appendChild(span);
  },

  decorateNode(rowEl, node, ctx) {
    if (!ctx.isEndpoint(node)) return;

    const aspect = ctx.getAspect(node.id);
    const completed = !!aspect.completed;

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = completed;
    checkbox.style.marginLeft = "auto";

    checkbox.addEventListener("change", () => {
      ctx.updateAspect(node.id, { completed: checkbox.checked });
    });

    rowEl.appendChild(checkbox);
  }

  // NOTE: no filterEndpoint here – that belongs to view/filter plugin
};
