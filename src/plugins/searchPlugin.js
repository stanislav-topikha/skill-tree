// src/plugins/searchPlugin.js

let query = ""; // plugin-local, not in aspects (search is just a view)

export const searchPlugin = {
  id: "search",
  name: "Search",

  onInit(ctx) {
    // could restore last query from localStorage later
  },

  onSubjectLoaded(subject, ctx) {
    // no-op for now
  },

  contributeControls(containerEl, ctx) {
  const wrapper = document.createElement("div");
  wrapper.className = "control-chip";

  const label = document.createElement("span");
  label.textContent = "Search";

  const input = document.createElement("input");
  input.type = "text";
  input.placeholder = "endpoints…";
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
    // later we can highlight matches here if we want
  },

  filterEndpoint(node, ctx) {
    if (!query) return true;

    const text = (node.label || node.title || "").toLowerCase();
    return text.includes(query);
  }
};
