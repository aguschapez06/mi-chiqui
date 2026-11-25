
(function () {
  const DB_NAME = "MiChiquiParaVos";
  const STORE = "recuerdos";
  const CONFIG_KEY = "miChiquiSeccionesSorpresa";

  const sections = [
    "Nuestros recuerdos",
    "Cartitas",
    "Fechas especiales",
    "Nuestra música",
    "Para vos"
  ];

  function getConfig() {
    try {
      const saved = JSON.parse(localStorage.getItem(CONFIG_KEY));
      if (saved && typeof saved === "object") return saved;
    } catch (error) {
      console.error(error);
    }

    return { "Para vos": true };
  }

  function saveConfig(config) {
    localStorage.setItem(CONFIG_KEY, JSON.stringify(config));
  }

  function openDB() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, 1);

      request.onupgradeneeded = () => {
        const db = request.result;
        if (!db.objectStoreNames.contains(STORE)) {
          db.createObjectStore(STORE, {
            keyPath: "id",
            autoIncrement: true
          });
        }
      };

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async function getAll() {
    const db = await openDB();

    return new Promise((resolve, reject) => {
      const request = db.transaction(STORE, "readonly")
        .objectStore(STORE).getAll();

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async function saveItem(item) {
    const db = await openDB();

    return new Promise((resolve, reject) => {
      const request = db.transaction(STORE, "readwrite")
        .objectStore(STORE).add(item);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async function deleteItem(id) {
    const db = await openDB();

    return new Promise((resolve, reject) => {
      const request = db.transaction(STORE, "readwrite")
        .objectStore(STORE).delete(id);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  function addStyles() {
    if (document.getElementById("momentitosStyles")) return;

    const style = document.createElement("style");
    style.id = "momentitosStyles";

    style.textContent = `
      .momentitos-card {
        margin:22px auto;
        padding:18px;
        max-width:520px;
        background:white;
        border:1px solid var(--details);
        border-radius:18px;
        text-align:center;
      }

      .momentitos-card img,
      .momentitos-card video {
        width:100%;
        max-height:380px;
        object-fit:contain;
        border-radius:12px;
      }

      .momentitos-dedication {
        white-space:pre-wrap;
        line-height:1.7;
        margin:16px 4px 4px;
        color:var(--text);
      }

      .momentitos-admin {
        margin:20px auto;
        max-width:560px;
      }

      .momentitos-admin input,
      .momentitos-admin textarea {
        display:block;
        box-sizing:border-box;
        width:100%;
        margin:10px 0;
        padding:12px;
        border:1px solid var(--details);
        border-radius:10px;
        font:inherit;
      }

      .momentitos-file {
        background:white;
        padding:12px;
        margin:14px 0;
        border:1px solid var(--details);
        border-radius:14px;
      }

      .momentitos-file img,
      .momentitos-file video {
        width:100%;
        max-height:220px;
        object-fit:contain;
      }

      .momentitos-settings {
        text-align:left;
        padding:15px;
        margin:18px 0;
        border:1px solid var(--details);
        border-radius:14px;
      }

      .momentitos-setting {
        display:flex;
        align-items:center;
        gap:10px;
        margin:12px 0;
      }

      .momentitos-setting input {
        width:auto;
        margin:0;
      }
    `;

    document.head.appendChild(style);
  }

  function makeButton(label, action) {
    const button = document.createElement("button");
    button.textContent = label;
    button.addEventListener("click", action);
    return button;
  }

  
  async function showRandomMoment(container) {
    const card = document.createElement("article");
    card.className = "momentitos-card";
    container.appendChild(card);

    let previousId = null;

    async function renderMoment() {
      card.innerHTML = "";

      const heading = document.createElement("h2");
      heading.textContent = "Un momentito nuestro ♡";
      card.appendChild(heading);

      try {
        const items = await getAll();

        if (!items.length) {
          const empty = document.createElement("p");
          empty.textContent =
            "Acá van a aparecer nuestros recuerdos mi amor.";
          card.appendChild(empty);
          return;
        }

        let available = items;

        if (items.length > 1 && previousId !== null) {
          available = items.filter(item => item.id !== previousId);
        }

        const item = available[
          Math.floor(Math.random() * available.length)
        ];

        previousId = item.id;

        const url = URL.createObjectURL(item.blob);
        let media;

        if (item.type.startsWith("video/")) {
          media = document.createElement("video");
          media.controls = true;
          media.playsInline = true;
        } else {
          media = document.createElement("img");
          media.alt = "Un recuerdo nuestro";
        }

        media.src = url;
        card.appendChild(media);

        const dedication = document.createElement("p");
        dedication.className = "momentitos-dedication";
        dedication.textContent = item.dedication || "";
        card.appendChild(dedication);

        if (items.length > 1) {
          const another = makeButton(
            "Ver otro momentito ♡",
            renderMoment
          );
          card.appendChild(another);
        }

      } catch (error) {
        console.error(error);

        const message = document.createElement("p");
        message.textContent =
          "No pudimos cargar los recuerdos en este momento.";
        card.appendChild(message);
      }
    }

    await renderMoment();
  }


  function addSettings(area) {
    const config = getConfig();

    const box = document.createElement("div");
    box.className = "momentitos-settings";

    const title = document.createElement("h2");
    title.textContent = "¿Dónde querés que aparezcan las sorpresas? ♡";
    box.appendChild(title);

    const explanation = document.createElement("p");
    explanation.textContent =
      "Elegí las secciones en las que aparecerá un recuerdo aleatorio.";
    box.appendChild(explanation);

    sections.forEach(section => {
      const label = document.createElement("label");
      label.className = "momentitos-setting";

      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.checked = !!config[section];

      checkbox.addEventListener("change", () => {
        config[section] = checkbox.checked;
        saveConfig(config);
      });

      const text = document.createElement("span");
      text.textContent = section;

      label.appendChild(checkbox);
      label.appendChild(text);
      box.appendChild(label);
    });

    area.appendChild(box);
  }

  async function showAdmin() {
    const home = document.getElementById("home");
    if (!home) return;

    home.innerHTML = "";

    const area = document.createElement("div");
    area.className = "momentitos-admin";
    home.appendChild(area);

    const title = document.createElement("h1");
    title.textContent = "Nuestros momentitos ♡";
    area.appendChild(title);

    const explanation = document.createElement("p");
    explanation.textContent =
      "Elegí varias fotos o videos y escribí una dedicatoria para cada recuerdo.";
    area.appendChild(explanation);

    addSettings(area);

    const existingTitle = document.createElement("h2");
    existingTitle.textContent = "Recuerdos guardados";
    area.appendChild(existingTitle);

    const existing = await getAll();

    if (!existing.length) {
      const empty = document.createElement("p");
      empty.textContent = "Todavía no hay recuerdos guardados.";
      area.appendChild(empty);
    }

    existing.forEach(item => {
      const row = document.createElement("div");
      row.className = "momentitos-file";

      const name = document.createElement("p");
      name.textContent = item.name;
      row.appendChild(name);

      const dedication = document.createElement("p");
      dedication.textContent = item.dedication || "";
      row.appendChild(dedication);

      const remove = makeButton(
        "Eliminar recuerdo",
        async () => {
          if (!confirm("¿Querés eliminar este recuerdo?")) return;
          await deleteItem(item.id);
          showAdmin();
        }
      );

      row.appendChild(remove);
      area.appendChild(row);
    });

    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*,video/*";
    input.multiple = true;
    area.appendChild(input);

    const previews = document.createElement("div");
    area.appendChild(previews);

    const save = makeButton(
      "Guardar recuerdos",
      async () => {
        const entries =
          [...previews.querySelectorAll(".momentitos-file")];

        if (!entries.length) {
          alert("Primero elegí alguna foto o video.");
          return;
        }

        save.disabled = true;
        save.textContent = "Guardando...";

        try {
          for (const entry of entries) {
            await saveItem({
              blob: entry.file,
              type: entry.file.type,
              name: entry.file.name,
              dedication:
                entry.querySelector("textarea").value.trim(),
              createdAt: new Date().toISOString()
            });
          }

          alert("¡Tus momentitos quedaron guardados!");
          window.showForYou();

        } catch (error) {
          console.error(error);
          alert("No se pudieron guardar todos los archivos. Probá de nuevo.");
          save.disabled = false;
          save.textContent = "Guardar recuerdos";
        }
      }
    );

    area.appendChild(save);

    input.addEventListener("change", () => {
      previews.innerHTML = "";

      [...input.files].forEach(file => {
        if (
          !file.type.startsWith("image/") &&
          !file.type.startsWith("video/")
        ) return;

        const entry = document.createElement("div");
        entry.className = "momentitos-file";
        entry.file = file;

        const name = document.createElement("p");
        name.textContent = file.name;
        entry.appendChild(name);

        const url = URL.createObjectURL(file);

        const preview = document.createElement(
          file.type.startsWith("video/") ? "video" : "img"
        );

        preview.src = url;

        if (preview.tagName === "VIDEO") {
          preview.controls = true;
          preview.playsInline = true;
        }

        entry.appendChild(preview);

        const dedication = document.createElement("textarea");
        dedication.placeholder =
          "Escribí acá tu dedicatoria para este recuerdo...";
        dedication.rows = 3;
        entry.appendChild(dedication);

        previews.appendChild(entry);
      });
    });

    area.appendChild(
      makeButton("Volver a Para vos", () => window.showForYou())
    );
  }

 
  async function showGallery() {
  const home = document.getElementById("home");
  if (!home) return;

  home.innerHTML = "";

  const title = document.createElement("h1");
  title.textContent = "Nuestra galería ♡";
  home.appendChild(title);

  const description = document.createElement("p");
  description.textContent = "Todos esos momentitos que quiero volver a vivir con vos.";
  home.appendChild(description);

  const gallery = document.createElement("div");
  gallery.className = "momentitos-gallery";
  home.appendChild(gallery);

  try {
    const items = await getAll();

    if (!items.length) {
      const empty = document.createElement("p");
      empty.textContent = "Todavía no guardamos recuerdos, mi chiqui.";
      gallery.appendChild(empty);
    }

    items.slice().reverse().forEach(item => {
      const card = document.createElement("article");
      card.className = "momentitos-gallery-card";

      const media = document.createElement(
        item.type.startsWith("video/") ? "video" : "img"
      );

      media.src = URL.createObjectURL(item.blob);

      if (media.tagName === "VIDEO") {
        media.controls = true;
        media.playsInline = true;
      } else {
        media.alt = "Un recuerdo nuestro";
        media.loading = "lazy";
        media.addEventListener("click", () => {
  const overlay = document.createElement("div");
  overlay.className = "momentitos-lightbox";

  const enlarged = document.createElement("img");
  enlarged.src = media.src;
  enlarged.alt = media.alt;

  overlay.appendChild(enlarged);
  document.body.appendChild(overlay);

  overlay.addEventListener("click", () => {
    overlay.remove();
  });
});
      }

      card.appendChild(media);

      const dedication = document.createElement("p");
      dedication.className = "momentitos-dedication";
      dedication.textContent = item.dedication || "";
      card.appendChild(dedication);

      gallery.appendChild(card);
    });
  } catch (error) {
    console.error(error);
    const message = document.createElement("p");
    message.textContent = "No pudimos cargar la galería.";
    gallery.appendChild(message);
  }

  home.appendChild(
    makeButton("Volver a Para vos ♡", () => window.showForYou())
  );
}
 function addAdminButton() {
    const home = document.getElementById("home");
    if (!home || home.querySelector(".momentitos-admin-button")) return;

        const galleryButton = makeButton(
      "Ver nuestra galería ♡",
      showGallery
    );
    home.appendChild(galleryButton);

    const button = makeButton(
      "Administrar nuestros momentitos",
      showAdmin
    );

    button.className = "momentitos-admin-button";
    home.appendChild(button);  }

  addStyles();

  const originalShowSection = window.showSection;

  if (typeof originalShowSection === "function") {
    window.showSection = function (item) {
      originalShowSection(item);

      if (!item || !item.title) return;

      const home = document.getElementById("home");
      if (!home) return;

      const config = getConfig();

      if (item.title === "Para vos") {
        addAdminButton();
      }

      if (config[item.title]) {
        const area = document.createElement("div");
        home.appendChild(area);
        showRandomMoment(area);
      }
    };
  }

})();
