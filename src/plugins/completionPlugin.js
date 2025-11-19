// completionPlugin: manages "completed" aspect + checkbox per endpoint

export const completionPlugin = {
  id: "completion",
  name: "Completion",

  onInit(ctx) {},

  onSubjectLoaded(subject, ctx) {},

  contributeControls(containerEl, ctx) {
    // No header control needed for completion; checkboxes live on each endpoint row.
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
};
