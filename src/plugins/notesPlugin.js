// notesPlugin: allow adding notes, tasks, and theory items per endpoint (stored in aspects/localStorage)

export const notesPlugin = {
  id: "notes",
  name: "Notes",

  onInit(ctx) {},
  onSubjectLoaded(subject, ctx) {},

  contributeControls(containerEl, ctx) {
    // no global controls; tasks/notes/theory live on each endpoint row
  },

  decorateNode(rowEl, node, ctx) {
    if (!ctx.isEndpoint(node)) return;

    const formatTimestamp = (ts) => {
      if (!ts) return "";
      const d = new Date(ts);
      const pad = (n) => String(n).padStart(2, "0");
      return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(
        d.getDate()
      )} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
    };

    const ensureNotes = () => {
      const a = ctx.getAspect(node.id) || {};
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
            return {
              id: crypto.randomUUID
                ? crypto.randomUUID()
                : `n_${Date.now()}_${Math.random().toString(16).slice(2)}`,
              text,
              ts: Date.now()
            };
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

    const ensureTasks = () => {
      const a = ctx.getAspect(node.id) || {};
      const raw = Array.isArray(a.tasks) ? a.tasks : [];
      const normalized = raw
        .map((t) => {
          if (!t || !t.text) return null;
          return {
            id:
              t.id ||
              (crypto.randomUUID
                ? crypto.randomUUID()
                : `t_${Date.now()}_${Math.random().toString(16).slice(2)}`),
            text: String(t.text),
            done: !!t.done
          };
        })
        .filter(Boolean);

      if (
        !Array.isArray(a.tasks) ||
        a.tasks.length !== normalized.length ||
        normalized.some(
          (t, i) =>
            t.id !== a.tasks?.[i]?.id ||
            t.text !== a.tasks?.[i]?.text ||
            t.done !== a.tasks?.[i]?.done
        )
      ) {
        ctx.updateAspect(node.id, { tasks: normalized }, { skipRender: true });
      }

      return normalized;
    };

    const ensureTheory = () => {
      const a = ctx.getAspect(node.id) || {};
      const raw = Array.isArray(a.theory) ? a.theory : [];
      const normalized = raw
        .map((t) => {
          if (!t || !t.text) return null;
          return {
            id:
              t.id ||
              (crypto.randomUUID
                ? crypto.randomUUID()
                : `h_${Date.now()}_${Math.random().toString(16).slice(2)}`),
            text: String(t.text),
            done: !!t.done
          };
        })
        .filter(Boolean);

      if (
        !Array.isArray(a.theory) ||
        a.theory.length !== normalized.length ||
        normalized.some(
          (t, i) =>
            t.id !== a.theory?.[i]?.id ||
            t.text !== a.theory?.[i]?.text ||
            t.done !== a.theory?.[i]?.done
        )
      ) {
        ctx.updateAspect(node.id, { theory: normalized }, { skipRender: true });
      }

      return normalized;
    };

    const getNotes = () => ensureNotes();
    const getTasks = () => ensureTasks();
    const getTheory = () => ensureTheory();

    const renderTextWithLinks = (text) => {
      const frag = document.createDocumentFragment();
      const urlRegex = /(https?:\/\/[^\s]+)/gi;
      let lastIndex = 0;
      let match;
      while ((match = urlRegex.exec(text)) !== null) {
        const { index } = match;
        if (index > lastIndex) {
          frag.appendChild(
            document.createTextNode(text.slice(lastIndex, index))
          );
        }
        const url = match[0];
        const link = document.createElement("a");
        link.href = url;
        link.target = "_blank";
        link.rel = "noopener noreferrer";
        link.textContent = url;
        frag.appendChild(link);
        lastIndex = index + url.length;
      }
      if (lastIndex < text.length) {
        frag.appendChild(document.createTextNode(text.slice(lastIndex)));
      }
      return frag;
    };

    const wrapper = document.createElement("div");
    wrapper.className = "note-wrapper";

    const btn = document.createElement("button");
    btn.type = "button";
    btn.textContent = "Notes";
    btn.title = "Add notes";
    btn.className = "note-btn";

    const pop = document.createElement("div");
    pop.className = "note-popover";

    // Tasks section (will live on the right side)
    const taskSection = document.createElement("div");
    taskSection.className = "task-section";

    const taskTitle = document.createElement("div");
    taskTitle.className = "task-title";
    taskTitle.textContent = "Tasks";

    const taskList = document.createElement("div");
    taskList.className = "task-list";

    const taskInputRow = document.createElement("div");
    taskInputRow.className = "task-input-row";

    const taskInput = document.createElement("input");
    taskInput.type = "text";
    taskInput.placeholder = "New task...";
    taskInput.className = "task-input";

    const taskAddBtn = document.createElement("button");
    taskAddBtn.type = "button";
    taskAddBtn.textContent = "Add";
    taskAddBtn.className = "task-add";

    taskInputRow.appendChild(taskInput);
    taskInputRow.appendChild(taskAddBtn);
    taskSection.appendChild(taskTitle);
    taskSection.appendChild(taskList);
    taskSection.appendChild(taskInputRow);

    // Theory section (right side, bottom)
    const theorySection = document.createElement("div");
    theorySection.className = "theory-section";

    const theoryTitle = document.createElement("div");
    theoryTitle.className = "task-title";
    theoryTitle.textContent = "Theory";

    const theoryList = document.createElement("div");
    theoryList.className = "task-list theory-list";

    const theoryInputRow = document.createElement("div");
    theoryInputRow.className = "task-input-row";

    const theoryInput = document.createElement("input");
    theoryInput.type = "text";
    theoryInput.placeholder = "New theory item...";
    theoryInput.className = "task-input";

    const theoryAddBtn = document.createElement("button");
    theoryAddBtn.type = "button";
    theoryAddBtn.textContent = "Add";
    theoryAddBtn.className = "task-add";

    theoryInputRow.appendChild(theoryInput);
    theoryInputRow.appendChild(theoryAddBtn);
    theorySection.appendChild(theoryTitle);
    theorySection.appendChild(theoryList);
    theorySection.appendChild(theoryInputRow);

    // Notes section (left side)
    const noteSection = document.createElement("div");
    noteSection.className = "note-section";

    const noteTitle = document.createElement("div");
    noteTitle.className = "task-title";
    noteTitle.textContent = "Notes";

    const list = document.createElement("div");
    list.className = "note-list";

    const renderTasks = () => {
      const tasks = getTasks();
      taskList.innerHTML = "";
      if (tasks.length === 0) {
        const empty = document.createElement("div");
        empty.className = "task-empty";
        empty.textContent = "No tasks yet.";
        taskList.appendChild(empty);
        return;
      }

      tasks.forEach((task) => {
        const item = document.createElement("div");
        item.className = "task-item";
        if (task.done) item.classList.add("done");

        const box = document.createElement("input");
        box.type = "checkbox";
        box.checked = task.done;
        box.className = "task-checkbox";
        box.addEventListener("click", (e) => e.stopPropagation());
        box.addEventListener("change", (e) => {
          e.stopPropagation();
          const updated = getTasks().map((t) =>
            t.id === task.id ? { ...t, done: box.checked } : t
          );
          ctx.updateAspect(node.id, { tasks: updated }, { skipRender: true });
          renderTasks();
          updateButtonState();
        });

        const label = document.createElement("span");
        label.className = "task-label";
        label.appendChild(renderTextWithLinks(task.text));

        const del = document.createElement("button");
        del.type = "button";
        del.className = "task-delete";
        del.textContent = "x";
        del.title = "Delete task";
        del.addEventListener("click", (e) => {
          e.stopPropagation();
          const updated = getTasks().filter((t) => t.id !== task.id);
          ctx.updateAspect(node.id, { tasks: updated }, { skipRender: true });
          renderTasks();
          updateButtonState();
        });

        item.appendChild(box);
        item.appendChild(label);
        item.appendChild(del);
        taskList.appendChild(item);
      });
    };

    const renderTheory = () => {
      const items = getTheory();
      theoryList.innerHTML = "";
      if (items.length === 0) {
        const empty = document.createElement("div");
        empty.className = "task-empty";
        empty.textContent = "No theory yet.";
        theoryList.appendChild(empty);
        return;
      }

      items.forEach((th) => {
        const item = document.createElement("div");
        item.className = "task-item";
        if (th.done) item.classList.add("done");

        const box = document.createElement("input");
        box.type = "checkbox";
        box.checked = th.done;
        box.className = "task-checkbox";
        box.addEventListener("click", (e) => e.stopPropagation());
        box.addEventListener("change", (e) => {
          e.stopPropagation();
          const updated = getTheory().map((t) =>
            t.id === th.id ? { ...t, done: box.checked } : t
          );
          ctx.updateAspect(node.id, { theory: updated }, { skipRender: true });
          renderTheory();
          updateButtonState();
        });

        const label = document.createElement("span");
        label.className = "task-label";
        label.appendChild(renderTextWithLinks(th.text));

        const del = document.createElement("button");
        del.type = "button";
        del.className = "task-delete";
        del.textContent = "x";
        del.title = "Delete theory item";
        del.addEventListener("click", (e) => {
          e.stopPropagation();
          const updated = getTheory().filter((t) => t.id !== th.id);
          ctx.updateAspect(node.id, { theory: updated }, { skipRender: true });
          renderTheory();
          updateButtonState();
        });

        item.appendChild(box);
        item.appendChild(label);
        item.appendChild(del);
        theoryList.appendChild(item);
      });
    };

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
        text.appendChild(renderTextWithLinks(msg.text));
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

    const updateButtonState = () => {
      const notes = getNotes();
      const tasks = getTasks();
      const theory = getTheory();
      const openTasks = tasks.filter((t) => !t.done).length;
      const openTheory = theory.filter((t) => !t.done).length;
      const noteLabel = notes.length > 0 ? `Notes (${notes.length})` : "Notes";
      const taskLabel =
        tasks.length > 0 ? `Tasks (${openTasks}/${tasks.length})` : "Tasks";
      const theoryLabel =
        theory.length > 0 ? `Theory (${openTheory}/${theory.length})` : "Theory";
      btn.textContent = `${theoryLabel} · ${taskLabel} · ${noteLabel}`;
      const noteTitle =
        notes.length > 0 ? notes.map((n) => n.text).join("\n") : "Add notes";
      const taskTitleText =
        tasks.length > 0
          ? tasks.map((t) => `${t.done ? "✓" : "•"} ${t.text}`).join("\n")
          : "Add tasks";
      const theoryTitleText =
        theory.length > 0
          ? theory.map((t) => `${t.done ? "✓" : "•"} ${t.text}`).join("\n")
          : "Add theory";
      btn.title = `${taskTitleText}\n${theoryTitleText}\n${noteTitle}`;
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
    // Order: theory, tasks, notes
    noteSection.appendChild(noteTitle);
    noteSection.appendChild(list);
    noteSection.appendChild(textarea);
    noteSection.appendChild(actions);

    pop.appendChild(noteSection);
    pop.appendChild(taskSection);
    pop.appendChild(theorySection);

    const closePopover = () => {
      wrapper.classList.remove("open");
      document.removeEventListener("click", documentListener);
      document.removeEventListener("keydown", escListener, true);
    };

    const documentListener = (e) => {
      if (!wrapper.contains(e.target)) {
        closePopover();
      }
    };

    const escListener = (e) => {
      if (e.key === "Escape") {
        if (wrapper.classList.contains("open")) {
          e.stopPropagation();
          closePopover();
          btn.focus();
        }
      }
    };

    const addTask = () => {
      const text = taskInput.value.trim();
      if (!text) return;
      const next = [
        ...getTasks(),
        {
          id: crypto.randomUUID
            ? crypto.randomUUID()
            : `t_${Date.now()}_${Math.random().toString(16).slice(2)}`,
          text,
          done: false
        }
      ];
      ctx.updateAspect(node.id, { tasks: next }, { skipRender: true });
      taskInput.value = "";
      renderTasks();
      updateButtonState();
      taskInput.focus();
      if (ctx.toast) ctx.toast("Task added");
    };

    taskAddBtn.addEventListener("click", addTask);
    taskInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        addTask();
      }
    });

    const addTheory = () => {
      const text = theoryInput.value.trim();
      if (!text) return;
      const next = [
        ...getTheory(),
        {
          id: crypto.randomUUID
            ? crypto.randomUUID()
            : `h_${Date.now()}_${Math.random().toString(16).slice(2)}`,
          text,
          done: false
        }
      ];
      ctx.updateAspect(node.id, { theory: next }, { skipRender: true });
      theoryInput.value = "";
      renderTheory();
      updateButtonState();
      theoryInput.focus();
      if (ctx.toast) ctx.toast("Theory added");
    };

    theoryAddBtn.addEventListener("click", addTheory);
    theoryInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        addTheory();
      }
    });

    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      const alreadyOpen = wrapper.classList.contains("open");
      if (alreadyOpen) {
        closePopover();
      } else {
        textarea.value = "";
        taskInput.value = "";
        theoryInput.value = "";
        renderTheory();
        renderTasks();
        renderList();
        wrapper.classList.add("open");
        document.addEventListener("click", documentListener);
        document.addEventListener("keydown", escListener, true);
        theoryInput.focus();
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

    renderTasks();
    renderTheory();
    renderList();
    updateButtonState();
  }
};
