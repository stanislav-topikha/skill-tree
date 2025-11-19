// notesPlugin: allow adding a short note per endpoint (stored in aspects/localStorage)

export const notesPlugin = {
  id: "notes",
  name: "Notes",

  onInit(ctx) {},
  onSubjectLoaded(subject, ctx) {},

  contributeControls(containerEl, ctx) {
    // no global controls; notes live on each endpoint row
  },

  decorateNode(rowEl, node, ctx) {
    if (!ctx.isEndpoint(node)) return;

    const aspect = ctx.getAspect(node.id);

    const formatTimestamp = (ts) => {
      if (!ts) return "";
      const d = new Date(ts);
      const pad = (n) => String(n).padStart(2, "0");
      return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(
        d.getDate()
      )} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
    };

    const ensureNotes = () => {
      const a = ctx.getAspect(node.id);
      const raw = Array.isArray(a.notes)
        ? a.notes
        : typeof a.note === "string"
          ? [a.note]
          : [];
      const normalized = raw
        .map((entry) => {
          if (typeof entry === "string") {
            const text = entry.trim();
            if (!text) return null;
            return { id: crypto.randomUUID ? crypto.randomUUID() : `n_${Date.now()}_${Math.random().toString(16).slice(2)}`, text, ts: Date.now() };
          }
          if (entry && typeof entry.text === "string") {
            const text = entry.text.trim();
            if (!text) return null;
            return {
              id:
                entry.id ||
                (crypto.randomUUID
                  ? crypto.randomUUID()
                  : `n_${Date.now()}_${Math.random().toString(16).slice(2)}`),
              text,
              ts: entry.ts || Date.now()
            };
          }
          return null;
        })
        .filter(Boolean);

      // Persist normalized shape if required
      const needsPersist =
        !Array.isArray(a.notes) ||
        a.notes.length !== normalized.length ||
        normalized.some((n, i) => {
          const orig = a.notes && a.notes[i];
          return !orig || orig.text !== n.text || orig.id !== n.id || orig.ts !== n.ts;
        });

      if (needsPersist) {
        ctx.updateAspect(
          node.id,
          { notes: normalized, note: undefined },
          { skipRender: true }
        );
      }

      return normalized;
    };

    const getNotes = () => ensureNotes();

    const wrapper = document.createElement("div");
    wrapper.className = "note-wrapper";

    const btn = document.createElement("button");
    btn.type = "button";
    btn.textContent = "Notes";
    btn.title = "Add notes";
    btn.className = "note-btn";

    const pop = document.createElement("div");
    pop.className = "note-popover";

    const list = document.createElement("div");
    list.className = "note-list";

    const renderList = () => {
      const notes = getNotes();
      list.innerHTML = "";
      if (notes.length === 0) {
        const empty = document.createElement("div");
        empty.className = "note-empty";
        empty.textContent = "No notes yet.";
        list.appendChild(empty);
        return;
      }
      notes.forEach((msg, idx) => {
        const item = document.createElement("div");
        item.className = "note-item";
        const text = document.createElement("div");
        text.className = "note-text";
        text.textContent = msg.text;
        const meta = document.createElement("div");
        meta.className = "note-meta";
        meta.textContent = formatTimestamp(msg.ts);
        const del = document.createElement("button");
        del.type = "button";
        del.className = "note-delete";
        del.textContent = "x";
        del.title = "Delete message";
        del.addEventListener("click", (e) => {
          e.stopPropagation();
          const updated = getNotes().filter((_, i) => i !== idx);
          const payload =
            updated.length === 0
              ? { notes: undefined, note: undefined }
              : { notes: updated, note: undefined };
          ctx.updateAspect(node.id, payload, { skipRender: true });
          renderList();
          updateButtonState();
          if (ctx.toast) ctx.toast("Note deleted");
        });
        item.appendChild(text);
        item.appendChild(meta);
        item.appendChild(del);
        list.appendChild(item);
      });
    };

    const textarea = document.createElement("textarea");
    textarea.className = "note-input";
    textarea.placeholder = "New message...";
    textarea.value = "";

    const actions = document.createElement("div");
    actions.className = "note-actions";

    const addBtn = document.createElement("button");
    addBtn.type = "button";
    addBtn.textContent = "Add";

    const clearBtn = document.createElement("button");
    clearBtn.type = "button";
    clearBtn.textContent = "Clear all";

    actions.appendChild(addBtn);
    actions.appendChild(clearBtn);
    pop.appendChild(list);
    pop.appendChild(textarea);
    pop.appendChild(actions);

    const updateButtonState = () => {
      const notes = getNotes();
      btn.textContent = notes.length > 0 ? `Notes (${notes.length})` : "Notes";
      btn.title =
        notes.length > 0 ? notes.map((n) => n.text).join("\n") : "Add notes";
    };

    const closePopover = () => {
      wrapper.classList.remove("open");
      document.removeEventListener("click", documentListener);
    };

    const documentListener = (e) => {
      if (!wrapper.contains(e.target)) {
        closePopover();
      }
    };

    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      const alreadyOpen = wrapper.classList.contains("open");
      if (alreadyOpen) {
        closePopover();
      } else {
        const current = getNotes();
        textarea.value = "";
        renderList();
        wrapper.classList.add("open");
        document.addEventListener("click", documentListener);
        textarea.focus();
      }
    });

    addBtn.addEventListener("click", () => {
      const msg = textarea.value.trim();
      if (!msg) return;
      const next = [
        ...getNotes(),
        {
          id: crypto.randomUUID
            ? crypto.randomUUID()
            : `n_${Date.now()}_${Math.random().toString(16).slice(2)}`,
          text: msg,
          ts: Date.now()
        }
      ];
      ctx.updateAspect(node.id, { notes: next, note: undefined }, { skipRender: true });
      textarea.value = "";
      renderList();
      updateButtonState();
      textarea.focus();
      if (ctx.toast) ctx.toast("Note saved");
    });

    clearBtn.addEventListener("click", () => {
      textarea.value = "";
      ctx.updateAspect(node.id, { notes: undefined, note: undefined }, { skipRender: true });
      renderList();
      updateButtonState();
      textarea.focus();
      if (ctx.toast) ctx.toast("Notes cleared");
    });

    pop.addEventListener("click", (e) => {
      e.stopPropagation();
    });

    wrapper.appendChild(btn);
    wrapper.appendChild(pop);
    rowEl.appendChild(wrapper);

    renderList();
    updateButtonState();
  }
};
