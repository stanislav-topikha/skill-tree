// src/core/treeRenderer.js

export function renderTree(ctx, containerEl, pluginHost) {
  containerEl.innerHTML = "";

  if (!ctx.subject || !ctx.subject.root) {
    containerEl.textContent = "No subject loaded.";
    return;
  }

  const rootUl = document.createElement("ul");
  rootUl.className = "tree-root";

  ctx.subject.root.forEach((node) => {
    const li = renderNode(ctx, node, pluginHost);
    if (li) rootUl.appendChild(li);
  });

  containerEl.appendChild(rootUl);
}

function renderNode(ctx, node, pluginHost) {
  const isGroup = ctx.isGroup(node);
  const isEndpoint = ctx.isEndpoint(node);

  if (isEndpoint && pluginHost) {
    if (!pluginHost.isEndpointVisible(node)) return null;
  }

  const li = document.createElement("li");
  li.className = "tree-node";

  const row = document.createElement("div");
  row.className = "node-row";

  if (isGroup) {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "toggle-btn";
    const expanded = ctx.expandedGroups.has(node.id);
    btn.textContent = expanded ? "▾" : "▸";

    btn.addEventListener("click", () => {
      if (ctx.expandedGroups.has(node.id)) {
        ctx.expandedGroups.delete(node.id);
      } else {
        ctx.expandedGroups.add(node.id);
      }
      const container = li.closest("#tree-container");
      if (container) {
        renderTree(ctx, container, pluginHost);
      }
    });

    row.appendChild(btn);
  } else {
    const spacer = document.createElement("span");
    spacer.style.display = "inline-block";
    spacer.style.width = "16px";
    row.appendChild(spacer);
  }

  const label = document.createElement("span");
  label.className = `node-label ${node.kind}`;
  label.textContent = node.label || node.title;
  row.appendChild(label);

  if (pluginHost) {
    pluginHost.decorateNode(row, node);
  }

  li.appendChild(row);

  if (isGroup && node.children && node.children.length > 0) {
    const expanded = ctx.expandedGroups.has(node.id);
    if (expanded) {
      const ul = document.createElement("ul");
      node.children.forEach((child) => {
        const childLi = renderNode(ctx, child, pluginHost);
        if (childLi) ul.appendChild(childLi);
      });

      if (ul.children.length === 0) return null; // hide empty branch

      li.appendChild(ul);
    }
  }

  return li;
}
