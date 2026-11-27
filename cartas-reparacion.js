(function () {
  "use strict";
  const flag = "miChiquiLettersCompact_v3";
  if (localStorage.getItem(flag) === "1") return;
  const keys = [
    "miChiquiLetters_Para cuando me extrañes",
    "miChiquiLetters_Para cuando estés feliz",
    "miChiquiLetters_Para cuando estés triste",
    "miChiquiLetters_Para cualquier momento",
    "miChiquiLetters_Para cuando necesites un abrazo"
  ];
  keys.forEach(function (key) {
    const raw = localStorage.getItem(key);
    if (!raw) return;
    try {
      const letters = JSON.parse(raw);
      if (!Array.isArray(letters)) return;
      letters.forEach(function (letter) {
        if (letter && typeof letter.content === "string") {
          letter.content = letter.content.replace(/\s*\n+\s*/g, " ").replace(/ {2,}/g, " ").trim();
        }
      });
      localStorage.setItem(key, JSON.stringify(letters));
    } catch (error) {}
  });
  localStorage.setItem(flag, "1");
})();