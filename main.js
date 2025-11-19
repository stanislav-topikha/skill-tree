// main.js

// ---- Global data + state ----

let treeData = []; // loaded from tree-data.json

const STORAGE_KEY = "jsLearningTree_completed_v1";

const state = {
  search: "",
  difficultyFilter: new Set([1, 2, 3, 4]),
  showDifficulties: true,
  hideCompleted: false,
  completedIds: new Set(),
  expandedNodes: new Set() // tracks which branches are open
};

// ---- DOM references ----

const treeRootEl = document.getElementById("tree-root");
const treeContainerEl = document.getElementById("tree");
const searchInput = document.getElementById("searchInput");
const toggleDifficulty = document.getElementById("toggleDifficulty");
const toggleHideCompleted = document.getElementById("toggleHideCompleted");
const expandAllBtn = document.getElementById("expandAllBtn");
const collapseAllBtn = document.getElementById("collapseAllBtn");

// ---- Helpers ----

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function assignIds(nodes, parentId = "") {
  nodes.forEach((node) => {
    const slug = slugify(node.title);
    node.id = parentId ? `${parentId}>${slug}` : slug;
    if (node.children && node.children.length > 0) {
      assignIds(node.children, node.id);
    }
  });
}

function loadCompleted() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return;
    const arr = JSON.parse(raw);
    state.completedIds = new Set(arr);
  } catch (e) {
    // ignore
  }
}

function saveCompleted() {
  try {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(Array.from(state.completedIds))
    );
  } catch (e) {
    // ignore
  }
}

function isLeaf(node) {
  return !node.children || node.children.length === 0;
}

function isCompleted(id) {
  return state.completedIds.has(id);
}

function toggleCompleted(id, completed) {
  if (completed) {
    state.completedIds.add(id);
  } else {
    state.completedIds.delete(id);
  }
  saveCompleted();
}

function prettifyTitle(str) {
  return str.replace(/-/g, " ");
}

// ---- Leaf-descendant helpers (for default expansion) ----

function hasLeafDescendant(node) {
  if (isLeaf(node) && typeof node.difficulty === "number") return true;
  if (!node.children || node.children.length === 0) return false;
  return node.children.some((child) => hasLeafDescendant(child));
}

function initExpandedDefaults(nodes) {
  nodes.forEach((node) => {
    if (node.children && node.children.length > 0) {
      if (hasLeafDescendant(node)) {
        state.expandedNodes.add(node.id);
      }
      initExpandedDefaults(node.children);
    }
  });
}

// ---- Filtering ----

function filterTree(nodes) {
  const q = state.search.trim().toLowerCase();
  const selectedDiffs = state.difficultyFilter;

  function filterNode(node) {
    let children = [];
    if (node.children && node.children.length) {
      children = node.children.map(filterNode).filter(Boolean);
    }

    const title = node.title.toLowerCase();
    const matchesText = !q || title.includes(q);

    const leaf = isLeaf(node);
    const hasDiff = typeof node.difficulty === "number";

    const matchesDiff =
      !hasDiff ||
      selectedDiffs.size === 0 ||
      selectedDiffs.has(node.difficulty);

    const completedAndHidden =
      leaf && hasDiff && state.hideCompleted && isCompleted(node.id);

    const selfVisible = matchesText && matchesDiff && !completedAndHidden;

    // No empty branches:
    // - leaf: must be visible itself
    // - branch: must still have at least one visible child (endpoint somewhere below)
    if (leaf) {
      if (!selfVisible) return null;
    } else {
      if (children.length === 0) return null;
    }

    return { ...node, children };
  }

  return nodes.map(filterNode).filter(Boolean);
}


// ---- Rendering ----

function renderTree() {
  const filtered = filterTree(treeData);
  treeRootEl.innerHTML = "";
  filtered.forEach((node) => {
    treeRootEl.appendChild(renderNode(node));
  });
}

function renderNode(node) {
  const li = document.createElement("li");
  li.className = "tree-node";

  const row = document.createElement("div");
  row.className = "node-row";

  const hasChildren = node.children && node.children.length > 0;
  const leaf = isLeaf(node);
  const hasDiff = typeof node.difficulty === "number";

  let toggleBtn = null;

  if (hasChildren) {
    toggleBtn = document.createElement("button");
    toggleBtn.type = "button";
    toggleBtn.className = "toggle-btn";
    toggleBtn.addEventListener("click", () => {
      const currentlyExpanded = state.expandedNodes.has(node.id);
      if (currentlyExpanded) {
        state.expandedNodes.delete(node.id);
      } else {
        state.expandedNodes.add(node.id);
      }
      renderTree();
    });
    row.appendChild(toggleBtn);
  } else {
    const bullet = document.createElement("span");
    bullet.className = "bullet";
    bullet.textContent = "•";
    row.appendChild(bullet);
  }

  const label = document.createElement("label");
  label.className = "node-label";

  if (leaf && hasDiff) {
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.className = "complete-checkbox";
    checkbox.checked = isCompleted(node.id);
    checkbox.addEventListener("change", () => {
      toggleCompleted(node.id, checkbox.checked);
      if (state.hideCompleted) {
        renderTree();
      } else {
        if (checkbox.checked) {
          label.classList.add("completed");
        } else {
          label.classList.remove("completed");
        }
      }
    });
    label.appendChild(checkbox);

    if (checkbox.checked) {
      label.classList.add("completed");
    }
  }

  const titleSpan = document.createElement("span");
  titleSpan.className = "node-title";
  titleSpan.textContent = prettifyTitle(node.title);
  label.appendChild(titleSpan);

  if (hasDiff) {
    const badge = document.createElement("span");
    badge.className = "difficulty-badge";
    badge.textContent = `[${node.difficulty}]`;
    badge.dataset.level = String(node.difficulty);
    label.appendChild(badge);
  }

  row.appendChild(label);
  li.appendChild(row);

  if (hasChildren) {
    const ul = document.createElement("ul");
    ul.className = "children";

    const expanded = state.expandedNodes.has(node.id);
    if (!expanded) {
      ul.classList.add("collapsed");
      if (toggleBtn) toggleBtn.textContent = "▸";
    } else {
      if (toggleBtn) toggleBtn.textContent = "▾";
    }

    node.children.forEach((child) => {
      ul.appendChild(renderNode(child));
    });
    li.appendChild(ul);
  }

  return li;
}

// ---- Controls wiring ----

searchInput.addEventListener("input", (e) => {
  state.search = e.target.value;
  renderTree();
});

document.querySelectorAll(".diff-chip").forEach((btn) => {
  const level = Number(btn.dataset.diff);
  btn.addEventListener("click", () => {
    if (state.difficultyFilter.has(level)) {
      state.difficultyFilter.delete(level);
      btn.classList.remove("active");
    } else {
      state.difficultyFilter.add(level);
      btn.classList.add("active");
    }
    renderTree();
  });
});

toggleDifficulty.addEventListener("change", () => {
  state.showDifficulties = toggleDifficulty.checked;
  treeContainerEl.dataset.showDifficulty = state.showDifficulties ? "on" : "off";
});

toggleHideCompleted.addEventListener("change", () => {
  state.hideCompleted = toggleHideCompleted.checked;
  renderTree();
});

function setAllExpanded(expanded) {
  state.expandedNodes = new Set();
  if (expanded) {
    (function walk(nodes) {
      nodes.forEach((n) => {
        if (n.children && n.children.length > 0) {
          state.expandedNodes.add(n.id);
          walk(n.children);
        }
      });
    })(treeData);
  }
  renderTree();
}

expandAllBtn.addEventListener("click", () => {
  setAllExpanded(true);
});

collapseAllBtn.addEventListener("click", () => {
  setAllExpanded(false);
});

// ---- Init after JSON load ----

function initApp(loadedData) {
  treeData = loadedData;
  assignIds(treeData);
  loadCompleted();
  initExpandedDefaults(treeData); // expand branches that have any leaves
  treeContainerEl.dataset.showDifficulty = "on";
  renderTree();
}

fetch("tree-data.json")
  .then((res) => {
    if (!res.ok) throw new Error("Failed to load tree-data.json");
    return res.json();
  })
  .then((json) => {
    initApp(json);
  })
  .catch((err) => {
    console.error(err);
    treeRootEl.innerHTML =
      '<li class="tree-node">ERROR: could not load tree-data.json</li>';
  });
