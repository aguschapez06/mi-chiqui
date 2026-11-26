function miChiquiDateKey(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return year + "-" + month + "-" + day;
}

const welcome = document.getElementById("welcome");
const emotions = document.getElementById("emotions");
const emotionList = document.getElementById("emotionList");
const emotionNames = ["Feliz","Triste","Enojada","Cansada","Nerviosa","Tranquila","Preocupada","Desanimada","Emocionada","Aburrida"];
let selectedEmotions = [];
const sections = [{title:"Nuestros recuerdos",description:"Todos esos momentos que quiero guardar con vos."},{title:"Cartitas",description:"Palabras para acompañarte en cada momento."},{title:"Fechas especiales",description:"Nuestros días y momentos importantes."},{title:"Nuestra música",description:"Canciones que tienen un significado especial."},{title:"Para vos",description:"Un espacio hecho especialmente para vos."},{title:"Dates",description:"Una lista de cosas que queremos hacer juntos."}];
document.getElementById("nextButton").addEventListener("click", () => { welcome.classList.add("hidden"); emotions.classList.remove("hidden"); });
function renderEmotions() {
  emotionList.innerHTML = "";
  emotionNames.forEach(name => {
    const button = document.createElement("button");
    button.className = "emotion" + (selectedEmotions.includes(name) ? " selected" : "");
    button.innerHTML = name + ' <span class="small-heart">♡</span>';
    button.addEventListener("click", () => {
      if (selectedEmotions.includes(name)) selectedEmotions = selectedEmotions.filter(item => item !== name);
      else selectedEmotions.push(name);
      renderEmotions();
    });
    emotionList.appendChild(button);
  });
}
function showHome() {
  emotions.classList.add("hidden");
  let home = document.getElementById("home");
  if (home) home.remove();
  home = document.createElement("section");
  home.id = "home";
  home.className = "home";
  home.innerHTML = '<div class="heart">♡</div><h1>Mi espacio ♡</h1><p>Hola mi chiqui</p><p class="home-note">Este rinconcito es todo tuyo.</p><p class="emotion-summary" id="emotionSummary"></p><div class="home-cards" id="homeCards"></div>';
  document.querySelector(".app").appendChild(home);
  document.getElementById("emotionSummary").textContent = "Hoy te sentís: " + selectedEmotions.join(", ");
  const cards = document.getElementById("homeCards");
  sections.forEach(item => {
    const button = document.createElement("button");
    button.className = "home-card";
    button.textContent = item.title + "  ♡";
    button.addEventListener("click", () => showSection(item));
    cards.appendChild(button);
  });
}
function showSection(item) {
  const home = document.getElementById("home");
  home.innerHTML = "";
  const title = document.createElement("h1"); title.textContent = item.title; home.appendChild(title);
  const description = document.createElement("p"); description.textContent = item.description; home.appendChild(description);
  const message = document.createElement("p"); message.className = "home-note"; message.textContent = "Estamos preparando este espacio con mucho amor ♡"; home.appendChild(message);
  const back = document.createElement("button"); back.textContent = "Volver"; back.addEventListener("click", showHome); home.appendChild(back);
}
document.getElementById("confirmButton").addEventListener("click", () => {
  if (selectedEmotions.length === 0) { alert("Elegí al menos cómo te sentís, mi amor ♡"); return; }
  localStorage.setItem("miChiquiEmotions", JSON.stringify(selectedEmotions));
  saveDailyEmotions(selectedEmotions);
  showHome();
});
renderEmotions();
showSection = function(item) {
  if (item.title === "Cartitas") { showLetters(); return; }
  const home = document.getElementById("home");
  home.innerHTML = "";
  const title = document.createElement("h1"); title.textContent = item.title; home.appendChild(title);
  const description = document.createElement("p"); description.textContent = item.description; home.appendChild(description);
  const message = document.createElement("p"); message.className = "home-note"; message.textContent = "Estamos preparando este espacio con mucho amor ♡"; home.appendChild(message);
  const back = document.createElement("button"); back.textContent = "Volver"; back.addEventListener("click", showHome); home.appendChild(back);
};
function showLetters() {
  const home = document.getElementById("home"); home.innerHTML = "";
  const title = document.createElement("h1"); title.textContent = "Cartitas"; home.appendChild(title);
  const subtitle = document.createElement("p"); subtitle.textContent = "Unas palabras para cada momento."; home.appendChild(subtitle);
  const categories = ["Para cuando estés triste","Para cuando estés feliz","Para cuando me extrañes","Para cuando necesites un abrazo","Para cualquier momento"];
  categories.forEach(category => {
    const button = document.createElement("button"); button.className = "home-card"; button.textContent = category;
    button.addEventListener("click", () => openLetterCategory(category)); home.appendChild(button);
  });
  const back = document.createElement("button"); back.textContent = "Volver a Mi espacio"; back.addEventListener("click", showHome); home.appendChild(back);
}
function openLetterCategory(category) {
  const home = document.getElementById("home"); home.innerHTML = "";
  const title = document.createElement("h1"); title.textContent = category; home.appendChild(title);
  const subtitle = document.createElement("p"); subtitle.textContent = "Palabras escritas especialmente para vos."; home.appendChild(subtitle);
  const form = document.createElement("form"); form.className = "letter-form";
  const heading = document.createElement("input"); heading.placeholder = "Título de la cartita"; heading.required = true; heading.className = "letter-input";
  const content = document.createElement("textarea"); content.placeholder = "Escribí acá tu cartita..."; content.required = true; content.className = "letter-textarea";
  const save = document.createElement("button"); save.type = "submit"; save.textContent = "Guardar cartita";
  form.append(heading, content, save); home.appendChild(form);
  const listTitle = document.createElement("h2");
  listTitle.textContent = "Tus sobres, mi chiqui";
  home.appendChild(listTitle);

  const list = document.createElement("div");
  list.className = "saved-letters";
  home.appendChild(list);

  const key = "miChiquiLetters_" + category;

  function renderSaved() {
    list.innerHTML = "";
    const letters = JSON.parse(localStorage.getItem(key) || "[]");

    if (!letters.length) {
      const empty = document.createElement("p");
      empty.textContent = "Todavía no hay cartitas en esta categoría.";
      list.appendChild(empty);
    }

    letters.forEach((letter, index) => {
      const card = document.createElement("article");
      card.className = "letter-envelope";

      const envelope = document.createElement("button");
envelope.className = "letter-envelope-button";
envelope.type = "button";
envelope.setAttribute("aria-label", "Abrir cartita");

const flap = document.createElement("span");
flap.className = "letter-envelope-flap";

const heart = document.createElement("span");
heart.className = "letter-envelope-heart";
heart.textContent = "";

envelope.append(flap, heart);

      const label = document.createElement("p");
      label.textContent = letter.title;
      label.className = "letter-envelope-title";

      const body = document.createElement("div");
      body.className = "letter-envelope-content";
      body.hidden = true;

      const message = document.createElement("p");
      message.textContent = letter.content;
      body.appendChild(message);

      let opened = false;
      envelope.addEventListener("click", () => {
        opened = !opened;
        body.hidden = !opened;
        card.classList.toggle("letter-open", opened);
        envelope.textContent = opened ? "CERRAR" : "ABRIR";
      });

      const remove = document.createElement("button");
      remove.textContent = "Eliminar";
      remove.className = "delete-letter";
      remove.addEventListener("click", () => {
        const updated = letters.filter((entry, i) => i !== index);
        localStorage.setItem(key, JSON.stringify(updated));
        renderSaved();
      });

      card.append(envelope, label, body, remove);
      list.appendChild(card);
    });
  }
  form.addEventListener("submit", event => {
    event.preventDefault();
    const letters = JSON.parse(localStorage.getItem(key) || "[]");
    letters.push({title: heading.value.trim(), content: content.value.trim()});
    localStorage.setItem(key, JSON.stringify(letters));
    heading.value = ""; content.value = ""; renderSaved();
  });
  renderSaved();
  const back = document.createElement("button"); back.textContent = "Volver a Cartitas"; back.addEventListener("click", showLetters); home.appendChild(back);
}
showSection = function(item) {
  if (item.title === "Cartitas") { showLetters(); return; }
  if (item.title === "Fechas especiales") { showDates(); return; }
  const home = document.getElementById("home"); home.innerHTML = "";
  const title = document.createElement("h1"); title.textContent = item.title; home.appendChild(title);
  const description = document.createElement("p"); description.textContent = item.description; home.appendChild(description);
  const message = document.createElement("p"); message.className = "home-note"; message.textContent = "Estamos preparando este espacio con mucho amor ♡"; home.appendChild(message);
  const back = document.createElement("button"); back.textContent = "Volver"; back.addEventListener("click", showHome); home.appendChild(back);
};
function showDates() {
  const home = document.getElementById("home"); home.innerHTML = "";
  const title = document.createElement("h1"); title.textContent = "Fechas especiales ♡"; home.appendChild(title);
  const subtitle = document.createElement("p"); subtitle.textContent = "Días que siempre quiero recordar."; home.appendChild(subtitle);
  const form = document.createElement("form"); form.className = "letter-form";
  const name = document.createElement("input"); name.className = "letter-input"; name.placeholder = "Nombre de la fecha"; name.required = true;
  const date = document.createElement("input"); date.className = "letter-input"; date.type = "date"; date.required = true;
  const description = document.createElement("textarea"); description.className = "letter-textarea"; description.placeholder = "¿Por qué es especial?";
  const save = document.createElement("button"); save.type = "submit"; save.textContent = "Guardar fecha ♡";
  form.append(name, date, description, save); home.appendChild(form);
  const heading = document.createElement("h2"); heading.textContent = "Nuestros días"; home.appendChild(heading);
  const list = document.createElement("div"); list.className = "saved-letters"; home.appendChild(list);
  const key = "miChiquiDates";
  const initialDates = [
    {
      name: "El comienzo de nuestro para siempre ♡",
      date: "2026-01-13",
      description: "Porque ese día nos conocimos por primera vez y sin saberlo estábamos dando el primer paso hacia todo lo lindo que iba a venir luego."
    },
    {
      name: "El día en que nos elegimos ♡",
      date: "2026-02-17",
      description: "Porque ese día dejamos de ser dos personas que se estaban conociendo para empezar a construir algo juntos. Fue el comienzo de nuestra relación y de una de las partes más lindas de mi vida."
    }
  ];

  const existingDates = JSON.parse(localStorage.getItem(key) || "[]");
  initialDates.forEach(initialDate => {
    const index = existingDates.findIndex(entry => entry.date === initialDate.date);
    if (index === -1) {
      existingDates.push(initialDate);
    } else {
      existingDates[index].name = initialDate.name;
      existingDates[index].description = initialDate.description;
    }
  });
  localStorage.setItem(key, JSON.stringify(existingDates));
  function render() {
    list.innerHTML = "";
    const dates = JSON.parse(localStorage.getItem(key) || "[]").sort((a,b) => a.date.localeCompare(b.date));
    if (!dates.length) { const empty = document.createElement("p"); empty.textContent = "Todavía no agregamos fechas especiales."; list.appendChild(empty); }
    dates.forEach((entry,index) => {
      const card = document.createElement("article"); card.className = "letter-card";
      const heading = document.createElement("h3"); heading.textContent = entry.name; card.appendChild(heading);
      const dateText = document.createElement("p"); dateText.className = "date-text"; dateText.textContent = new Date(entry.date + "T12:00:00").toLocaleDateString("es-UY",{day:"numeric",month:"long",year:"numeric"}); card.appendChild(dateText);
      if (entry.description) { const desc = document.createElement("p"); desc.textContent = entry.description; card.appendChild(desc); }
      const remove = document.createElement("button"); remove.className = "delete-letter"; remove.textContent = "Eliminar";
      remove.addEventListener("click", () => { const updated = dates.filter((item,i) => i !== index); localStorage.setItem(key,JSON.stringify(updated)); render(); });
      card.appendChild(remove); list.appendChild(card);
    });
  }
  form.addEventListener("submit", event => {
    event.preventDefault();
    const dates = JSON.parse(localStorage.getItem(key) || "[]");
    dates.push({name:name.value.trim(),date:date.value,description:description.value.trim()});
    localStorage.setItem(key,JSON.stringify(dates));
    form.reset(); render();
  });
  render();
  const back = document.createElement("button"); back.textContent = "Volver a Mi espacio"; back.addEventListener("click",showHome); home.appendChild(back);
}
showSection = function(item) {
  if (item.title === "Nuestros recuerdos") { showMemories(); return; }
  if (item.title === "Cartitas") { showLetters(); return; }
  if (item.title === "Fechas especiales") { showDates(); return; }
  const home = document.getElementById("home"); home.innerHTML = "";
  const title = document.createElement("h1"); title.textContent = item.title; home.appendChild(title);
  const description = document.createElement("p"); description.textContent = item.description; home.appendChild(description);
  const message = document.createElement("p"); message.className = "home-note"; message.textContent = "Estamos preparando este espacio con mucho amor ♡"; home.appendChild(message);
  const back = document.createElement("button"); back.textContent = "Volver"; back.addEventListener("click", showHome); home.appendChild(back);
};
function openamemoryDB() { return new Promise((resolve,reject) => { const request = indexedDB.open("MiChiquiMemories",1); request.onupgradeneeded = () => { const db = request.result; if (!db.objectStoreNames.contains("memories")) db.createObjectStore("memories",{keyPath:"id"}); }; request.onsuccess = () => resolve(request.result); request.onerror = () => reject(request.error); }); }
async function showMemories() {
  const home = document.getElementById("home"); home.innerHTML = "";
  const title = document.createElement("h1"); title.textContent = "Nuestros recuerdos ♡"; home.appendChild(title);
  const subtitle = document.createElement("p"); subtitle.textContent = "Momentos que quiero guardar para siempre."; home.appendChild(subtitle);
  const form = document.createElement("form"); form.className = "letter-form";
  const files = document.createElement("input"); files.type = "file"; files.accept = "image/*,video/*"; files.multiple = true; files.className = "letter-input";
  const date = document.createElement("input"); date.type = "date"; date.className = "letter-input"; date.value = new Date().toISOString().slice(0,10);
  const caption = document.createElement("textarea"); caption.className = "letter-textarea"; caption.placeholder = "Escribí algo sobre este recuerdo...";
  const save = document.createElement("button"); save.type = "submit"; save.textContent = "Guardar recuerdo ♡";
  form.append(files,date,caption,save); home.appendChild(form);
  const list = document.createElement("div"); list.className = "memory-grid"; home.appendChild(list);
  async function render() {
    list.innerHTML = "";
    try { const db = await openamemoryDB(); const records = await new Promise((resolve,reject) => { const request = db.transaction("memories","readonly").objectStore("memories").getAll(); request.onsuccess = () => resolve(request.result); request.onerror = () => reject(request.error); });
      records.sort((a,b) => b.date.localeCompare(a.date));
      if (!records.length) { const empty = document.createElement("p"); empty.textContent = "Todavía no hay recuerdos. Podés agregar el primero ♡"; list.appendChild(empty); }
      records.forEach(record => {
        const card = document.createElement("article"); card.className = "memory-card";
        const mediaURL = URL.createObjectURL(record.file);
        let media; if (record.file.type.startsWith("video/")) { media = document.createElement("video"); media.controls = true; } else { media = document.createElement("img"); media.alt = record.caption || "Nuestro recuerdo"; }
        media.src = mediaURL; if (record.file.type.startsWith("image/")) { media.style.cursor = "zoom-in"; media.addEventListener("click", () => { const overlay = document.createElement("div"); overlay.className = "photo-viewer"; const large = document.createElement("img"); large.src = mediaURL; const close = document.createElement("button"); close.textContent = "Cerrar ×"; close.addEventListener("click", () => overlay.remove()); overlay.addEventListener("click", event => { if (event.target === overlay) overlay.remove(); }); overlay.append(large, close); document.body.appendChild(overlay); }); } card.appendChild(media);
        const dateText = document.createElement("p"); dateText.className = "date-text"; dateText.textContent = new Date(record.date + "T12:00:00").toLocaleDateString("es-UY",{day:"numeric",month:"long",year:"numeric"}); card.appendChild(dateText);
        if (record.caption) { const text = document.createElement("p"); text.textContent = record.caption; card.appendChild(text); }
        const remove = document.createElement("button"); remove.className = "delete-letter"; remove.textContent = "Eliminar"; remove.addEventListener("click",async () => { const db = await openamemoryDB(); await new Promise((resolve,reject) => { const request = db.transaction("memories","readwrite").objectStore("memories").delete(record.id); request.onsuccess = resolve; request.onerror = () => reject(request.error); }); URL.revokeObjectURL(mediaURL); render(); });
        card.appendChild(remove); list.appendChild(card);
      });
    } catch(error) { const message = document.createElement("p"); message.textContent = "No se pudieron cargar los recuerdos. Probá nuevamente."; list.appendChild(message); }
  }
  form.addEventListener("submit",async event => {
    event.preventDefault();
    if (!files.files.length) { alert("Primero elegí una foto o un video ♡"); return; }
    try { const db = await openamemoryDB(); for (let i=0;i<files.files.length;i++) { const file = files.files[i]; const record = {id:Date.now()+i,file:file,date:date.value || new Date().toISOString().slice(0,10),caption:caption.value.trim()}; await new Promise((resolve,reject) => { const request = db.transaction("memories","readwrite").objectStore("memories").add(record); request.onsuccess = resolve; request.onerror = () => reject(request.error); }); }
      form.reset(); date.value = new Date().toISOString().slice(0,10); await render();
    } catch(error) { alert("No se pudo guardar. Puede que el archivo sea demasiado grande o no haya espacio disponible."); }
  });
  await render();
  const back = document.createElement("button"); back.textContent = "Volver a Mi espacio"; back.addEventListener("click",showHome); home.appendChild(back);
}
showSection = function(item) {
  if (item.title === "Nuestros recuerdos") { showMemories(); return; }
  if (item.title === "Cartitas") { showLetters(); return; }
  if (item.title === "Fechas especiales") { showDates(); return; }
  if (item.title === "Nuestra música") { showMusic(); return; }
  const home = document.getElementById("home"); home.innerHTML = "";
  const title = document.createElement("h1"); title.textContent = item.title; home.appendChild(title);
  const description = document.createElement("p"); description.textContent = item.description; home.appendChild(description);
  const back = document.createElement("button"); back.textContent = "Volver"; back.addEventListener("click", showHome); home.appendChild(back);
};
function showMusic() {
  const home = document.getElementById("home"); home.innerHTML = "";
  const title = document.createElement("h1"); title.textContent = "Nuestra música ♡"; home.appendChild(title);
  const subtitle = document.createElement("p"); subtitle.textContent = "Canciones que me hacen pensar en vos."; home.appendChild(subtitle);
  const form = document.createElement("form"); form.className = "letter-form";
  const song = document.createElement("input"); song.className = "letter-input"; song.placeholder = "Nombre de la canción"; song.required = true;
  const artist = document.createElement("input"); artist.className = "letter-input"; artist.placeholder = "Artista";
  const link = document.createElement("input"); link.className = "letter-input"; link.placeholder = "Enlace de Spotify o YouTube"; link.type = "url";
  const note = document.createElement("textarea"); note.className = "letter-textarea"; note.placeholder = "¿Por qué elegí esta canción?";
  const save = document.createElement("button"); save.type = "submit"; save.textContent = "Guardar canción ♡";
  form.append(song,artist,link,note,save); home.appendChild(form);
  const heading = document.createElement("h2"); heading.textContent = "Nuestra lista"; home.appendChild(heading);
  const list = document.createElement("div"); list.className = "saved-letters"; home.appendChild(list);
  const key = "miChiquiMusic";
  const savedSongs = JSON.parse(localStorage.getItem(key) || "[]");
  const favoriteSong = savedSongs.find(entry => entry.song === "Can't Help Falling in Love");
  if (favoriteSong) {
    favoriteSong.note = "Porque sé lo mucho que te gusta y lo tanto que anhelás que nos casemos con ella, entonces quería guardarla acá para que siempre tenga un lugarcito en nuestra vida e historia.";
    localStorage.setItem(key, JSON.stringify(savedSongs));
  }
  function render() {
    list.innerHTML = "";
    const songs = JSON.parse(localStorage.getItem(key) || "[]");
    if (!songs.length) { const empty = document.createElement("p"); empty.textContent = "Todavía no hay canciones. Agregá la primera ♡"; list.appendChild(empty); }
    songs.forEach((entry,index) => {
      const card = document.createElement("article"); card.className = "letter-card";
      const name = document.createElement("h3"); name.textContent = entry.song; card.appendChild(name);
      if (entry.artist) { const artistText = document.createElement("p"); artistText.textContent = entry.artist; card.appendChild(artistText); }
      if (entry.note) { const description = document.createElement("p"); description.textContent = entry.note; card.appendChild(description); }
      if (entry.link) { const anchor = document.createElement("a"); anchor.href = entry.link; anchor.target = "_blank"; anchor.rel = "noopener noreferrer"; anchor.textContent = "Escuchar canción ♡"; anchor.className = "music-link"; card.appendChild(anchor); }
      const favorite = document.createElement("button"); favorite.className = "delete-letter"; favorite.textContent = entry.favorite ? "♥ Favorita" : "♡ Marcar favorita";
      favorite.addEventListener("click", () => { const updated = [...songs]; updated[index].favorite = !updated[index].favorite; localStorage.setItem(key,JSON.stringify(updated)); render(); });
      card.appendChild(favorite);
      const remove = document.createElement("button"); remove.className = "delete-letter"; remove.textContent = "Eliminar";
      remove.addEventListener("click", () => { const updated = songs.filter((item,i) => i !== index); localStorage.setItem(key,JSON.stringify(updated)); render(); });
      card.appendChild(remove); list.appendChild(card);
    });
  }
  form.addEventListener("submit", event => {
    event.preventDefault();
    let safeLink = "";
    if (link.value.trim()) { try { const parsed = new URL(link.value.trim()); if (parsed.protocol !== "https:" && parsed.protocol !== "http:") throw new Error(); safeLink = parsed.href; } catch(error) { alert("Ingresá un enlace válido de Spotify o YouTube."); return; } }
    const songs = JSON.parse(localStorage.getItem(key) || "[]");
    songs.push({song:song.value.trim(),artist:artist.value.trim(),link:safeLink,note:note.value.trim(),favorite:false});
    localStorage.setItem(key,JSON.stringify(songs)); form.reset(); render();
  });
  render();
  const back = document.createElement("button"); back.textContent = "Volver a Mi espacio"; back.addEventListener("click",showHome); home.appendChild(back);
}
showSection = function(item) {
  if (item.title === "Nuestros recuerdos") { showMemories(); return; }
  if (item.title === "Cartitas") { showLetters(); return; }
  if (item.title === "Fechas especiales") { showDates(); return; }
  if (item.title === "Nuestra música") { showMusic(); return; }
  if (item.title === "Para vos") { showForYou(); return; }
if (item.title === "Dates") { showNotes(); return; }
  const home = document.getElementById("home"); home.innerHTML = "";
  const title = document.createElement("h1"); title.textContent = item.title; home.appendChild(title);
  const back = document.createElement("button"); back.textContent = "Volver"; back.addEventListener("click", showHome); home.appendChild(back);
};
function showForYou() {
  const home = document.getElementById("home"); home.innerHTML = "";
  const title = document.createElement("h1"); title.textContent = "Para vos mi chiqui ♡"; home.appendChild(title);
  const subtitle = document.createElement("p"); subtitle.textContent = "Un rinconcito para acompañarte."; home.appendChild(subtitle);
  const heading = document.createElement("h2"); heading.textContent = "¿Cómo te sentís ahora?"; home.appendChild(heading);
  const moods = ["Feliz","Triste","Enojada","Cansada","Nerviosa","Tranquila","Preocupada","Desanimada","Emocionada","Aburrida"];
  const choices = document.createElement("div"); choices.className = "emotion-list"; home.appendChild(choices);
  const messages = {"Feliz":"Me encanta saber que estás feliz. Ojalá pudiera estar ahí para compartir este momento con vos. ♡","Triste":"Mi vida, no tenés que poder con todo siempre. Estoy acá para escucharte y acompañarte, incluso en los días difíciles. ♡","Enojada":"Está bien sentirse así. Tomate tu tiempo, respirá y acordate de que merecés tranquilidad. ♡","Cansada":"Ojalá pudieras descansar un ratito y dejar todo lo demás para después. No tenés que hacer todo hoy. ♡","Nerviosa":"Respirá despacito, mi amor. Andá de a poquito, no hace falta resolver todo ahora. ♡","Tranquila":"Disfrutá este ratito de calma, mi chiqui. También merecés días así. ♡","Preocupada":"No tenés que encontrar todas las respuestas ahora. Podés ir paso a paso. ♡","Desanimada":"Aunque hoy no salga todo como querés, eso no significa que no puedas lograrlo. Te mando un abrazo enorme. ♡","Emocionada":"¡Disfrutá muchísimo eso que te tiene así! Ojalá pudiera ver tu carita en este momento. ♡","Aburrida":"Quizás sea un buen momento para hacer algo distinto, escuchar música o recordar algún momento lindo. ♡"};
  const selected = new Set(selectedEmotions);
  const result = document.createElement("div"); result.className = "saved-letters"; home.appendChild(result);
  function render() {
    choices.innerHTML = ""; result.innerHTML = "";
    moods.forEach(mood => {
      const button = document.createElement("button"); button.className = "emotion" + (selected.has(mood) ? " selected" : ""); button.textContent = mood + (selected.has(mood) ? " ♥" : " ♡");
      button.addEventListener("click", () => { if (selected.has(mood)) selected.delete(mood); else selected.add(mood); selectedEmotions = [...selected]; localStorage.setItem("miChiquiEmotions",JSON.stringify(selectedEmotions)); render(); });
      choices.appendChild(button);
    });
    if (!selected.size) { const empty = document.createElement("p"); empty.textContent = "Elegí cómo te sentís y voy a mostrarte unas palabras para ese momento. ♡"; result.appendChild(empty); return; }
    [...selected].forEach(mood => {
      const card = document.createElement("article"); card.className = "letter-card";
      const name = document.createElement("h3"); name.textContent = "Para cuando estés " + mood.toLowerCase(); card.appendChild(name);
      const message = document.createElement("p"); message.textContent = messages[mood]; card.appendChild(message);
      result.appendChild(card);
    });
  }
  render();
  const back = document.createElement("button"); back.textContent = "Volver a Mi espacio"; back.addEventListener("click",showHome); home.appendChild(back);
}
showForYou = function() {
  const home = document.getElementById("home"); home.innerHTML = "";
  const title = document.createElement("h1"); title.textContent = "Para vos mi chiqui ♡"; home.appendChild(title);
  const subtitle = document.createElement("p"); subtitle.textContent = "Te dejo unas palabritas para acompa\u00f1arte mi vida."; home.appendChild(subtitle);
  const heading = document.createElement("h2"); heading.textContent = "¿Cómo te sentís ahora?"; home.appendChild(heading);
  const moods = ["Feliz","Triste","Enojada","Cansada","Nerviosa","Tranquila","Preocupada","Desanimada","Emocionada","Aburrida"];
  const messages = {
    "Feliz": "Ay, mi chiqui, qué lindo saber que estás feliz. Ojalá pudiera verte esa carita y darte un abrazo enorme. Me encanta verte bien, mi amor. ♡",
    "Triste": "Chiqui, vení, dame un abracito. No tenés que estar bien todo el tiempo, ¿sabés? Si hoy no es un buen día, no pasa nada. Yo estoy acá, mi vida. Te amo muchísimo. ♡",
    "Enojada": "Mi vida, sé que capaz hoy no estás de humor y está bien. No quiero que sientas que tenés que fingir estar bien conmigo. Quiero escucharte y acompañarte, incluso en esos días.",
    "Cansada": "Mi amor, descansá un poquito. No tenés que hacer todo ni preocuparte por todo ahora. Ojalá pudiera estar ahí para abrazarte y llenarte de besitos. Te amo, chiquita preciosa.",
    "Nerviosa": "Chiqui, respirá un poquito, mi amor. No tenés que resolver todo ahora ni hacer todo perfecto. Confío en vos y sé que podés. Y si necesitás que te acompañe, acá estoy. ♡",
    "Tranquila": "Qué lindo que estés tranquilita, mi vida. Ojalá puedas disfrutar de este ratito y no preocuparte por nada. Te mando muchos besitos. ♡",
    "Preocupada": "Mi chiquita, no quiero que tengas que cargar con todo vos sola. Si querés contarme qué pasa, te escucho. Y si no querés hablar, también puedo simplemente acompañarte.",
    "Desanimada": "Mi amor, no te olvides de lo mucho que valés. Aunque hoy las cosas no salgan como querés, eso no cambia lo increíble que sos. Estoy muy orgulloso de vos.",
    "Emocionada": "Ayyy, mi chiqui, me encanta cuando estás así de emocionada. Quiero que me cuentes todo, hasta el detalle más chiquito. Me hace feliz verte disfrutar de las cosas. ♡",
    "Aburrida": "¿Y si hacemos algo juntitos, mi vida? Aunque sea hablar un ratito, contarnos cualquier pavada o simplemente estar juntos. Siempre me gusta compartir tiempo con vos. ♡"
  };
  const choices = document.createElement("div"); choices.className = "emotion-list"; home.appendChild(choices);
  const result = document.createElement("div"); result.className = "saved-letters"; home.appendChild(result);
  const selected = new Set(selectedEmotions);
  function render() {
    choices.innerHTML = ""; result.innerHTML = "";
    moods.forEach(mood => {
      const button = document.createElement("button");
      button.className = "emotion" + (selected.has(mood) ? " selected" : "");
      button.textContent = mood + (selected.has(mood) ? " ♡" : "");
      button.addEventListener("click", () => {
        if (selected.has(mood)) selected.delete(mood); else selected.add(mood);
        selectedEmotions = [...selected];
        localStorage.setItem("miChiquiEmotions", JSON.stringify(selectedEmotions));
        render();
      });
      choices.appendChild(button);
    });
    if (!selected.size) {
      const empty = document.createElement("p");
      empty.textContent = "Elegí cómo te sentís y te voy a dejar una notita, mi amor. ♡";
      result.appendChild(empty); return;
    }
    [...selected].forEach(mood => {
      const card = document.createElement("article"); card.className = "letter-card";
      const name = document.createElement("h3"); name.textContent = "Para cuando estés " + mood.toLowerCase(); card.appendChild(name);
      const message = document.createElement("p"); message.textContent = messages[mood]; card.appendChild(message);
      result.appendChild(card);
    });
  }
  render();
  const back = document.createElement("button"); back.textContent = "Volver a Mi espacio"; back.addEventListener("click", showHome); home.appendChild(back);
};
showForYou = function() {
  const home = document.getElementById("home"); home.innerHTML = "";
  const title = document.createElement("h1"); title.textContent = "Para vos mi chiqui ♡"; home.appendChild(title);
  const subtitle = document.createElement("p"); subtitle.textContent = "Te dejo unas palabritas para acompa\u00f1arte mi vida."; home.appendChild(subtitle);
  const heading = document.createElement("h2"); heading.textContent = "¿Cómo te sentís ahora?"; home.appendChild(heading);
  const moods = ["Feliz","Triste","Enojada","Cansada","Nerviosa","Tranquila","Preocupada","Desanimada","Emocionada","Aburrida"];
  const messages = {
    "Feliz": ["Ay, mi chiqui, qué lindo saber que estás feliz. Ojalá pudiera verte esa carita y darte un abrazo enorme. Me encanta verte bien, mi amor. ♡","Mi vida, espero que disfrutes muchísimo este momento. Me encanta cuando me contás las cosas que te hacen feliz. Quiero compartir muchas de esas alegrías con vos.","Ayyy, qué lindo que estés contenta, mi amor. Ojalá pudiera estar ahí para abrazarte y darte muchos besitos. Te amo muchísimo."],
    "Triste": ["Chiqui, vení, dame un abracito. No tenés que estar bien todo el tiempo, ¿sabés? Si hoy no es un buen día, no pasa nada. Yo estoy acá, mi vida. Te amo muchísimo. ♡","Mi amor, quisiera poder abrazarte ahora mismo y hacerte sentir un poquito mejor. No estás sola, chiquita. Contá conmigo para lo que necesites.","Mi chiqui preciosa, si hoy tenés ganas de llorar, hacelo. No tenés que guardarte lo que sentís. Yo quiero estar para vos también en los días difíciles."],
    "Enojada": ["Mi vida, sé que capaz hoy no estás de humor y está bien. No quiero que sientas que tenés que fingir estar bien conmigo. Quiero escucharte y acompañarte, incluso en esos días.","Chiqui, tomate tu tiempito, mi amor. Si necesitás hablar, te escucho; y si necesitás un ratito para vos, también está bien. Te amo.","No quiero que tengas que esconder cómo te sentís conmigo, mi vida. Podemos hablar de lo que pasó cuando estés más tranquila. Estoy acá."],
    "Cansada": ["Mi amor, descansá un poquito. No tenés que hacer todo ni preocuparte por todo ahora. Ojalá pudiera estar ahí para abrazarte y llenarte de besitos. Te amo, chiquita preciosa.","Chiqui, por hoy dejá algunas cosas para después. Quiero que también tengas tiempo para vos, para descansar y estar tranquilita. Te mando un abrazo enorme.","Mi vida, ojalá pudiera acostarte, taparte con una mantita y darte muchos besitos. Descansá, que te lo merecés."],
    "Nerviosa": ["Chiqui, respirá un poquito, mi amor. No tenés que resolver todo ahora ni hacer todo perfecto. Confío en vos y sé que podés. Y si necesitás que te acompañe, acá estoy. ♡","Mi chiquita, andá de a poquito. No te adelantes a todo lo que puede pasar. Estoy orgulloso de vos y confío muchísimo en vos.","Amor, ojalá pudiera darte un abrazo ahora. Quiero que sepas que no tenés que poder con todo sola. Estoy para acompañarte."],
    "Tranquila": ["Qué lindo que estés tranquilita, mi vida. Ojalá puedas disfrutar de este ratito y no preocuparte por nada. Te mando muchos besitos. ♡","Mi chiqui, disfrutá de este momento. Me gusta imaginarte tranquila, haciendo tus cositas y estando bien. Te amo mucho.","Ojalá tengas muchos días así, mi amor. De esos en los que no hay apuro por nada y simplemente podés disfrutar. Te mando un beso enorme."],
    "Preocupada": ["Mi chiquita, no quiero que tengas que cargar con todo vos sola. Si querés contarme qué pasa, te escucho. Y si no querés hablar, también puedo simplemente acompañarte.","Mi vida, vamos de a poquito. No hace falta encontrar una solución para todo ahora mismo. Quiero que sepas que podés contar conmigo.","Chiqui, sé que a veces la cabeza no para, pero no tenés que resolver todo hoy. Estoy acá para escucharte y darte todos los abrazos que necesites."],
    "Desanimada": ["Mi amor, no te olvides de lo mucho que valés. Aunque hoy las cosas no salgan como querés, eso no cambia lo increíble que sos. Estoy muy orgulloso de vos.","Chiqui, no te trates tan mal cuando algo no sale como esperabas. Vos también merecés paciencia y cariño. Yo creo en vos muchísimo.","Mi vida, capaz hoy no tenés muchas ganas de nada, pero quiero recordarte que sos una persona increíble. No te rindas con vos misma, ¿sí?"],
    "Emocionada": ["Ayyy, mi chiqui, me encanta cuando estás así de emocionada. Quiero que me cuentes todo, hasta el detalle más chiquito. Me hace feliz verte disfrutar de las cosas. ♡","Mi amor, contame todooo. Quiero saber qué pasó, qué pensaste y por qué estás tan emocionada. Me encanta escucharte hablar de lo que te gusta.","Ojalá pudiera estar ahí para vivir ese momento con vos. Disfrutalo muchísimo, mi vida. Te merecés cosas lindas."],
    "Aburrida": ["¿Y si hacemos algo juntitos, mi vida? Aunque sea hablar un ratito, contarnos cualquier pavada o simplemente estar juntos. Siempre me gusta compartir tiempo con vos. ♡","Chiqui, ¿y si buscamos algo para hacer? Podemos hablar de cualquier cosa, recordar algún momento nuestro o simplemente hacernos compañía.","Mi amor, si estuviera ahí seguro encontraríamos alguna pavada para hacer juntos. Igual, hasta aburrirme con vos me gustaría. ♡"]
  }; 
  const extraMessages = {
    "Feliz": [
      "Mi chiqui, ojalá pudiera congelar esos momentos en los que estás así de feliz para poder revivirlos con vos una y otra vez.",
      "Me encanta saber que hoy tenés motivos para sonreír. Nunca dejes de disfrutar esas cositas lindas, mi vida.",
      "Si pudiera pedir algo ahora, sería estar a tu lado y compartir esa felicidad con vos.",
      "Quiero ser esa persona a la que siempre tengas ganas de contarle tus buenas noticias. Me encanta escucharte.",
      "Tu sonrisa es una de mis cosas favoritas. Espero que hoy tengas muchísimos motivos para mostrarla.",
      "Disfrutá mucho, mi princesa. Te merecés momentos lindos, días tranquilos y un montón de alegrías.",
      "Qué suerte tengo de poder compartir mi vida con alguien como vos. Te amo muchísimo, chiquita."
    ],
    "Triste": [
      "Mi vida, no tenés que encontrarle el lado bueno a todo. A veces simplemente necesitamos un abrazo y un poquito de tiempo.",
      "Ojalá pudiera estar ahí para abrazarte fuerte y recordarte que no tenés que atravesar todo sola.",
      "Aunque hoy no tengas ganas de sonreír, seguís siendo esa personita maravillosa que tanto amo.",
      "No quiero apurarte a sentirte mejor. Quiero acompañarte mientras pasa, a tu ritmo y como necesites.",
      "Mi chiqui, si pudiera te llenaría de besitos hasta sacarte aunque sea una sonrisita.",
      "Un día difícil no significa una vida difícil, mi amor. Mañana puede sentirse un poquito diferente.",
      "Te amo también en esos días en los que no te sentís bien, cuando estás sensible o cuando no sabés qué te pasa."
    ],
    "Enojada": [
      "Mi vida, está bien que tengas tus momentos. No quiero que sientas que tenés que esconder lo que te molesta.",
      "Respirá, mi chiqui. No hace falta resolver todo mientras estás enojada. Podemos hablar cuando quieras.",
      "Quiero entender qué te pasa, no discutir por quién tiene razón. Tus sentimientos también me importan.",
      "Si necesitás un ratito para despejarte, tomátelo tranquila. Después podemos hablar con cariño.",
      "No tenés que estar siempre de buen humor para que quiera estar con vos. Te quiero en todos tus días.",
      "Mi vida, ojalá podamos escucharnos incluso cuando pensamos distinto. Siempre quiero encontrar la manera de entendernos.",
      "Te mando un abrazo enorme, de esos que duran mucho y hacen que todo se sienta un poquito más tranquilo."
    ],
    "Cansada": [
      "Mi chiquita preciosa, hoy también merecés que te cuiden. No te olvides de vos mientras hacés tantas cosas.",
      "Dejá el mundo en pausa un ratito, mi vida. Tomá agüita, acostate y descansá.",
      "No tenés que demostrarle nada a nadie estando agotada. Ya hacés muchísimo y estoy orgulloso de vos.",
      "Ojalá pudiera prepararte algo rico, acomodarte la mantita y dejarte descansar abrazadita a mí.",
      "Permitite no hacer nada por un rato. Descansar también es importante, mi amor.",
      "Si hoy fue un día largo, espero que esta notita te recuerde que alguien te quiere muchísimo.",
      "Cerrá los ojitos un ratito, mi vida. Te mando todos los besitos que te daría si estuviera ahí."
    ],
    "Nerviosa": [
      "Mi chiqui, no necesitás tener todo bajo control. Podés ir paso a paso y confiar en vos.",
      "Sé que a veces las cosas parecen enormes antes de empezar, pero quiero que recuerdes todo lo que sos capaz de hacer.",
      "Respirá profundo, mi amor. Este momento va a pasar y no tenés que enfrentarlo todo de una sola vez.",
      "No importa si algo no sale perfecto. Lo importante es que estás intentando y eso ya vale muchísimo.",
      "Quiero que puedas mirarte con la misma confianza con la que yo te miro. Sos mucho más capaz de lo que pensás.",
      "Si necesitás hablar antes de hacer eso que te pone nerviosa, acá estoy para escucharte.",
      "Te mando un abrazo apretadito. Ojalá te ayude a sentirte acompañada y un poquito más segura."
    ],
    "Tranquila": [
      "Mi vida, disfrutá de esa paz. Ojalá pudiera compartir ese ratito con vos, sin apuros y sin preocupaciones.",
      "Me gusta imaginarte tranquila, haciendo tus cositas y disfrutando de tu propio mundo.",
      "Guardá este momento lindo en tu memoria, mi chiqui. También hay que disfrutar cuando todo está bien.",
      "Ojalá pudiera sentarme al lado tuyo, agarrarte la mano y simplemente estar juntos.",
      "No hay nada que resolver ahora. Disfrutá de este ratito y regalate un poquito de cariño.",
      "Qué lindo sería terminar el día abrazaditos, hablando de cualquier cosa hasta quedarnos dormidos.",
      "Espero que tengas muchos días así, mi amor. Te merecés toda esa tranquilidad."
    ],
    "Preocupada": [
      "Mi chiqui, no dejes que todas las cosas que podrían pasar te impidan disfrutar de lo que está pasando ahora.",
      "No tenés que encontrar todas las respuestas hoy. Algunas cosas se acomodan de a poquito.",
      "Quiero que sepas que podés contarme lo que te preocupa, incluso si todavía no sabés cómo explicarlo.",
      "Mi amor, tratá de no exigirte tener siempre una solución. También está bien pedir ayuda.",
      "Vamos de a un pasito, mi vida. No hace falta cargar con todo al mismo tiempo.",
      "A veces la cabeza imagina mil problemas que todavía no existen. Tratá de darte un descansito.",
      "Ojalá pudiera abrazarte y ayudarte a dejar esas preocupaciones afuera por un ratito."
    ],
    "Desanimada": [
      "Mi chiquita, no midas tu valor por un resultado, una nota o algo que no salió como esperabas.",
      "Estoy orgulloso de vos incluso cuando vos misma sentís que no hiciste suficiente.",
      "No te compares con nadie, mi amor. Tu camino es tuyo y no tenés que recorrerlo al ritmo de los demás.",
      "Acordate de todas las veces que pensaste que no podías y terminaste saliendo adelante.",
      "No tenés que tener ganas de todo todos los días. Date tiempo y tratate con cariño.",
      "Quiero que algún día puedas ver en vos todas las cosas lindas que yo veo cuando te miro.",
      "Mi vida, no te rindas con tus sueños por un día malo. Todavía te esperan un montón de cosas lindas."
    ],
    "Emocionada": [
      "Mi chiqui, me encanta imaginarte contando todo rapidísimo porque no podés contener la emoción.",
      "Quiero escuchar cada detalle, incluso los que para vos parecen insignificantes. Todo lo tuyo me interesa.",
      "Ojalá pudiera verte la carita cuando hablás de algo que te encanta. Seguro estás preciosa.",
      "Disfrutá muchísimo este momento, mi amor. Después quiero que me cuentes cómo lo viviste.",
      "Me hace feliz que tengas cosas que te ilusionen. Nunca pierdas esa manera tan linda de entusiasmarte.",
      "Quiero estar en primera fila para celebrar cada una de tus alegrías, grandes o chiquitas.",
      "Ayyy, mi vida, contame todo. Sabés que me encanta escucharte hablar de las cosas que te hacen feliz."
    ],
    "Aburrida": [
      "Mi amor, si estuviera ahí seguro terminaríamos haciendo alguna pavada y riéndonos de cualquier cosa.",
      "¿Y si recordamos alguno de nuestros momentos juntos? Siempre encuentro algo lindo para recordar con vos.",
      "Te propongo una misión: pensar en algo que podamos hacer juntos la próxima vez que nos veamos.",
      "Podemos hablar de cualquier cosa, desde lo más importante hasta la pavada más grande del mundo.",
      "Si pudiera elegir dónde estar ahora, probablemente sería al lado tuyo, aunque no hiciéramos absolutamente nada.",
      "Ojalá pudiera aparecer de sorpresa para robarte unos besitos y hacerte compañía.",
      "Mi chiqui, hasta un día aburrido puede convertirse en uno lindo si lo compartimos juntos."
    ]
  };

  Object.keys(extraMessages).forEach(mood => {
    messages[mood].push(...extraMessages[mood]);
  });

  const chosenamessages = {};
  const selected = new Set(selectedEmotions);
  const choices = document.createElement("div"); choices.className = "emotion-list"; home.appendChild(choices);
  const result = document.createElement("div"); result.className = "saved-letters"; home.appendChild(result);
  function render() {
    choices.innerHTML = ""; result.innerHTML = "";
    moods.forEach(mood => {
      const button = document.createElement("button"); button.className = "emotion" + (selected.has(mood) ? " selected" : "");
      button.textContent = mood + (selected.has(mood) ? " ♡" : "");
      button.addEventListener("click", () => {
        if (selected.has(mood)) selected.delete(mood); else selected.add(mood);
        selectedEmotions = [...selected]; localStorage.setItem("miChiquiEmotions", JSON.stringify(selectedEmotions)); render();
      });
      choices.appendChild(button);
    });
    if (!selected.size) { const empty = document.createElement("p"); empty.textContent = "Elegí cómo te sentís y te voy a dejar una notita, mi amor. ♡"; result.appendChild(empty); return; }
    [...selected].forEach(mood => {
      if (!chosenamessages[mood]) { const options = messages[mood]; chosenamessages[mood] = options[Math.floor(Math.random() * options.length)]; }
      const card = document.createElement("article"); card.className = "letter-card";
      const name = document.createElement("h3"); name.textContent = "Para cuando estés " + mood.toLowerCase(); card.appendChild(name);
      const message = document.createElement("p"); message.textContent = chosenamessages[mood]; card.appendChild(message);
      const another = document.createElement("button");
      another.textContent = "Otra notita para mí ♡";
      another.addEventListener("click", () => {
        const options = messages[mood].filter(option => option !== chosenamessages[mood]);
        chosenamessages[mood] = options[Math.floor(Math.random() * options.length)];
        render();
      });
      card.appendChild(another);
      result.appendChild(card);
    });
  }
  render();
  const back = document.createElement("button"); back.textContent = "Volver a Mi espacio"; back.addEventListener("click", showHome); home.appendChild(back);
};
const chiquiThemes = [
{name:"Rosa",background:"#F9EEF2",primary:"#C77F9D",text:"#A45D78",details:"#EBCAD8"},
{name:"Lila",background:"#F2EFF9",primary:"#9B86C5",text:"#79649F",details:"#DCD2F0"},
{name:"Celeste",background:"#EDF5FA",primary:"#75A9C8",text:"#527F9D",details:"#C9E1EF"},
{name:"Verde",background:"#EFF5EF",primary:"#82A887",text:"#587C5D",details:"#D1E5D2"},
{name:"Crema",background:"#F7F2E8",primary:"#B99A69",text:"#8C754F",details:"#E9DFC8"},
{name:"Durazno",background:"#FFF0E9",primary:"#D99578",text:"#A96D55",details:"#F6D5C5"}
];
function applyChiquiTheme(theme) {
  document.documentElement.style.setProperty("--background",theme.background);
  document.documentElement.style.setProperty("--primary",theme.primary);
  document.documentElement.style.setProperty("--text",theme.text);
  document.documentElement.style.setProperty("--details",theme.details);
  localStorage.setItem("miChiquiTheme",JSON.stringify(theme));
}
function loadChiquiTheme() {
  const saved = localStorage.getItem("miChiquiTheme");
  if (saved) { try { applyChiquiTheme(JSON.parse(saved)); } catch(error) { localStorage.removeItem("miChiquiTheme"); } }
}
loadChiquiTheme();
showHome = function() {
  emotions.classList.add("hidden");
  let home = document.getElementById("home");
  if (home) home.remove();
  home = document.createElement("section"); home.id = "home"; home.className = "home"; document.querySelector(".app").appendChild(home);
  const heart = document.createElement("div"); heart.className = "heart"; heart.textContent = "♡"; home.appendChild(heart);
  const title = document.createElement("h1"); title.textContent = "Mi espacio ♡"; home.appendChild(title);
  const greeting = document.createElement("p"); greeting.textContent = "Hola mi chiqui"; home.appendChild(greeting);
  const note = document.createElement("p"); note.className = "home-note"; note.textContent = "Este rinconcito es todo tuyo."; home.appendChild(note);
  const summary = document.createElement("p"); summary.className = "emotion-summary"; summary.textContent = selectedEmotions.length ? "Hoy te sentís: " + selectedEmotions.join(", ") : ""; home.appendChild(summary);

  const settings = document.createElement("button"); settings.className = "home-card"; settings.textContent = "Personalizar los colores ♡"; settings.addEventListener("click",showSettings); home.appendChild(settings);
  const cards = document.createElement("div"); cards.className = "home-cards"; home.appendChild(cards);
  sections.forEach(item => { const button = document.createElement("button"); button.className = "home-card"; button.textContent = item.title + " ♡"; button.addEventListener("click",() => showSection(item)); cards.appendChild(button); });
  createBottomNavigation("home");
};
function showSettings() {
  const home = document.getElementById("home"); home.innerHTML = "";
  const title = document.createElement("h1"); title.textContent = "Un espacio a tu color ♡"; home.appendChild(title);
  const subtitle = document.createElement("p"); subtitle.textContent = "Elegí los colores que más te gusten, mi chiqui."; home.appendChild(subtitle);
  const list = document.createElement("div"); list.className = "saved-letters"; home.appendChild(list);
  let current = "Rosa";
  const saved = localStorage.getItem("miChiquiTheme");
  if (saved) { try { current = JSON.parse(saved).name; } catch(error) {} }
  chiquiThemes.forEach(theme => {
    const button = document.createElement("button"); button.className = "home-card";
    button.style.backgroundColor = theme.background; button.style.color = theme.text; button.style.border = "2px solid " + theme.details;
    button.textContent = theme.name + (current === theme.name ? "  ✓" : "  ♡");
    button.addEventListener("click",() => { applyChiquiTheme(theme); showSettings(); });
    list.appendChild(button);
  });
  const back = document.createElement("button"); back.textContent = "Volver a Mi espacio"; back.addEventListener("click",showHome); home.appendChild(back);
}





// Navegacion principal de Mi Chiqui
function createBottomNavigation(active) {
  const oldNav = document.getElementById("bottomNavigation");
  if (oldNav) oldNav.remove();
  const nav = document.createElement("nav");
  nav.id = "bottomNavigation";
  nav.className = "bottom-navigation";
  const items = [{id:"home",label:"Inicio",icon:"⌂"},{id:"calendar",label:"Calendario",icon:"▦"},{id:"stats",label:"Estadísticas",icon:"▥"},{id:"space",label:"Mi espacio",icon:"♡"}];
  items.forEach(item => {
    const button = document.createElement("button");
    button.className = "nav-item" + (active === item.id ? " active" : "");
    button.innerHTML = "<span class=\"nav-icon\">" + item.icon + "</span><span>" + item.label + "</span>";
    button.addEventListener("click", () => {
      if (item.id === "home" || item.id === "space") showHome();
      else if (item.id === "calendar") showCalendar();
      else if (item.id === "stats") showStatistics();
    });
    nav.appendChild(button);
  });
  document.body.appendChild(nav);
}




// Calendario de Mi Chiqui
function showCalendar() {
  const home = document.getElementById("home");
  home.innerHTML = "";
  const title = document.createElement("h1");
  title.textContent = "Nuestro calendario ♡";
  home.appendChild(title);
  const subtitle = document.createElement("p");
  subtitle.textContent = "Un día a la vez mi chiqui.";
  home.appendChild(subtitle);
  const today = new Date();
  const month = today.getMonth();
  const year = today.getFullYear();
  const heading = document.createElement("h2");
  heading.textContent = new Date(year, month).toLocaleDateString("es-UY", {month:"long",year:"numeric"});
  home.appendChild(heading);
  const grid = document.createElement("div");
  grid.className = "calendar-grid";
  ["Lun","Mar","Mié","Jue","Vie","Sáb","Dom"].forEach(day => { const cell = document.createElement("div"); cell.className = "calendar-day-name"; cell.textContent = day; grid.appendChild(cell); });
  const firstDay = (new Date(year, month, 1).getDay() + 6) % 7;
  const totalDays = new Date(year, month + 1, 0).getDate();
  for (let i = 0; i < firstDay; i++) { const blank = document.createElement("div"); grid.appendChild(blank); }
  for (let day = 1; day <= totalDays; day++) { const cell = document.createElement("button"); cell.className = "calendar-date"; cell.textContent = day; if (day === today.getDate()) cell.classList.add("today"); cell.addEventListener("click", () => { alert("Elegiste el " + day + " de " + heading.textContent); }); grid.appendChild(cell); }
  home.appendChild(grid);
  createBottomNavigation("calendar");
}
// Historial diario de emociones y actividad
function saveDailyEmotions(emotions) {
  const key = "miChiquiDailyHistory";
  const history = JSON.parse(localStorage.getItem(key) || "{}");
  const today = miChiquiDateKey(new Date());

  if (!history[today]) {
    history[today] = {emotions: [], visits: [], letters: []};
  }

  const day = history[today];
  const now = new Date().toISOString(); 
// Registrar cada entrada a la aplicación
if (!Array.isArray(day.appEntries)) {
  day.appEntries = [];
}
day.appEntries.push({ time: now });
  if (!Array.isArray(day.emotionEntries)) {
    day.emotionEntries = [];

    if (day.emotions && day.emotions.length) {
      day.emotionEntries.push({
        emotions: [...day.emotions],
        time: day.emotionTime || day.updatedAt || now
      });
    }
  }

  day.emotionEntries.push({
    emotions: [...emotions],
    time: now
  });

  day.emotions = [...emotions];
  day.emotionTime = now;
  day.updatedAt = now;

  localStorage.setItem(key, JSON.stringify(history));
}

function recordMiChiquiVisit(section) {
  const key = "miChiquiDailyHistory";
  const history = JSON.parse(localStorage.getItem(key) || "{}");
  const today = miChiquiDateKey(new Date());

  if (!history[today]) {
    history[today] = {emotions: [], visits: [], letters: []};
  }

  if (!Array.isArray(history[today].visits)) {
    history[today].visits = [];
  }

  history[today].visits.push({
    section: section,
    time: new Date().toISOString()
  });

  localStorage.setItem(key, JSON.stringify(history));
}

const originalShowSectionForHistory = showSection;
showSection = function(item) {
  recordMiChiquiVisit(item.title);
  return originalShowSectionForHistory(item);
};
// Cartitas: abrir cada una individualmente y registrar lecturas
openLetterCategory = function(category) {
  recordMiChiquiVisit("Cartitas: " + category);
  const home = document.getElementById("home");
  function showCategory() {
    home.innerHTML = "";
    const title = document.createElement("h1"); title.textContent = category; home.appendChild(title);
    const subtitle = document.createElement("p"); subtitle.textContent = "Elegí una cartita para leerla, mi amor ♡"; home.appendChild(subtitle);
    const key = "miChiquiLetters_" + category;
    const list = document.createElement("div"); list.className = "saved-letters"; home.appendChild(list);
    const letters = JSON.parse(localStorage.getItem(key) || "[]");
    if (!letters.length) { const empty = document.createElement("p"); empty.textContent = "Todavía no hay cartitas en esta categoría."; list.appendChild(empty); }
    letters.forEach((letter,index) => {
      const card = document.createElement("article"); card.className = "letter-card";
      const open = document.createElement("button"); open.textContent = letter.title + " ♡";
      open.addEventListener("click", () => showLetter(letter)); card.appendChild(open);
      const remove = document.createElement("button"); remove.textContent = "Eliminar"; remove.className = "delete-letter";
      remove.addEventListener("click", () => { const updated = JSON.parse(localStorage.getItem(key) || "[]").filter((entry,i) => i !== index); localStorage.setItem(key,JSON.stringify(updated)); showCategory(); });
      card.appendChild(remove); list.appendChild(card);
    });
    const back = document.createElement("button"); back.textContent = "Volver a Cartitas"; back.addEventListener("click",showLetters); home.appendChild(back);
  }
  function showLetter(letter) {
    const id = category + "::" + letter.title;
    const counts = JSON.parse(localStorage.getItem("miChiquiLetterOpens") || "{}");
    counts[id] = (counts[id] || 0) + 1;
    localStorage.setItem("miChiquiLetterOpens",JSON.stringify(counts));
    const historyKey = "miChiquiDailyHistory";
    const history = JSON.parse(localStorage.getItem(historyKey) || "{}");
    const today = miChiquiDateKey(new Date());
    if (!history[today]) history[today] = {emotions:[],visits:[],letters:[]};
    if (!history[today].letters) history[today].letters = [];
    history[today].letters.push({category:category,title:letter.title,time:new Date().toISOString()});
    localStorage.setItem(historyKey,JSON.stringify(history));
    home.innerHTML = "";
    const title = document.createElement("h1"); title.textContent = letter.title; home.appendChild(title);
    const content = document.createElement("p"); content.className = "letter-card"; content.textContent = letter.content; home.appendChild(content);
    const back = document.createElement("button"); back.textContent = "Volver a las cartitas"; back.addEventListener("click",showCategory); home.appendChild(back);
  }
  showCategory();
};

// Cartitas con sobres animados
openLetterCategory = function(category) {
  recordMiChiquiVisit("Cartitas: " + category);

  const home = document.getElementById("home");
  const key = "miChiquiLetters_" + category;

  function showCategory() {
    home.innerHTML = "";

    const title = document.createElement("h1");
    title.textContent = category;
    home.appendChild(title);

    const subtitle = document.createElement("p");
    subtitle.textContent = "Unas palabras escritas especialmente para vos ♡";
    home.appendChild(subtitle);

    const form = document.createElement("form");
    form.className = "letter-form";

    const heading = document.createElement("input");
    heading.placeholder = "Título de la cartita";
    heading.required = true;
    heading.className = "letter-input";

    const content = document.createElement("textarea");
    content.placeholder = "Escribí acá tu cartita...";
    content.required = true;
    content.className = "letter-textarea";

    const save = document.createElement("button");
    save.type = "submit";
    save.textContent = "Guardar cartita ♡";

    form.append(heading, content, save);
    home.appendChild(form);

    const listTitle = document.createElement("h2");
    listTitle.textContent = "Cartitas guardadas";
    home.appendChild(listTitle);

    const list = document.createElement("div");
    list.className = "saved-letters";
    home.appendChild(list);

    function renderSaved() {
      list.innerHTML = "";

      const letters = JSON.parse(localStorage.getItem(key) || "[]");

      if (!letters.length) {
        const empty = document.createElement("p");
        empty.textContent = "Todavía no hay cartitas en esta categoría.";
        list.appendChild(empty);
      }

      letters.forEach((letter, index) => {
        const card = document.createElement("article");
        card.className = "letter-envelope";

        const envelope = document.createElement("button");
        envelope.type = "button";
        envelope.className = "letter-envelope-button";
        envelope.setAttribute("aria-label", "Abrir cartita: " + letter.title);

        const flap = document.createElement("span");
        flap.className = "letter-envelope-flap";

        const heart = document.createElement("span");
        heart.className = "letter-envelope-heart";
        heart.textContent = "♡";

        envelope.append(flap, heart);

        const label = document.createElement("p");
        label.textContent = letter.title;
        label.className = "letter-envelope-title";

        const body = document.createElement("div");
        body.className = "letter-envelope-content";
        body.hidden = true;

        const message = document.createElement("p");
        message.textContent = letter.content;
        body.appendChild(message);

        let opened = false;

        envelope.addEventListener("click", () => {
          opened = !opened;
          body.hidden = !opened;
          card.classList.toggle("letter-open", opened);
          envelope.setAttribute(
            "aria-label",
            opened ? "Cerrar cartita" : "Abrir cartita: " + letter.title
          );
        });

        const remove = document.createElement("button");
        remove.type = "button";
        remove.textContent = "Eliminar";
        remove.className = "delete-letter";

        remove.addEventListener("click", () => {
          const updated = JSON.parse(localStorage.getItem(key) || "[]")
            .filter((entry, i) => i !== index);

          localStorage.setItem(key, JSON.stringify(updated));
          renderSaved();
        });

        card.append(envelope, label, body, remove);
        list.appendChild(card);
      });
    }

    form.addEventListener("submit", event => {
      event.preventDefault();

      const letters = JSON.parse(localStorage.getItem(key) || "[]");

      letters.push({
        title: heading.value.trim(),
        content: content.value.trim()
      });

      localStorage.setItem(key, JSON.stringify(letters));

      form.reset();
      renderSaved();
    });

    renderSaved();

    const back = document.createElement("button");
    back.textContent = "Volver a Cartitas";
    back.addEventListener("click", showLetters);
    home.appendChild(back);
  }

  function showLetter(letter) {
    const id = category + "::" + letter.title;
    const counts = JSON.parse(localStorage.getItem("miChiquiLetterOpens") || "{}");

    counts[id] = (counts[id] || 0) + 1;
    localStorage.setItem("miChiquiLetterOpens", JSON.stringify(counts));

    const historyKey = "miChiquiDailyHistory";
    const history = JSON.parse(localStorage.getItem(historyKey) || "{}");
    const today = miChiquiDateKey(new Date());

    if (!history[today]) {
      history[today] = {emotions: [], visits: [], letters: []};
    }

    if (!history[today].letters) {
      history[today].letters = [];
    }

    history[today].letters.push({
      category: category,
      title: letter.title,
      time: new Date().toISOString()
    });

    localStorage.setItem(historyKey, JSON.stringify(history));

    home.innerHTML = "";

    const title = document.createElement("h1");
    title.textContent = letter.title;
    home.appendChild(title);

    const text = document.createElement("p");
    text.className = "letter-card";
    text.textContent = letter.content;
    home.appendChild(text);

    const back = document.createElement("button");
    back.textContent = "Volver a las cartitas";
    back.addEventListener("click", showCategory);
    home.appendChild(back);
  }

  showCategory();
};

// Calendario conectado al historial diario: detalle de emociones, visitas y cartitas
showCalendar = function() {
  const home = document.getElementById("home");
  let visibleMonth = new Date(new Date().getFullYear(),new Date().getMonth(),1);
  let selectedDate = miChiquiDateKey(new Date());

  function displayTime(value) {
    if (!value) return "";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "";
    return date.toLocaleTimeString("es-UY",{hour:"2-digit",minute:"2-digit"});
  }

  function renderCalendar() {
    home.innerHTML = "";
    const title = document.createElement("h1"); title.textContent = "Nuestro calendario ♡"; home.appendChild(title);
    const subtitle = document.createElement("p"); subtitle.textContent = "Un día a la vez mi chiqui."; home.appendChild(subtitle);

    const monthBar = document.createElement("div"); monthBar.className = "calendar-month-bar";
    const previous = document.createElement("button"); previous.type = "button"; previous.textContent = "‹";
    previous.setAttribute("aria-label","Mes anterior");
    previous.addEventListener("click",() => { visibleMonth = new Date(visibleMonth.getFullYear(),visibleMonth.getMonth()-1,1); selectedDate = miChiquiDateKey(visibleMonth); renderCalendar(); });
    const heading = document.createElement("h2"); heading.textContent = visibleMonth.toLocaleDateString("es-UY",{month:"long",year:"numeric"});
    const next = document.createElement("button"); next.type = "button"; next.textContent = "›";
    next.setAttribute("aria-label","Mes siguiente");
    next.addEventListener("click",() => { visibleMonth = new Date(visibleMonth.getFullYear(),visibleMonth.getMonth()+1,1); selectedDate = miChiquiDateKey(visibleMonth); renderCalendar(); });
    monthBar.append(previous,heading,next); home.appendChild(monthBar);

    const todayKey = miChiquiDateKey(new Date());
    if (selectedDate !== todayKey) {
      const todayButton = document.createElement("button"); todayButton.className = "calendar-today-button"; todayButton.type = "button"; todayButton.textContent = "Volver a hoy";
      todayButton.addEventListener("click",() => { const now = new Date(); visibleMonth = new Date(now.getFullYear(),now.getMonth(),1); selectedDate = todayKey; renderCalendar(); });
      home.appendChild(todayButton);
    }

    const grid = document.createElement("div"); grid.className = "calendar-grid";
    ["Lun","Mar","Mié","Jue","Vie","Sáb","Dom"].forEach(day => { const cell = document.createElement("div"); cell.className = "calendar-day-name"; cell.textContent = day; grid.appendChild(cell); });
    const year = visibleMonth.getFullYear(), month = visibleMonth.getMonth();
    const firstDay = (new Date(year,month,1).getDay()+6)%7;
    const totalDays = new Date(year,month+1,0).getDate();
    const history = JSON.parse(localStorage.getItem("miChiquiDailyHistory") || "{}");
    for (let i=0;i<firstDay;i++) { const blank = document.createElement("div"); blank.className = "calendar-empty"; grid.appendChild(blank); }
    for (let day=1;day<=totalDays;day++) {
      const date = miChiquiDateKey(new Date(year,month,day));
      const record = history[date];
      const cell = document.createElement("button"); cell.type = "button"; cell.className = "calendar-date"; cell.textContent = day;
      if (date === todayKey) cell.classList.add("today");
      if (record && ((record.emotionEntries && record.emotionEntries.length) || (record.emotions && record.emotions.length) || (record.visits && record.visits.length) || (record.letters && record.letters.length))) { cell.classList.add("has-activity"); cell.title = "Tiene actividad guardada"; cell.setAttribute("aria-label",day + ", con actividad"); }
      if (date === selectedDate) cell.classList.add("selected-date");
      cell.setAttribute("aria-pressed",date === selectedDate ? "true" : "false");
      cell.addEventListener("click",() => { selectedDate = date; renderCalendar(); });
      grid.appendChild(cell);
    }
    home.appendChild(grid);

    const details = document.createElement("section"); details.className = "calendar-details";
    const parts = selectedDate.split("-").map(Number);
    const chosenDate = new Date(parts[0],parts[1]-1,parts[2]);
    const dateTitle = document.createElement("h2"); dateTitle.textContent = chosenDate.toLocaleDateString("es-UY",{weekday:"long",day:"numeric",month:"long",year:"numeric"}); details.appendChild(dateTitle);
    const chosen = history[selectedDate];
    if (!chosen) {
      const empty = document.createElement("p"); empty.className = "calendar-empty-message"; empty.textContent = "Todavía no hay actividad guardada para este día."; details.appendChild(empty);
    } else {
     const emotionEntries = Array.isArray(chosen.emotionEntries) ? chosen.emotionEntries : [];
const emotions = emotionEntries.length ? emotionEntries.flatMap(entry => entry.emotions || []) : (Array.isArray(chosen.emotions) ? chosen.emotions : []);      const visits = Array.isArray(chosen.visits) ? chosen.visits : [];
      const letters = Array.isArray(chosen.letters) ? chosen.letters : [];
      const summary = document.createElement("div"); summary.className = "calendar-summary-grid";
      [
        {icon:"♡",label:"Emociones",value:emotions.length},
        {icon:"⌂",label:"Visitas",value:visits.length},
        {icon:"✉",label:"Cartitas",value:letters.length}
      ].forEach(item => {
        const card = document.createElement("div"); card.className = "calendar-summary-card";
        const symbol = document.createElement("span"); symbol.className = "calendar-summary-icon"; symbol.textContent = item.icon;
        const number = document.createElement("strong"); number.className = "calendar-summary-number"; number.textContent = item.value;
        const label = document.createElement("span"); label.className = "calendar-summary-label"; label.textContent = item.label;
        card.append(symbol,number,label); summary.appendChild(card);
      });
      details.appendChild(summary);

      function addGroup(headingText,items,formatter,emptyText) {
        const group = document.createElement("div"); group.className = "calendar-detail-group";
        const h = document.createElement("h3"); h.textContent = headingText; group.appendChild(h);
        if (!items.length) { const p = document.createElement("p"); p.className = "calendar-no-records"; p.textContent = emptyText; group.appendChild(p); }
        else items.forEach(item => { const p = document.createElement("p"); p.className = "calendar-record"; p.textContent = formatter(item); group.appendChild(p); });
        details.appendChild(group);
      }
      
if (emotionEntries.length) {
  addGroup(
    "Cómo se sintió",
    emotionEntries,
    entry => "♡ " + (entry.emotions || []).join(", ") + (entry.time ? " · " + displayTime(entry.time) : ""),
    "No se registraron emociones."
  );
} else {
  addGroup("Cómo se sintió", emotions, item => "♡ " + item, "No se registraron emociones.");
  if (emotions.length && chosen.emotionTime) {
    const emotionTime = document.createElement("p");
    emotionTime.className = "calendar-record calendar-record-time";
    emotionTime.textContent = "Registrado a las " + displayTime(chosen.emotionTime);
    details.querySelector(".calendar-detail-group").appendChild(emotionTime);
  }
}

      
      addGroup("Secciones visitadas",visits,item => {
        const section = typeof item === "string" ? item : (item.section || "Sección");
        const time = typeof item === "object" ? displayTime(item.time) : "";
        return "♡ " + section + (time ? " · " + time : "");
      },"No se registraron visitas.");
      addGroup("Cartitas abiertas",letters,item => {
        if (typeof item === "string") return "♡ " + item;
        const time = displayTime(item.time);
        return "♡ " + (item.title || "Cartita") + (item.category ? " · " + item.category : "") + (time ? " · " + time : "");
      },"No se abrieron cartitas ese día.");
    }
    home.appendChild(details);
    createBottomNavigation("calendar");
  }
  renderCalendar();
};

// Estadísticas de Mi Chiqui
function showStatistics() {
  const home = document.getElementById("home");
  home.innerHTML = "";
  const title = document.createElement("h1"); title.textContent = "Nuestras estadísticas ♡"; home.appendChild(title);
  const subtitle = document.createElement("p"); subtitle.textContent = "Un rinconcito para ver nuestros pequeños momentos."; home.appendChild(subtitle);
  const history = JSON.parse(localStorage.getItem("miChiquiDailyHistory") || "{}");
  const dates = Object.keys(history).sort();
  const emotions = {}; const visits = {}; const letters = JSON.parse(localStorage.getItem("miChiquiLetterOpens") || "{}");
  dates.forEach(date => {
    (history[date].emotions || []).forEach(mood => emotions[mood] = (emotions[mood] || 0) + 1);
    (history[date].visits || []).forEach(item => visits[item.section] = (visits[item.section] || 0) + 1);
  });
  const totalEmotions = Object.values(emotions).reduce((sum,value) => sum + value,0);
  const totalVisits = Object.values(visits).reduce((sum,value) => sum + value,0);
  const totalLetterOpens = Object.values(letters).reduce((sum,value) => sum + value,0);
  const summary = document.createElement("div"); summary.className = "stats-summary";
  const makeStat = (number,label) => { const card = document.createElement("article"); card.className = "letter-card"; const value = document.createElement("h2"); value.textContent = number; const caption = document.createElement("p"); caption.textContent = label; card.append(value,caption); summary.appendChild(card); };
  makeStat(dates.length,"Días con actividad"); makeStat(totalVisits,"Visitas a secciones"); makeStat(totalLetterOpens,"Cartitas abiertas");
  home.appendChild(summary);
  const addRanking = (headingText,data,total) => {
    const heading = document.createElement("h2"); heading.textContent = headingText; home.appendChild(heading);
    const entries = Object.entries(data).sort((a,b) => b[1]-a[1]);
    if (!entries.length) { const empty = document.createElement("p"); empty.textContent = "Todavía no hay datos suficientes."; home.appendChild(empty); return; }
    entries.forEach(([name,count]) => { const card = document.createElement("article"); card.className = "letter-card"; const label = document.createElement("p"); label.textContent = name + " · " + count + " veces" + (total ? " · " + Math.round(count/total*100) + "%" : ""); card.appendChild(label); home.appendChild(card); });
  };
  addRanking("Emociones",emotions,totalEmotions);
  addRanking("Secciones más visitadas",visits,totalVisits);
  addRanking("Cartitas más abiertas",letters,totalLetterOpens);
  createBottomNavigation("stats");
}





function showNotes() {
  const home = document.getElementById("home");
  home.innerHTML = "";

  const title = document.createElement("h1");
  title.textContent = "Dates ♡";
  home.appendChild(title);

  const subtitle = document.createElement("p");
  subtitle.textContent = "Cosas que queremos hacer juntos.";
  home.appendChild(subtitle);

  const form = document.createElement("form");
  form.className = "letter-form";

  const input = document.createElement("input");
  input.className = "letter-input";
  input.placeholder = "¿Qué queremos hacer?";
  input.required = true;

  const add = document.createElement("button");
  add.type = "submit";
  add.textContent = "Agregar a nuestra lista ♡";

  form.append(input, add);
  home.appendChild(form);

  const list = document.createElement("div");
  list.className = "saved-letters";
  home.appendChild(list);

  const key = "miChiquiNotes";

  function render() {
    list.innerHTML = "";
    const notes = JSON.parse(localStorage.getItem(key) || "[]");

    if (!notes.length) {
      const empty = document.createElement("p");
      empty.textContent = "Todavía no tenemos planes anotados.";
      list.appendChild(empty);
    }

    notes.forEach((note, index) => {
      const card = document.createElement("article");
      card.className = "letter-card";

      const label = document.createElement("label");
      const check = document.createElement("input");
      check.type = "checkbox";
      check.checked = note.done;

      const text = document.createElement("span");
      text.textContent = note.text;
      if (note.done) text.style.textDecoration = "line-through";

      check.addEventListener("change", () => {
        const updated = [...notes];
        updated[index].done = check.checked;
        localStorage.setItem(key, JSON.stringify(updated));
        render();
      });

      label.append(check, text);
      card.appendChild(label);

      const remove = document.createElement("button");
      remove.className = "delete-letter";
      remove.textContent = "Eliminar";
      remove.addEventListener("click", () => {
        const updated = notes.filter((item, i) => i !== index);
        localStorage.setItem(key, JSON.stringify(updated));
        render();
      });

      card.appendChild(remove);
      list.appendChild(card);
    });
  }

  form.addEventListener("submit", event => {
    event.preventDefault();
    const notes = JSON.parse(localStorage.getItem(key) || "[]");
    notes.push({ text: input.value.trim(), done: false });
    localStorage.setItem(key, JSON.stringify(notes));
    form.reset();
    render();
  });

  render();

  const back = document.createElement("button");
  back.textContent = "Volver a Mi espacio";
  back.addEventListener("click", showHome);
  home.appendChild(back);
}
