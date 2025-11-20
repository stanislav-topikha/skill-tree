// completionPlugin: manages status per endpoint (todo / in-progress / done)

const STATUS_ORDER = ["todo", "in-progress", "done"];
const STATUS_TITLES = {
  todo: "Set to in-progress",
  "in-progress": "Set to done",
  done: "Reset to queued"
};

function normalizeStatus(aspect = {}) {
  if (STATUS_ORDER.includes(aspect.status)) {
    return aspect.status;
  }
  return aspect.completed ? "done" : "todo";
}

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
    const currentStatus = normalizeStatus(aspect);

    const pill = document.createElement("button");
    pill.type = "button";
    pill.className = "status-pill";
    pill.dataset.status = currentStatus;
    pill.title = STATUS_TITLES[currentStatus];
    pill.setAttribute("aria-label", STATUS_TITLES[currentStatus]);

    const applyStatus = (nextStatus) => {
      pill.dataset.status = nextStatus;
      pill.title = STATUS_TITLES[nextStatus];
      pill.setAttribute("aria-label", STATUS_TITLES[nextStatus]);
      rowEl.dataset.status = nextStatus;
    };

    applyStatus(currentStatus);

    pill.addEventListener("click", () => {
      const freshStatus = normalizeStatus(ctx.getAspect(node.id));
      const currentIdx = STATUS_ORDER.indexOf(freshStatus);
      const nextStatus = STATUS_ORDER[(currentIdx + 1) % STATUS_ORDER.length];

      ctx.updateAspect(node.id, {
        status: nextStatus,
        completed: nextStatus === "done"
      });
      applyStatus(nextStatus);
    });

    rowEl.appendChild(pill);
  }
};
