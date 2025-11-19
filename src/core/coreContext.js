const ASPECTS_STORAGE_KEY = "js_knowledge_aspects_v1";
const EXPANDED_STORAGE_PREFIX = "js_knowledge_expanded_";

function loadAspects(defaultAspects = {}) {
  // Start with defaults (e.g., preloaded difficulty), then overlay any stored values.
  try {
    const raw = localStorage.getItem(ASPECTS_STORAGE_KEY);
    if (!raw) return { ...defaultAspects };
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed === "object") {
      return { ...defaultAspects, ...parsed };
    }
  } catch (_) {}
  return { ...defaultAspects };
}

function saveAspects(aspects) {
  try {
    localStorage.setItem(ASPECTS_STORAGE_KEY, JSON.stringify(aspects));
  } catch (_) {}
}

function loadExpanded(subjectId) {
  if (!subjectId) return { expandedSet: new Set(), hasSaved: false };

  try {
    const raw = localStorage.getItem(EXPANDED_STORAGE_PREFIX + subjectId);
    if (raw === null) return { expandedSet: new Set(), hasSaved: false };

    const arr = JSON.parse(raw);
    if (Array.isArray(arr)) {
      return { expandedSet: new Set(arr), hasSaved: true };
    }
  } catch (_) {}

  return { expandedSet: new Set(), hasSaved: false };
}

function saveExpanded(subjectId, expandedSet) {
  if (!subjectId) return;
  try {
    const arr = Array.from(expandedSet);
    localStorage.setItem(
      EXPANDED_STORAGE_PREFIX + subjectId,
      JSON.stringify(arr)
    );
  } catch (_) {}
}

export function createCoreContext(defaultAspects = {}) {
  const ctx = {
    subject: null,
    aspects: loadAspects(defaultAspects),
    expandedGroups: new Set(),

    onAspectsChanged: null,
    requestRender: null,

    setSubject(subject) {
      this.subject = subject;

      // load expanded groups for this subject
      const { expandedSet, hasSaved } = loadExpanded(subject.id);
      this.expandedGroups = expandedSet;

      // first time: expand all top-level groups by default
      if (!hasSaved && this.expandedGroups.size === 0 && subject.root) {
        subject.root.forEach((node) => {
          if (node.kind === "group") {
            this.expandedGroups.add(node.id);
          }
        });
      }

      this._persistExpanded();
    },

    _persistExpanded() {
      if (!this.subject) return;
      saveExpanded(this.subject.id, this.expandedGroups);
    },

    setGroupExpanded(groupId, expanded) {
      if (expanded) this.expandedGroups.add(groupId);
      else this.expandedGroups.delete(groupId);
      this._persistExpanded();
    },

    setAllGroupsExpanded(expanded) {
      if (!this.subject || !this.subject.root) return;

      this.expandedGroups.clear();

      if (expanded) {
        const walk = (nodes) => {
          nodes.forEach((n) => {
            if (n.kind === "group") {
              this.expandedGroups.add(n.id);
              if (n.children && n.children.length > 0) {
                walk(n.children);
              }
            }
          });
        };
        walk(this.subject.root);
      }

      this._persistExpanded();
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

    updateAspect(endpointId, patch, options = {}) {
      const prev = this.aspects[endpointId] || {};
      const next = { ...prev, ...patch };
      this.aspects[endpointId] = next;
      saveAspects(this.aspects);

      if (!options.skipRender && typeof this.onAspectsChanged === "function") {
        this.onAspectsChanged(endpointId, next);
      }
    }
  };

  return ctx;
}
