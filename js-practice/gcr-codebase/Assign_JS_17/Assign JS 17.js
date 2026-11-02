/*
 * ASSIGNMENT 7 - DOM AND EVENT HANDLING
 * One combined solution file for Questions 1-9.
 *
 * Run: open a blank HTML page and load this file with:
 * <script src="Assign JS 17.js" defer></script>
 * The script builds every exercise's HTML interface itself. No framework is used.
 */
(() => {
  "use strict";

  if (typeof document === "undefined") {
    console.warn("Assignment 7 requires a browser DOM. Open an HTML page and load this JS file.");
    return;
  }

  const start = () => {
    if (document.getElementById("assignment-7-root")) return;

    // Shared page styling keeps the individual question demos readable.
    const style = document.createElement("style");
    style.textContent = `
      #assignment-7-root { max-width: 1100px; margin: 24px auto; padding: 20px; font: 16px/1.5 Arial, sans-serif; color: #202a3a; }
      #assignment-7-root * { box-sizing: border-box; }
      #assignment-7-root .question { margin: 22px 0; padding: 22px; border: 1px solid #dfe4ec; border-radius: 14px; background: #fff; box-shadow: 0 5px 18px #1b2b440a; }
      #assignment-7-root h1 { margin: 0 0 8px; } #assignment-7-root h2 { margin: 0 0 12px; font-size: 1.25rem; }
      #assignment-7-root button, #assignment-7-root input, #assignment-7-root textarea { font: inherit; }
      #assignment-7-root button { cursor: pointer; border: 0; border-radius: 8px; padding: 8px 13px; background: #5264d8; color: white; }
      #assignment-7-root input, #assignment-7-root textarea { border: 1px solid #bfc8d8; border-radius: 8px; padding: 9px 10px; max-width: 100%; }
      #assignment-7-root .row { display: flex; flex-wrap: wrap; gap: 9px; align-items: center; }
      #assignment-7-root .muted { color: #69758a; } #assignment-7-root .error { color: #c62828; min-height: 1.3em; }
      #assignment-7-root .success { color: #147a50; } #assignment-7-root ul { padding-left: 22px; }
      #assignment-7-root table { width: 100%; border-collapse: collapse; margin-top: 12px; }
      #assignment-7-root th, #assignment-7-root td { text-align: left; padding: 9px; border-bottom: 1px solid #e3e7ee; }
      #assignment-7-root .product-row { display: flex; align-items: center; gap: 10px; padding: 8px 0; border-bottom: 1px solid #e5e8ee; }
      #assignment-7-root .product-label { flex: 1; min-width: 120px; }
      #assignment-7-root .modal-backdrop { position: fixed; inset: 0; display: none; place-items: center; padding: 20px; background: #0009; z-index: 9999; }
      #assignment-7-root .modal { max-width: 720px; width: 100%; padding: 14px; border-radius: 12px; background: white; }
      #assignment-7-root .modal img { width: 100%; max-height: 70vh; object-fit: contain; }
      #assignment-7-root .gallery { display: grid; grid-template-columns: repeat(auto-fit,minmax(130px,1fr)); gap: 10px; }
      #assignment-7-root .gallery img { width: 100%; height: 125px; object-fit: cover; border-radius: 8px; cursor: pointer; }
      #assignment-7-root .mouse-box { width: 400px; max-width: 100%; height: 400px; position: relative; overflow: hidden; border: 2px solid #40506c; border-radius: 8px; background: #f2f5fb; }
      #assignment-7-root .dot { position: absolute; width: 12px; height: 12px; border-radius: 50%; background: red; transform: translate(-50%,-50%); }
      #assignment-7-root [data-theme="light"] { color: #202a3a; background: #fff; }
      #assignment-7-root [data-theme="dark"] { color: #f5f5f5; background: #242936; }
      #assignment-7-root [data-theme="blue"] { color: #12304b; background: #dceeff; }
      body.theme-light { background: #f7f8fc; }
      body.theme-dark { background: #151a25; }
      body.theme-blue { background: #dceeff; }
      body.theme-dark #assignment-7-root { color: #f4f5fa; }
      #assignment-7-root .theme-panel { border-radius: 10px; border: 1px solid #bfc8d8; padding: 16px; margin-top: 10px; }
      @media(max-width:600px) { #assignment-7-root { padding: 10px; } #assignment-7-root .question { padding: 15px; } }
    `;
    document.head.appendChild(style);

    const root = document.createElement("main");
    root.id = "assignment-7-root";
    root.innerHTML = `<h1>Assignment 7 - JavaScript DOM Exercises</h1><p class="muted">All nine questions are demonstrated below. Each section is independent.</p>`;
    document.body.appendChild(root);

    function makeQuestion(number, title, description = "") {
      const section = document.createElement("section");
      section.className = "question";
      section.innerHTML = `<h2>Q${number}. ${title}</h2>${description ? `<p class="muted">${description}</p>` : ""}`;
      root.appendChild(section);
      return section;
    }

    // Q1 - Dynamic Product List Manager using parent-level event delegation.
    {
      const section = makeQuestion(1, "Dynamic Product List Manager", "Add products, edit names inline, and delete rows. Clicking elsewhere saves an active edit.");
      const input = document.createElement("input"); input.placeholder = "Enter product name"; input.setAttribute("aria-label", "Product name");
      const add = document.createElement("button"); add.textContent = "Add product";
      const list = document.createElement("ul"); list.style.paddingLeft = "0"; list.style.listStyle = "none";
      section.append(input, add, list);
      let editingItem = null;
      function saveEdit() {
        if (!editingItem) return;
        const editor = editingItem.querySelector("input");
        // Keep a reference to the original label because it is temporarily detached
        // from the row while the inline input is visible.
        const label = editingItem._originalLabel || editingItem.querySelector(".product-label");
        if (editor && editor.value.trim()) label.textContent = editor.value.trim();
        else if (editor) label.textContent = editor.dataset.original || "Untitled product";
        if (editor) editor.replaceWith(label);
        delete editingItem._originalLabel;
        const editButton = editingItem.querySelector('[data-action="edit"]');
        if (editButton) editButton.textContent = "Edit";
        editingItem = null;
      }
      function addProduct(name) {
        const li = document.createElement("li"); li.className = "product-row";
        const label = document.createElement("span"); label.className = "product-label"; label.textContent = name;
        const edit = document.createElement("button"); edit.type = "button"; edit.dataset.action = "edit"; edit.textContent = "Edit";
        const remove = document.createElement("button"); remove.type = "button"; remove.dataset.action = "delete"; remove.textContent = "Delete"; remove.style.background = "#bd3b4b";
        li.append(label, edit, remove); list.appendChild(li);
      }
      add.addEventListener("click", () => { if (input.value.trim()) { addProduct(input.value.trim()); input.value = ""; input.focus(); } });
      input.addEventListener("keydown", e => { if (e.key === "Enter") add.click(); });
      // Only one listener handles actions for every current and future list row.
      list.addEventListener("click", event => {
        const button = event.target.closest("button[data-action]");
        if (!button) return;
        const item = button.closest("li");
        if (button.dataset.action === "delete") { if (editingItem === item) editingItem = null; item.remove(); return; }
        if (editingItem === item) { saveEdit(); return; }
        saveEdit();
        const label = item.querySelector(".product-label");
        const editor = document.createElement("input"); editor.value = label.textContent; editor.dataset.original = label.textContent;
        item._originalLabel = label;
        label.replaceWith(editor); button.textContent = "Save"; editingItem = item; editor.focus(); editor.select();
      });
      document.addEventListener("click", event => {
        if (editingItem && !editingItem.contains(event.target)) saveEdit();
      });
      addProduct("Wireless Mouse"); addProduct("Notebook");
    }

    // Q2 - Live 100-character counter; beforeinput prevents a new keystroke/paste from exceeding limit.
    {
      const section = makeQuestion(2, "Live Character Counter", "Maximum 100 characters. The counter becomes yellow at 20 remaining and red at zero.");
      const area = document.createElement("textarea"); area.rows = 4; area.maxLength = 100; area.placeholder = "Write up to 100 characters..."; area.style.width = "100%";
      const counter = document.createElement("p"); counter.textContent = "100 characters remaining";
      const reset = document.createElement("button"); reset.textContent = "Reset";
      function updateCounter() {
        const remaining = 100 - area.value.length;
        counter.textContent = `${remaining} characters remaining`;
        counter.style.color = remaining === 0 ? "#c62828" : remaining <= 20 ? "#b8860b" : "#536176";
      }
      area.addEventListener("beforeinput", event => {
        if (event.inputType && event.inputType.startsWith("insert") && area.value.length >= 100 && event.data) event.preventDefault();
      });
      area.addEventListener("input", updateCounter);
      reset.addEventListener("click", () => { area.value = ""; updateCounter(); area.focus(); });
      section.append(area, counter, reset);
    }

    // Q3 - Three-step wizard with per-step validation and a completion summary.
    {
      const section = makeQuestion(3, "Multi-Step Form", "Next advances only after validating the current field; Back returns to the previous step.");
      const form = document.createElement("form"); form.noValidate = true;
      const progress = document.createElement("p"); progress.className = "muted";
      const label = document.createElement("label"); label.style.display = "block";
      const field = document.createElement("input"); field.style.display = "block"; field.style.width = "100%"; field.required = true;
      const error = document.createElement("p"); error.className = "error";
      const controls = document.createElement("div"); controls.className = "row";
      const back = document.createElement("button"); back.type = "button"; back.textContent = "Back";
      const next = document.createElement("button"); next.type = "button"; next.textContent = "Next";
      const summary = document.createElement("p"); summary.className = "success"; summary.hidden = true;
      controls.append(back, next); form.append(progress, label, field, error, controls, summary); section.appendChild(form);
      const steps = [
        { label: "Name", type: "text", placeholder: "Your full name", valid: v => v.trim().length >= 2, hint: "Enter at least two characters." },
        { label: "Email", type: "email", placeholder: "you@example.com", valid: v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v), hint: "Enter a valid email address." },
        { label: "Password", type: "password", placeholder: "At least 6 characters", valid: v => v.length >= 6, hint: "Password must contain at least 6 characters." }
      ];
      const values = ["", "", ""]; let current = 0;
      function renderStep() {
        const step = steps[current]; progress.textContent = `Step ${current + 1} of 3`;
        label.textContent = step.label; field.type = step.type; field.placeholder = step.placeholder; field.value = values[current];
        back.disabled = current === 0; next.textContent = current === 2 ? "Finish" : "Next"; error.textContent = ""; summary.hidden = true; field.focus();
      }
      back.addEventListener("click", () => { values[current] = field.value; if (current > 0) { current--; renderStep(); } });
      next.addEventListener("click", () => {
        const value = field.value;
        if (!steps[current].valid(value)) { error.textContent = steps[current].hint; field.focus(); return; }
        values[current] = value;
        if (current < 2) { current++; renderStep(); }
        else { label.hidden = field.hidden = back.hidden = next.hidden = true; progress.textContent = "Completed"; summary.hidden = false; summary.textContent = `Form complete: ${values[0]} | ${values[1]} | Password accepted.`; }
      });
      renderStep();
    }

    // Q4 - Theme switcher sets both a class and data attributes via setAttribute().
    {
      const section = makeQuestion(4, "Theme Switcher", "Three themes are applied using setAttribute(). The selected theme is saved as a custom attribute.");
      const controls = document.createElement("div"); controls.className = "row";
      const panel = document.createElement("div"); panel.className = "theme-panel"; panel.textContent = "This panel changes with the selected theme.";
      ["light", "dark", "blue"].forEach(theme => {
        const button = document.createElement("button"); button.textContent = theme[0].toUpperCase() + theme.slice(1);
        button.addEventListener("click", () => {
          document.body.setAttribute("class", `theme-${theme}`);
          document.body.setAttribute("data-theme", theme);
          document.body.setAttribute("data-current-theme", theme);
          panel.setAttribute("class", `theme-panel theme-${theme}`);
          panel.setAttribute("data-theme", theme);
          panel.setAttribute("data-current-theme", theme);
          panel.textContent = `Current theme: ${theme}. This value is stored in data-current-theme.`;
        });
        controls.appendChild(button);
      });
      panel.setAttribute("data-theme", "light"); panel.setAttribute("data-current-theme", "light");
      section.append(controls, panel);
    }

    // Q5 - Six images and a modal; clicks in the modal stop propagation to the backdrop.
    {
      const section = makeQuestion(5, "Image Gallery with Modal Preview", "Select any thumbnail to open its larger version. Click the dark backdrop to close.");
      const gallery = document.createElement("div"); gallery.className = "gallery";
      const images = [
        "photo-1500530855697-b586d89ba3ee", "photo-1470770841072-f978cf4d019e", "photo-1518837695005-2083093ee35b",
        "photo-1470252649378-9c29740c9fa8", "photo-1441974231531-c6227db76b6e", "photo-1464822759023-fed622ff2c3b"
      ];
      images.forEach((id, index) => {
        const image = document.createElement("img"); image.alt = `Gallery image ${index + 1}`;
        image.src = `https://images.unsplash.com/${id}?auto=format&fit=crop&w=600&q=80`;
        image.addEventListener("click", () => { modalImage.src = image.src.replace("w=600", "w=1400"); modalImage.alt = image.alt; backdrop.style.display = "grid"; });
        gallery.appendChild(image);
      });
      const backdrop = document.createElement("div"); backdrop.className = "modal-backdrop";
      const modal = document.createElement("div"); modal.className = "modal";
      const modalImage = document.createElement("img"); modalImage.alt = "Selected gallery preview";
      const close = document.createElement("button"); close.textContent = "Close"; close.style.marginTop = "8px";
      modal.append(modalImage, close); backdrop.appendChild(modal);
      backdrop.addEventListener("click", () => { backdrop.style.display = "none"; });
      modal.addEventListener("click", event => event.stopPropagation());
      close.addEventListener("click", () => { backdrop.style.display = "none"; });
      section.append(gallery, backdrop);
    }

    // Q6 - Table filter is case-insensitive and reports an empty result set.
    {
      const section = makeQuestion(6, "Real-Time Student Table Filter", "Search by student name, branch, or CGPA.");
      const search = document.createElement("input"); search.placeholder = "Search students..."; search.style.width = "100%";
      const table = document.createElement("table");
      table.innerHTML = `<thead><tr><th>Name</th><th>Branch</th><th>CGPA</th></tr></thead><tbody>
        <tr><td>Aarav Sharma</td><td>CSE</td><td>8.7</td></tr><tr><td>Meera Joshi</td><td>ECE</td><td>9.1</td></tr>
        <tr><td>Rohan Verma</td><td>Mechanical</td><td>7.8</td></tr><tr><td>Sana Khan</td><td>CSE</td><td>8.9</td></tr>
        <tr><td>Dev Patel</td><td>IT</td><td>8.2</td></tr></tbody>`;
      const noResults = document.createElement("p"); noResults.className = "error"; noResults.hidden = true; noResults.textContent = "No results found";
      const rows = [...table.querySelectorAll("tbody tr")];
      search.addEventListener("input", () => {
        const query = search.value.toLowerCase().trim(); let visible = 0;
        rows.forEach(row => { const match = row.textContent.toLowerCase().includes(query); row.hidden = !match; if (match) visible++; });
        noResults.hidden = visible !== 0;
      });
      section.append(search, table, noResults);
    }

    // Q7 - Mouse client coordinates are shown live; double-click positions a red dot.
    {
      const section = makeQuestion(7, "Mouse Path and Coordinates Logger", "Move inside the 400 x 400 box. Double-click to place a red marker.");
      const coordinates = document.createElement("p"); coordinates.textContent = "clientX: -, clientY: -";
      const box = document.createElement("div"); box.className = "mouse-box"; box.setAttribute("aria-label", "Mouse tracking area");
      box.addEventListener("mousemove", event => { coordinates.textContent = `clientX: ${event.clientX}, clientY: ${event.clientY}`; });
      box.addEventListener("dblclick", event => {
        const rect = box.getBoundingClientRect(); const dot = document.createElement("span"); dot.className = "dot";
        dot.style.left = `${event.clientX - rect.left}px`; dot.style.top = `${event.clientY - rect.top}px`; box.appendChild(dot);
      });
      section.append(coordinates, box);
    }

    // Q8 - Custom dropdown uses the capturing phase to detect outside clicks first.
    {
      const section = makeQuestion(8, "Custom Dropdown (No select Element)", "The outside-click listener is registered in the capturing phase.");
      const wrapper = document.createElement("div"); wrapper.style.position = "relative"; wrapper.style.display = "inline-block";
      const trigger = document.createElement("button"); trigger.textContent = "Choose a department ▾";
      const menu = document.createElement("div"); menu.hidden = true; menu.style.cssText = "position:absolute;top:44px;left:0;min-width:210px;padding:8px;background:#fff;border:1px solid #ccd3df;border-radius:10px;box-shadow:0 8px 20px #0002;z-index:10";
      ["Computer Science", "Electronics", "Mechanical", "Civil"].forEach(option => {
        const item = document.createElement("button"); item.type = "button"; item.textContent = option; item.style.cssText = "display:block;width:100%;margin:3px 0;text-align:left;background:#eef1fb;color:#26334b";
        item.addEventListener("click", () => { trigger.textContent = `${option} ▾`; menu.hidden = true; }); menu.appendChild(item);
      });
      trigger.addEventListener("click", () => { menu.hidden = !menu.hidden; }); wrapper.append(trigger, menu); section.appendChild(wrapper);
      document.addEventListener("click", event => { if (!wrapper.contains(event.target)) menu.hidden = true; }, true);
    }

    // Q9 - Submission blocker with inline validation and live error removal.
    {
      const section = makeQuestion(9, "Form Submit Blocker with Live Errors", "Correcting a field automatically clears its error.");
      const form = document.createElement("form"); form.noValidate = true;
      const fields = [
        { name: "Name", type: "text", valid: v => v.trim().length > 0, message: "Name is required." },
        { name: "Email", type: "email", valid: v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v), message: "Enter a valid email containing @." },
        { name: "Password", type: "password", valid: v => v.length >= 6, message: "Password must be at least 6 characters." }
      ];
      const inputs = {};
      fields.forEach(item => {
        const label = document.createElement("label"); label.textContent = item.name; label.style.display = "block"; label.style.marginTop = "10px";
        const input = document.createElement("input"); input.type = item.type; input.style.display = "block"; input.style.width = "100%"; input.autocomplete = "off";
        const error = document.createElement("small"); error.className = "error"; error.style.display = "block";
        form.append(label, input, error); inputs[item.name] = { input, error, rule: item };
        input.addEventListener("input", () => { if (item.valid(input.value)) error.textContent = ""; });
      });
      const submit = document.createElement("button"); submit.type = "submit"; submit.textContent = "Submit"; submit.style.marginTop = "12px";
      const message = document.createElement("p"); message.className = "success"; form.append(submit, message);
      form.addEventListener("submit", event => {
        event.preventDefault(); let valid = true;
        Object.values(inputs).forEach(({ input, error, rule }) => {
          const okay = rule.valid(input.value); error.textContent = okay ? "" : rule.message; if (!okay) valid = false;
        });
        message.textContent = valid ? "Form Submitted Successfully" : "Please correct the highlighted fields.";
      });
      section.appendChild(form);
    }
  };

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start, { once: true });
  else start();
})();
