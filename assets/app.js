(function () {
  var GAMES = window.RB36_GAMES || [];

  var CATEGORY_LABELS = {
    all: "All Games",
    action: "Action",
    strategy: "Strategy",
    casual: "Casual",
    sports: "Sports & Driving",
  };

  var grid = document.getElementById("gamesGrid");
  var searchInput = document.getElementById("searchInput");
  var sortSelect = document.getElementById("sortSelect");
  var resetBtn = document.getElementById("resetBtn");
  var resultsMeta = document.getElementById("resultsMeta");
  var sectionTitle = document.getElementById("sectionTitle");
  var pills = document.querySelectorAll(".pill[data-category]");

  // Mobile nav toggle (runs on every page, grid or not)
  var navToggle = document.getElementById("navToggle");
  var mainNav = document.getElementById("mainNav");
  if (navToggle && mainNav) {
    navToggle.addEventListener("click", function () {
      mainNav.classList.toggle("open");
    });
  }

  if (!grid) return;

  var state = { category: "all", query: "", sort: "default" };

  function escapeHtml(str) {
    return String(str).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  function applyState() {
    var list = GAMES.filter(function (g) {
      var matchesCategory = state.category === "all" || g.category === state.category;
      var q = state.query.trim().toLowerCase();
      var matchesQuery =
        !q ||
        g.name.toLowerCase().indexOf(q) !== -1 ||
        (g.subCategory && g.subCategory.toLowerCase().indexOf(q) !== -1);
      return matchesCategory && matchesQuery;
    });

    if (state.sort === "az") {
      list.sort(function (a, b) { return a.name.localeCompare(b.name); });
    } else if (state.sort === "za") {
      list.sort(function (a, b) { return b.name.localeCompare(a.name); });
    } else if (state.sort === "featured") {
      list.sort(function (a, b) { return (b.featured === true) - (a.featured === true); });
    } else {
      list.sort(function (a, b) { return a.id - b.id; });
    }

    render(list);
  }

  function render(list) {
    resultsMeta.textContent = list.length + (list.length === 1 ? " game" : " games");
    sectionTitle.textContent = state.category === "all" ? "All Games" : CATEGORY_LABELS[state.category] + " Games";

    if (!list.length) {
      grid.innerHTML = '<div class="no-results">No games match your search. Try a different keyword or category.</div>';
      return;
    }

    var html = list
      .map(function (g) {
        return (
          '<a class="game-card" href="' +
          escapeHtml(g.url) +
          '" target="_blank" rel="noopener noreferrer" title="' +
          escapeHtml(g.name) +
          '">' +
          '<div class="thumb">' +
          (g.featured ? '<span class="badge-featured">Featured</span>' : "") +
          '<img loading="lazy" src="' +
          escapeHtml(g.image) +
          '" alt="' +
          escapeHtml(g.name) +
          '">' +
          '<div class="play-overlay"><i class="ri-play-fill"></i></div>' +
          "</div>" +
          '<div class="card-body">' +
          "<h3>" +
          escapeHtml(g.name) +
          "</h3>" +
          '<div class="sub">' +
          escapeHtml(g.subCategory || g.category) +
          "</div>" +
          "</div>" +
          "</a>"
        );
      })
      .join("");

    grid.innerHTML = html;
  }

  pills.forEach(function (pill) {
    pill.addEventListener("click", function () {
      pills.forEach(function (p) { p.classList.remove("active"); });
      pill.classList.add("active");
      state.category = pill.getAttribute("data-category");
      applyState();
    });
  });

  if (searchInput) {
    searchInput.addEventListener("input", function () {
      state.query = searchInput.value;
      applyState();
    });
  }

  if (sortSelect) {
    sortSelect.addEventListener("change", function () {
      state.sort = sortSelect.value;
      applyState();
    });
  }

  if (resetBtn) {
    resetBtn.addEventListener("click", function () {
      state = { category: "all", query: "", sort: "default" };
      if (searchInput) searchInput.value = "";
      if (sortSelect) sortSelect.value = "default";
      pills.forEach(function (p) { p.classList.remove("active"); });
      var allPill = document.querySelector('.pill[data-category="all"]');
      if (allPill) allPill.classList.add("active");
      applyState();
    });
  }

  applyState();
})();
