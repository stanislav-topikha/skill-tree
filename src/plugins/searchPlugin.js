// searchPlugin: text filter over endpoints

let query = "";

export const searchPlugin = {
  id: "search",
  name: "Search",

  onInit(ctx) {},
  onSubjectLoaded(subject, ctx) {},

  contributeControls(containerEl, ctx) {
    const wrapper = document.createElement("div");
    wrapper.className = "control-chip";

    const label = document.createElement("span");
    label.textContent = "Search";

    const input = document.createElement("input");
    input.type = "text";
    input.placeholder = "Search (Cmd/Ctrl + K)";
    input.value = query;

    input.addEventListener("input", () => {
      query = input.value.trim().toLowerCase();
      if (typeof ctx.requestRender === "function") {
        ctx.requestRender();
      }
    });

    wrapper.appendChild(label);
    wrapper.appendChild(input);
    containerEl.appendChild(wrapper);
  },

  decorateNode(rowEl, node, ctx) {
    // could highlight matches here later
  },

  filterEndpoint(node, ctx) {
    if (!query) return true;

    const text = (node.label || node.title || "").toLowerCase();
    return text.includes(query);
  }
};
