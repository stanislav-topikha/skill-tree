export class PluginHost {
  constructor(ctx) {
    this.ctx = ctx;
    this.plugins = [];
  }

  register(plugin) {
    this.plugins.push(plugin);
  }

  initAll() {
    for (const p of this.plugins) {
      if (typeof p.onInit === "function") {
        p.onInit(this.ctx);
      }
    }
  }

  notifySubjectLoaded() {
    for (const p of this.plugins) {
      if (typeof p.onSubjectLoaded === "function") {
        p.onSubjectLoaded(this.ctx.subject, this.ctx);
      }
    }
  }

  decorateNode(rowEl, node) {
    for (const p of this.plugins) {
      if (typeof p.decorateNode === "function") {
        p.decorateNode(rowEl, node, this.ctx);
      }
    }
  }

  contributeControls(containerEl) {
    for (const p of this.plugins) {
      if (typeof p.contributeControls === "function") {
        p.contributeControls(containerEl, this.ctx);
      }
    }
  }

  // AND-combine all endpoint filters
  isEndpointVisible(node) {
    let visible = true;
    for (const p of this.plugins) {
      if (typeof p.filterEndpoint === "function") {
        const res = p.filterEndpoint(node, this.ctx);
        if (res === false) visible = false;
      }
    }
    return visible;
  }
}
