window.showStatistics = function() {
  const home = document.getElementById("home");
  home.innerHTML = "";

  const title = document.createElement("h1");
  title.textContent = "Nuestras estad\u00edsticas";
  home.appendChild(title);

  const subtitle = document.createElement("p");
  subtitle.textContent = "Un rinconcito para ver nuestros peque\u00f1os momentos.";
  home.appendChild(subtitle);

  const history = JSON.parse(localStorage.getItem("miChiquiDailyHistory") || "{}");
  const dates = Object.keys(history).sort();

  function toISO(date) {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");
    return y + "-" + m + "-" + d;
  }

  function parseDate(key) {
    if (/^\d{4}-\d{2}-\d{2}$/.test(key)) {
      const parts = key.split("-").map(Number);
      return new Date(parts[0], parts[1] - 1, parts[2]);
    }
    const parsed = new Date(key);
    if (isNaN(parsed.getTime())) return null;
    return new Date(parsed.getFullYear(), parsed.getMonth(), parsed.getDate());
  }

  const filterArea = document.createElement("div");
  filterArea.className = "stats-filters";

  const filterLabel = document.createElement("p");
  filterLabel.textContent = "Elegir per\u00edodo";
  filterArea.appendChild(filterLabel);

  const filter = document.createElement("select");
  filter.className = "stats-filter-select";

  [
    ["week", "Esta semana"],
    ["month", "Este mes"],
    ["all", "Todo el tiempo"],
    ["custom", "Elegir fechas"]
  ].forEach(item => {
    const option = document.createElement("option");
    option.value = item[0];
    option.textContent = item[1];
    filter.appendChild(option);
  });

  filterArea.appendChild(filter);
  filter.value = "month";

  const customArea = document.createElement("div");
  customArea.className = "stats-custom-dates";
  customArea.style.display = "none";

  const fromLabel = document.createElement("label");
  fromLabel.textContent = "Desde";
  const fromInput = document.createElement("input");
  fromInput.type = "date";
  fromInput.className = "stats-date-input";
  fromLabel.appendChild(fromInput);

  const toLabel = document.createElement("label");
  toLabel.textContent = "Hasta";
  const toInput = document.createElement("input");
  toInput.type = "date";
  toInput.className = "stats-date-input";
  toLabel.appendChild(toInput);

  const applyButton = document.createElement("button");
  applyButton.textContent = "Aplicar fechas";
  applyButton.className = "home-card";

  customArea.append(fromLabel, toLabel, applyButton);
  filterArea.appendChild(customArea);
  home.appendChild(filterArea);

  const results = document.createElement("div");
  home.appendChild(results);

  function renderData() {
    results.innerHTML = "";

    const today = new Date();
    const endToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    let start;
    let end = endToday;
    let periodName = "";

    if (filter.value === "week") {
      const day = (today.getDay() + 6) % 7;
      start = new Date(today.getFullYear(), today.getMonth(), today.getDate() - day);
      periodName = "Esta semana";
    } else if (filter.value === "month") {
      start = new Date(today.getFullYear(), today.getMonth(), 1);
      periodName = "Este mes";
    } else if (filter.value === "all") {
      const validDates = dates.map(parseDate).filter(Boolean);
      start = validDates.length
        ? new Date(Math.min(...validDates.map(d => d.getTime())))
        : endToday;
      periodName = "Todo el tiempo";
    } else {
      if (!fromInput.value || !toInput.value) {
        results.textContent = "Eleg\u00ed una fecha de inicio y una fecha de finalizaci\u00f3n.";
        return;
      }

      start = new Date(fromInput.value + "T00:00:00");
      end = new Date(toInput.value + "T00:00:00");

      if (start > end) {
        results.textContent = "La fecha de inicio no puede ser posterior a la fecha final.";
        return;
      }

      periodName = "Per\u00edodo personalizado";
    }

    const selectedDates = dates.filter(key => {
      const date = parseDate(key);
      return date && date >= start && date <= end;
    });

    const emotions = {};
    const visits = {};
    const letters = {};
    let totalLetterEvents = 0; let totalEntries = 0;

    selectedDates.forEach(date => {
      const day = history[date] || {};

    totalEntries += Array.isArray(day.appEntries) ? day.appEntries.length : 0;  
      if (Array.isArray(day.emotionEntries) && day.emotionEntries.length) {
        day.emotionEntries.forEach(entry => {
          (entry.emotions || []).forEach(mood => {
            emotions[mood] = (emotions[mood] || 0) + 1;
          });
        });
      } else {
        (day.emotions || []).forEach(mood => {
          emotions[mood] = (emotions[mood] || 0) + 1;
        });
      }


      (day.visits || []).forEach(item => {
        visits[item.section] = (visits[item.section] || 0) + 1;
      });

      (day.letters || []).forEach(item => {
        const name = item.title || item.category || "Cartita";
        letters[name] = (letters[name] || 0) + 1;
        totalLetterEvents++;
      });
    });

    if (filter.value === "all" && totalLetterEvents === 0) {
      const oldLetters = JSON.parse(localStorage.getItem("miChiquiLetterOpens") || "{}");
      Object.assign(letters, oldLetters);
    }

    const totalEmotions = Object.values(emotions).reduce((a, b) => a + b, 0);
    const totalVisits = Object.values(visits).reduce((a, b) => a + b, 0);
    const totalLetters = Object.values(letters).reduce((a, b) => a + b, 0);

    const periodTitle = document.createElement("h2");
    periodTitle.textContent = periodName;
    results.appendChild(periodTitle);

    const summary = document.createElement("div");
    summary.className = "stats-summary";

    function makeStat(number, label) {
      const card = document.createElement("article");
      card.className = "letter-card";

      const value = document.createElement("h2");
      value.textContent = number;

      const caption = document.createElement("p");
      caption.textContent = label;

      card.append(value, caption);
      summary.appendChild(card);
    }

    makeStat(selectedDates.length, "D\u00edas con actividad");
 makeStat(totalEntries, "Entradas a la app");   makeStat(totalVisits, "Visitas a secciones");
    makeStat(totalLetters, "Cartitas abiertas");

    results.appendChild(summary);

  const entryDetails = document.createElement("div");
entryDetails.className = "letter-card";

const entryTitle = document.createElement("h2");
entryTitle.textContent = "Entradas a la app ♡";
entryDetails.appendChild(entryTitle);

selectedDates.forEach(date => {
  const entries = history[date]?.appEntries || [];

  entries.forEach(entry => {
    const line = document.createElement("p");
    const time = new Date(entry.time).toLocaleTimeString("es-UY", {
      hour: "2-digit",
      minute: "2-digit"
    });

    line.textContent = `${date} · ${time}`;
    entryDetails.appendChild(line);
  });
});

if (totalEntries === 0) {
  const empty = document.createElement("p");
  empty.textContent = "Todavía no hay entradas registradas en este período.";
  entryDetails.appendChild(empty);
}results.appendChild(entryDetails);

function addRanking(headingText, data, total) {
  const heading = document.createElement("h2");
  heading.textContent = headingText;
  results.appendChild(heading);

  const entries = Object.entries(data).sort((a, b) => b[1] - a[1]);

  if (!entries.length) {
    const empty = document.createElement("p");
    empty.textContent = "Todavía no hay datos en este período.";
    results.appendChild(empty);
    return;
  }

  entries.forEach(([name, count]) => {
    const card = document.createElement("article");
    card.className = "letter-card";

    const label = document.createElement("p");
    label.textContent = name + " · " + count + " veces" +
      (total ? " · " + Math.round(count / total * 100) + "%" : "");

    card.appendChild(label);
    results.appendChild(card);
  });
}

function addBarChart(headingText, data, emptyText) {
  const heading = document.createElement("h2");
  heading.textContent = headingText;
  results.appendChild(heading);

  const entries = Object.entries(data).sort((a, b) => b[1] - a[1]);
  const chart = document.createElement("div");
  chart.className = "stats-chart";

  if (!entries.length) {
    const empty = document.createElement("p");
    empty.className = "stats-chart-empty";
    empty.textContent = emptyText;
    chart.appendChild(empty);
    results.appendChild(chart);
    return;
  }

  const max = Math.max(...entries.map(item => item[1]), 1);

  entries.forEach(([name, count]) => {
    const row = document.createElement("div");
    row.className = "stats-chart-row";

    const label = document.createElement("div");
    label.className = "stats-chart-label";

    const nameLabel = document.createElement("span");
    nameLabel.textContent = name;

    const valueLabel = document.createElement("span");
    valueLabel.textContent = count;

    label.append(nameLabel, valueLabel);

    const track = document.createElement("div");
    track.className = "stats-chart-track";

    const bar = document.createElement("div");
    bar.className = "stats-chart-bar";
    bar.style.width = (count / max * 100) + "%";

    track.appendChild(bar);
    row.append(label, track);
    chart.appendChild(row);
  });

  results.appendChild(chart);
}

addRanking("Emociones", emotions, totalEmotions);

const chartTitle = document.createElement("h2");
chartTitle.textContent = "Así nos sentimos ♡";
results.appendChild(chartTitle);

const chart = document.createElement("div");
chart.className = "emotion-chart";

Object.entries(emotions)
  .sort((a, b) => b[1] - a[1])
  .forEach(([name, count]) => {
    const row = document.createElement("div");
    row.className = "emotion-chart-row";

    const label = document.createElement("p");
    label.textContent = name + " · " + count;

    const track = document.createElement("div");
    track.className = "emotion-chart-track";

    const bar = document.createElement("div");
    bar.className = "emotion-chart-bar";
    bar.style.width = (totalEmotions ? count / totalEmotions * 100 : 0) + "%";

    track.appendChild(bar);
    row.append(label, track);
    chart.appendChild(row);
  });

results.appendChild(chart);

addRanking("Secciones más visitadas", visits, totalVisits);
addBarChart("Nuestras visitas ♡", visits, "Todavía no hay visitas registradas.");

addRanking("Cartitas más abiertas", letters, totalLetters);
addBarChart("Cartitas abiertas ♡", letters, "Todavía no hay cartitas abiertas.");

const timelineTitle = document.createElement("h2");
timelineTitle.textContent = "Nuestro rinconcito ♡";
results.appendChild(timelineTitle);

const timeline = document.createElement("div");
timeline.className = "stats-timeline";

const dailyEntries = selectedDates
  .map(date => ({
    date,
    count: (history[date].appEntries || []).length
  }))
  .filter(day => day.count > 0);

if (!dailyEntries.length) {
  const empty = document.createElement("p");
  empty.className = "stats-chart-empty";
  empty.textContent = "Todavía no hay entradas diarias registradas.";
  results.appendChild(empty);
} else {
  const maxDaily = Math.max(...dailyEntries.map(day => day.count), 1);

  dailyEntries.forEach(day => {
    const item = document.createElement("div");
    item.className = "stats-timeline-item";
    item.title = day.date + ": " + day.count + " entradas";

    const value = document.createElement("span");
    value.className = "stats-timeline-value";
    value.textContent = day.count;

    const bar = document.createElement("div");
    bar.className = "stats-timeline-bar";
    bar.style.height = (day.count / maxDaily * 100) + "%";

    const label = document.createElement("span");
    label.className = "stats-timeline-label";
    label.textContent = day.date.slice(8, 10) + "/" + day.date.slice(5, 7);

    item.append(value, bar, label);
    timeline.appendChild(item);
  });

  results.appendChild(timeline);
}
  }

  filter.addEventListener("change", () => {
    customArea.style.display = filter.value === "custom" ? "flex" : "none";
    if (filter.value !== "custom") renderData();
  });

  applyButton.addEventListener("click", renderData);

  renderData();
  createBottomNavigation("stats");
};

