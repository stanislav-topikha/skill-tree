// searchPlugin: text filter over endpoints (supports regex)

const STORAGE_KEY = "js_filter_search_v1";

let query = "";
let regexMode = false;

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return;
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed === "object") {
      if (typeof parsed.query === "string") query = parsed.query;
      if (typeof parsed.regex === "boolean") regexMode = parsed.regex;
    }
  } catch (_) {}
}

function saveState() {
  try {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ query, regex: regexMode })
    );
  } catch (_) {}
}

loadState();

export const searchPlugin = {
  id: "search",
  name: "Search",
  reset(ctx) {
    query = "";
    regexMode = false;
    if (this._input) this._input.value = "";
    if (this._regexBtn) this._regexBtn.dataset.on = "false";
    saveState();
    if (typeof ctx?.requestRender === "function") ctx.requestRender();
  },

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

    const regexBtn = document.createElement("button");
    regexBtn.type = "button";
    regexBtn.textContent = "Regex";
    regexBtn.dataset.on = regexMode ? "true" : "false";
    const syncRegexBtn = () => {
      const on = regexBtn.dataset.on === "true";
      regexBtn.style.borderColor = on ? "var(--glow)" : "var(--border)";
      regexBtn.style.color = on ? "var(--glow)" : "var(--text-soft)";
    };
    syncRegexBtn();

    input.addEventListener("input", () => {
      query = input.value.trim().toLowerCase();
      saveState();
      if (typeof ctx.requestRender === "function") {
        ctx.requestRender();
      }
    });

    regexBtn.addEventListener("click", () => {
      regexMode = !regexMode;
      regexBtn.dataset.on = regexMode ? "true" : "false";
      syncRegexBtn();
      saveState();
      if (typeof ctx.requestRender === "function") {
        ctx.requestRender();
      }
    });

    wrapper.appendChild(label);
    wrapper.appendChild(input);
    wrapper.appendChild(regexBtn);
    containerEl.appendChild(wrapper);

    this._input = input;
    this._regexBtn = regexBtn;
  },

  decorateNode(rowEl, node, ctx) {
    // could highlight matches here later
  },

  filterEndpoint(node, ctx) {
    if (!query) return true;

    const text = (node.label || node.title || "").toLowerCase();

    if (regexMode) {
      try {
        const re = new RegExp(query, "i");
        return re.test(text);
      } catch (_) {
        // invalid regex => fall back to substring
        return text.includes(query);
      }
    }

    return text.includes(query);
  }
};
