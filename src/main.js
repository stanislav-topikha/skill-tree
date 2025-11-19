// src/main.js

import { createCoreContext } from "./core/coreContext.js";
import { renderTree } from "./core/treeRenderer.js";
import { PluginHost } from "./core/pluginHost.js";
import { completionPlugin } from "./plugins/completionPlugin.js";
import { viewFilterPlugin } from "./plugins/viewFilterPlugin.js";
import { searchPlugin } from "./plugins/searchPlugin.js";
import { themePlugin } from "./plugins/themePlugin.js";
import { difficultyPlugin } from "./plugins/difficultyPlugin.js";

const ctx = createCoreContext();
const pluginHost = new PluginHost(ctx);

const treeContainer = document.getElementById("tree-container");
const coreControls = document.getElementById("core-controls");
const pluginControls = document.getElementById("plugin-controls");

ctx.requestRender = () => {
  renderTree(ctx, treeContainer, pluginHost);
};

ctx.onAspectsChanged = () => {
  ctx.requestRender();
};

(async function init() {
  const res = await fetch("./data/subject_js.json");
  const json = await res.json();

  ctx.setSubject(json.subject);

  json.subject.root.forEach((node) => {
    if (node.kind === "group") {
      ctx.expandedGroups.add(node.id);
    }
  });

  // register plugins (each modular, separate file)
  pluginHost.register(themePlugin);
  pluginHost.register(completionPlugin);
  pluginHost.register(viewFilterPlugin);
  pluginHost.register(searchPlugin);
  pluginHost.register(difficultyPlugin);

  pluginHost.initAll();
  pluginHost.notifySubjectLoaded();
  pluginHost.contributeControls(pluginControls);

  renderTree(ctx, treeContainer, pluginHost);

  coreControls.textContent = `Subject: ${json.subject.title}`;
})();
