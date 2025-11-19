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

  // endpoints: ask plugins if visible
  if (isEndpoint && pluginHost) {
    if (!pluginHost.isEndpointVisible(node)) return null;
  }

  let visibleChildLis = [];

  if (isGroup && node.children && node.children.length > 0) {
    visibleChildLis = node.children
      .map((child) => renderNode(ctx, child, pluginHost))
      .filter(Boolean);

    // no visible children => hide this branch
    if (visibleChildLis.length === 0) return null;
  }

  const li = document.createElement("li");
  li.className = "tree-node";

  const row = document.createElement("div");
  row.className = "node-row";
  row.tabIndex = 0;
  row.dataset.nodeId = node.id;
  row.dataset.kind = node.kind;

  if (isGroup) {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "toggle-btn";
    btn.dataset.groupId = node.id;

    const expanded = ctx.expandedGroups.has(node.id);
    btn.textContent = expanded ? "▾" : "▸";

    btn.addEventListener("click", () => {
      const currentlyExpanded = ctx.expandedGroups.has(node.id);
      ctx.setGroupExpanded(node.id, !currentlyExpanded);

      const container = li.closest("#tree-container");
      if (container) {
        renderTree(ctx, container, pluginHost);
      }
    });

    row.appendChild(btn);
  } else {
    const spacer = document.createElement("span");
    spacer.style.display = "inline-block";
    spacer.style.width = "var(--label-spacing)";
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

  if (isGroup && visibleChildLis.length > 0) {
    const expanded = ctx.expandedGroups.has(node.id);
    if (expanded) {
      const ul = document.createElement("ul");
      visibleChildLis.forEach((childLi) => ul.appendChild(childLi));
      li.appendChild(ul);
    }
  }

  return li;
}
