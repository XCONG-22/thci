(function () {
  var STORAGE_KEY = "siteLang";

  function getLang() {
    return localStorage.getItem(STORAGE_KEY) === "en" ? "en" : "zh";
  }

  function setLang(lang) {
    if (lang !== "en" && lang !== "zh") lang = "zh";
    localStorage.setItem(STORAGE_KEY, lang);
    document.documentElement.setAttribute("data-lang", lang);
    document.documentElement.setAttribute("lang", lang === "en" ? "en" : "zh-CN");

    document.querySelectorAll("[data-i18n-zh]").forEach(function (el) {
      var zh = el.getAttribute("data-i18n-zh");
      var en = el.getAttribute("data-i18n-en");
      if (lang === "en" && en != null && en !== "") {
        el.textContent = en;
      } else if (zh != null) {
        el.textContent = zh;
      }
    });

    document.querySelectorAll("[data-i18n-aria-zh]").forEach(function (el) {
      var zh = el.getAttribute("data-i18n-aria-zh");
      var en = el.getAttribute("data-i18n-aria-en");
      if (lang === "en" && en) el.setAttribute("aria-label", en);
      else if (zh) el.setAttribute("aria-label", zh);
    });

    document.querySelectorAll("[data-i18n-alt-zh]").forEach(function (el) {
      var zh = el.getAttribute("data-i18n-alt-zh");
      var en = el.getAttribute("data-i18n-alt-en");
      if (lang === "en" && en) el.setAttribute("alt", en);
      else if (zh) el.setAttribute("alt", zh);
    });

    document.querySelectorAll(".lang-switch [data-set-lang]").forEach(function (btn) {
      btn.classList.toggle("is-active", btn.getAttribute("data-set-lang") === lang);
    });

    var titleEl = document.querySelector("title");
    if (titleEl && titleEl.hasAttribute("data-title-zh")) {
      document.title =
        lang === "en"
          ? titleEl.getAttribute("data-title-en") || document.title
          : titleEl.getAttribute("data-title-zh") || document.title;
    }
  }

  function wire() {
    document.querySelectorAll(".lang-switch [data-set-lang]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        setLang(btn.getAttribute("data-set-lang"));
      });
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", function () {
      setLang(getLang());
      wire();
    });
  } else {
    setLang(getLang());
    wire();
  }
})();
