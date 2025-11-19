// src/core/coreContext.js

const ASPECTS_STORAGE_KEY = "js_knowledge_aspects_v1";

function loadAspects() {
  try {
    const raw = localStorage.getItem(ASPECTS_STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed === "object") return parsed;
  } catch (_) {}
  return {};
}

function saveAspects(aspects) {
  try {
    localStorage.setItem(
      ASPECTS_STORAGE_KEY,
      JSON.stringify(aspects)
    );
  } catch (_) {}
}

export function createCoreContext() {
  const ctx = {
    subject: null,
    aspects: loadAspects(),
    expandedGroups: new Set(),

    onAspectsChanged: null,
    requestRender: null,

    setSubject(subject) {
      this.subject = subject;
    },

    isGroup(node) {
      return node.kind === "group";
    },

    isEndpoint(node) {
      return node.kind === "endpoint";
    },

    getAspect(endpointId) {
      return this.aspects[endpointId] || {};
    },

    updateAspect(endpointId, patch) {
      const prev = this.aspects[endpointId] || {};
      const next = { ...prev, ...patch };
      this.aspects[endpointId] = next;
      saveAspects(this.aspects);

      if (typeof this.onAspectsChanged === "function") {
        this.onAspectsChanged(endpointId, next);
      }
    }
  };

  return ctx;
}
