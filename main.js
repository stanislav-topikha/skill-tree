// ----- Data: sections 00–04 of your JS map -----
// Extend with 05–19 by adding more top-level objects in this array.

const treeData = [
  {
    title: "00_mindset-and-setup",
    children: [
      {
        title: "environment-and-tools",
        children: [
          { title: "install-node-and-npm", difficulty: 1 },
          { title: "editor-setup-vscode-vim", difficulty: 1 },
          { title: "browser-devtools-basics", difficulty: 1 },
          { title: "running-js-browser-console-node-cli", difficulty: 1 }
        ]
      },
      {
        title: "project-basics",
        children: [
          { title: "package-json-basics", difficulty: 1 },
          { title: "npm-scripts-start-test-build", difficulty: 1 },
          { title: "basic-folder-structure", difficulty: 1 }
        ]
      },
      {
        title: "learning-habits",
        children: [
          { title: "how-to-read-mdn", difficulty: 1 },
          { title: "debugging-mindset-minimal-repro", difficulty: 1 },
          { title: "experiment-log-and-notes", difficulty: 1 }
        ]
      }
    ]
  },
  {
    title: "01_core-syntax-and-basics",
    children: [
      {
        title: "values-and-types",
        children: [
          { title: "primitive-overview", difficulty: 1 },
          { title: "numbers-nan-infinity", difficulty: 1 },
          { title: "strings-basics", difficulty: 1 },
          { title: "booleans-and-truthiness", difficulty: 1 },
          { title: "null-vs-undefined", difficulty: 1 },
          { title: "bigint", difficulty: 2 },
          { title: "symbol", difficulty: 2 }
        ]
      },
      {
        title: "variables-and-basic-scope",
        children: [
          { title: "var-let-const", difficulty: 1 },
          { title: "block-vs-global-scope", difficulty: 1 },
          { title: "naming-and-style-basics", difficulty: 1 }
        ]
      },
      {
        title: "operators",
        children: [
          {
            title: "arithmetic",
            children: [
              {
                title: "basic-arithmetic-plus-minus-times-divide-mod",
                difficulty: 1
              },
              { title: "exponentiation", difficulty: 1 },
              { title: "increment-decrement", difficulty: 1 }
            ]
          },
          {
            title: "assignment",
            children: [
              { title: "simple-assignment", difficulty: 1 },
              { title: "compound-assignment", difficulty: 1 },
              { title: "chained-assignment-pitfalls", difficulty: 2 }
            ]
          },
          {
            title: "comparison",
            children: [
              { title: "relational-less-greater", difficulty: 1 },
              {
                title: "equality-double-vs-triple-equals",
                difficulty: 1
              },
              { title: "weird-comparisons-null-nan", difficulty: 2 }
            ]
          },
          {
            title: "logical",
            children: [
              { title: "logical-and", difficulty: 1 },
              { title: "logical-or", difficulty: 1 },
              { title: "logical-not", difficulty: 1 },
              {
                title: "short-circuiting-as-control-flow",
                difficulty: 2
              }
            ]
          },
          {
            title: "nullish-and-ternary",
            children: [
              { title: "nullish-coalescing", difficulty: 2 },
              { title: "ternary-operator", difficulty: 1 },
              { title: "common-fallback-patterns", difficulty: 2 }
            ]
          },
          {
            title: "bitwise",
            children: [
              { title: "bitwise-basics", difficulty: 3 },
              { title: "bit-shifts", difficulty: 3 },
              { title: "bitmasks-and-flags", difficulty: 3 }
            ]
          }
        ]
      },
      {
        title: "control-flow",
        children: [
          { title: "if-else", difficulty: 1 },
          { title: "switch", difficulty: 1 },
          { title: "try-catch-finally", difficulty: 2 }
        ]
      },
      {
        title: "loops-and-iteration",
        children: [
          { title: "while-and-do-while", difficulty: 1 },
          { title: "for-loop-classic", difficulty: 1 },
          { title: "for-of", difficulty: 1 },
          { title: "for-in-when-to-avoid", difficulty: 2 },
          { title: "break-and-continue", difficulty: 1 }
        ]
      },
      {
        title: "basic-io-and-debugging",
        children: [
          { title: "console-log-warn-error", difficulty: 1 },
          { title: "reading-stack-traces", difficulty: 1 },
          { title: "alert-prompt-confirm", difficulty: 1 }
        ]
      }
    ]
  },
  {
    title: "02_data-and-collections",
    children: [
      {
        title: "objects",
        children: [
          { title: "object-literals", difficulty: 1 },
          {
            title: "read-update-delete-properties",
            difficulty: 1
          },
          { title: "computed-property-names", difficulty: 2 },
          { title: "nested-objects", difficulty: 2 },
          { title: "optional-chaining", difficulty: 2 },
          {
            title: "object-helpers-keys-values-entries",
            difficulty: 2
          }
        ]
      },
      {
        title: "arrays",
        children: [
          {
            title: "basics",
            children: [
              {
                title: "create-and-access-elements",
                difficulty: 1
              },
              {
                title: "length-and-sparse-arrays",
                difficulty: 2
              },
              {
                title: "iterating-for-and-forof",
                difficulty: 1
              }
            ]
          },
          {
            title: "mutating-methods",
            children: [
              { title: "push-pop", difficulty: 1 },
              { title: "shift-unshift", difficulty: 1 },
              { title: "splice", difficulty: 2 },
              {
                title: "sort-and-custom-compare",
                difficulty: 2
              }
            ]
          },
          {
            title: "non-mutating-methods",
            children: [
              { title: "slice", difficulty: 1 },
              { title: "concat", difficulty: 1 },
              {
                title: "toSorted-and-toReversed",
                difficulty: 2
              }
            ]
          },
          {
            title: "transform-and-search",
            children: [
              { title: "forEach", difficulty: 1 },
              { title: "map", difficulty: 2 },
              { title: "filter", difficulty: 2 },
              {
                title: "find-and-findIndex",
                difficulty: 2
              },
              { title: "some-and-every", difficulty: 2 },
              {
                title: "reduce-accumulator-pattern",
                difficulty: 2
              }
            ]
          },
          {
            title: "array-recipes",
            children: [
              { title: "grouping-by-field", difficulty: 2 },
              { title: "frequency-maps", difficulty: 2 },
              { title: "flat-and-flatMap", difficulty: 2 }
            ]
          }
        ]
      },
      {
        title: "maps-and-sets",
        children: [
          { title: "map-basics", difficulty: 2 },
          {
            title: "iterating-over-map",
            difficulty: 2
          },
          { title: "set-basics", difficulty: 2 },
          { title: "set-for-uniques", difficulty: 2 },
          {
            title: "weakmap-and-weakset",
            difficulty: 3
          }
        ]
      },
      {
        title: "other-builtins",
        children: [
          { title: "date-basics", difficulty: 2 },
          {
            title: "intl-number-and-date-format",
            difficulty: 3
          },
          {
            title: "json-parse-and-stringify",
            difficulty: 1
          },
          {
            title: "math-random-floor-round",
            difficulty: 1
          }
        ]
      },
      {
        title: "data-model-concepts",
        children: [
          { title: "value-vs-reference", difficulty: 1 },
          {
            title: "shallow-copy-spread-object-assign",
            difficulty: 2
          },
          {
            title: "deep-copy-structuredClone",
            difficulty: 2
          },
          {
            title: "immutability-and-object-freeze",
            difficulty: 2
          }
        ]
      }
    ]
  },
  {
    title: "03_functions-scope-and-closures",
    children: [
      {
        title: "function-forms",
        children: [
          { title: "function-declarations", difficulty: 1 },
          { title: "function-expressions", difficulty: 1 },
          { title: "arrow-functions", difficulty: 1 },
          {
            title: "choosing-a-function-form",
            difficulty: 2
          }
        ]
      },
      {
        title: "parameters-and-returns",
        children: [
          {
            title: "parameters-vs-arguments",
            difficulty: 1
          },
          { title: "default-parameters", difficulty: 1 },
          { title: "rest-parameters", difficulty: 2 },
          {
            title: "return-values-and-early-return",
            difficulty: 1
          },
          {
            title: "pure-vs-impure-functions",
            difficulty: 2
          }
        ]
      },
      {
        title: "scope",
        children: [
          { title: "lexical-scope", difficulty: 2 },
          {
            title: "scope-chain-lookups",
            difficulty: 2
          },
          {
            title: "function-scope-vs-block-scope",
            difficulty: 2
          }
        ]
      },
      {
        title: "closures",
        children: [
          {
            title: "closure-definition-and-mental-model",
            difficulty: 2
          },
          {
            title: "counters-and-state-via-closure",
            difficulty: 2
          },
          {
            title: "caching-and-memoization-via-closure",
            difficulty: 2
          },
          {
            title: "closures-in-loops-common-bug",
            difficulty: 2
          },
          {
            title: "module-pattern-with-closures",
            difficulty: 3
          }
        ]
      },
      {
        title: "functional-patterns",
        children: [
          {
            title: "functions-as-arguments",
            difficulty: 2
          },
          {
            title: "functions-returning-functions",
            difficulty: 2
          },
          {
            title: "higher-order-functions",
            difficulty: 2
          },
          { title: "currying", difficulty: 3 },
          {
            title: "function-composition-and-pipe",
            difficulty: 3
          }
        ]
      }
    ]
  },
  {
    title: "04_objects-prototypes-and-classes",
    children: [
      {
        title: "this-and-binding",
        children: [
          {
            title: "what-is-this-runtime-binding",
            difficulty: 2
          },
          {
            title: "this-in-methods-vs-plain-functions",
            difficulty: 2
          },
          {
            title: "arrow-functions-and-lexical-this",
            difficulty: 2
          },
          { title: "call-apply-bind", difficulty: 2 }
        ]
      },
      {
        title: "prototype-system",
        children: [
          { title: "prototype-and-__proto__", difficulty: 2 },
          {
            title: "prototype-chain-lookups",
            difficulty: 2
          },
          {
            title: "constructor-functions-and-new",
            difficulty: 2
          },
          { title: "object-create", difficulty: 2 }
        ]
      },
      {
        title: "classes",
        children: [
          { title: "class-syntax", difficulty: 2 },
          {
            title: "instance-fields-and-methods",
            difficulty: 2
          },
          { title: "static-methods", difficulty: 2 },
          {
            title: "inheritance-and-super",
            difficulty: 2
          },
          {
            title: "composition-vs-inheritance",
            difficulty: 3
          }
        ]
      },
      {
        title: "meta-programming",
        children: [
          { title: "getters-and-setters", difficulty: 2 },
          { title: "proxy-basics", difficulty: 3 },
          { title: "reflect-api", difficulty: 3 }
        ]
      }
    ]
  }
];

// ----- State + helpers -----

const STORAGE_KEY = "jsLearningTree_completed_v1";

const state = {
  search: "",
  difficultyFilter: new Set([1, 2, 3, 4]),
  showDifficulties: true,
  hideCompleted: false,
  completedIds: new Set(),
  expandedNodes: new Set() // <- tracks open branches by node.id
};

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

// ----- leaf-descendant helpers (for default expansion) -----

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

// ----- Filtering -----

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

    // If this node itself doesn't match and has no visible children -> drop it
    if (!selfVisible && children.length === 0) {
      return null;
    }

    // Keep node, with filtered children. View structure (expanded/collapsed)
    // is controlled separately via state.expandedNodes.
    return { ...node, children };
  }

  return nodes.map(filterNode).filter(Boolean);
}

// ----- Rendering -----

const treeRootEl = document.getElementById("tree-root");
const treeContainerEl = document.getElementById("tree");

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
    // text set after we know expanded state
    toggleBtn.addEventListener("click", () => {
      const currentlyExpanded = state.expandedNodes.has(node.id);
      if (currentlyExpanded) {
        state.expandedNodes.delete(node.id);
      } else {
        state.expandedNodes.add(node.id);
      }
      // re-render so filter view stays, only openness changes
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
        // hide-completed = filtering; remove endpoints, not reshaping openness
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
  badge.dataset.level = String(node.difficulty); // <-- add this
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

// ----- Wiring controls -----

assignIds(treeData);
loadCompleted();
initExpandedDefaults(treeData); // all branches that have any leaf endpoints start expanded
treeContainerEl.dataset.showDifficulty = "on";

const searchInput = document.getElementById("searchInput");
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

const toggleDifficulty = document.getElementById("toggleDifficulty");
toggleDifficulty.addEventListener("change", () => {
  state.showDifficulties = toggleDifficulty.checked;
  treeContainerEl.dataset.showDifficulty = state.showDifficulties ? "on" : "off";
});

const toggleHideCompleted = document.getElementById("toggleHideCompleted");
toggleHideCompleted.addEventListener("change", () => {
  state.hideCompleted = toggleHideCompleted.checked;
  renderTree();
});

// Expand / collapse all work by updating state.expandedNodes,
// then re-rendering. Filtered view stays; only empty branches disappear.

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

document.getElementById("expandAllBtn").addEventListener("click", () => {
  setAllExpanded(true);
});

document.getElementById("collapseAllBtn").addEventListener("click", () => {
  setAllExpanded(false);
});

// Initial render
renderTree();
