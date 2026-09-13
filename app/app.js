document.addEventListener("DOMContentLoaded", function() {
  renderKPI();
  renderFocus();
  renderWorkload();
  renderDuplicates();
  renderSummary();
  renderTable();
  initFilters();
});

function getFilteredRequests() {
  var search = document.getElementById("search-input") ? document.getElementById("search-input").value.toLowerCase() : "";
  var sourceFilter = document.getElementById("filter-source") ? document.getElementById("filter-source").value : "";
  var projectFilter = document.getElementById("filter-project") ? document.getElementById("filter-project").value : "";
  var priorityFilter = document.getElementById("filter-priority") ? document.getElementById("filter-priority").value : "";
  var dataFilter = document.getElementById("filter-data") ? document.getElementById("filter-data").value : "";

  return requests.filter(function(r) {
    var matchSearch = !search ||
      r.text.toLowerCase().indexOf(search) !== -1 ||
      r.id.indexOf(search) !== -1 ||
      r.project.toLowerCase().indexOf(search) !== -1 ||
      (r.assignee && r.assignee.toLowerCase().indexOf(search) !== -1) ||
      r.source.toLowerCase().indexOf(search) !== -1;

    var matchSource = !sourceFilter || r.source === sourceFilter;
    var matchProject = !projectFilter || r.project === projectFilter;
    var matchPriority = !priorityFilter || r.priority === priorityFilter;

    var matchData = true;
    if (dataFilter === "full") {
      matchData = r.dataStatus === "full";
    } else if (dataFilter === "missing") {
      matchData = r.dataStatus !== "full";
    }

    return matchSearch && matchSource && matchProject && matchPriority && matchData;
  });
}

function renderKPI() {
  var total = requests.length;
  var high = requests.filter(function(r) { return r.priority === "high"; }).length;
  var missing = requests.filter(function(r) { return r.dataStatus !== "full"; }).length;
  var duplicates = duplicateGroups.length;

  var container = document.getElementById("kpi-container");
  if (!container) return;

  container.innerHTML =
    '<div class="kpi-card" data-filter="all">' +
      '<div class="kpi-number">' + total + '</div>' +
      '<div class="kpi-label">входящих задач</div>' +
    '</div>' +
    '<div class="kpi-card kpi-high" data-filter="high">' +
      '<div class="kpi-number">' + high + '</div>' +
      '<div class="kpi-label">срочно / блокируют</div>' +
    '</div>' +
    '<div class="kpi-card kpi-missing" data-filter="missing">' +
      '<div class="kpi-number">' + missing + '</div>' +
      '<div class="kpi-label">нет срока или ответственного</div>' +
    '</div>' +
    '<div class="kpi-card kpi-duplicates" data-filter="duplicates">' +
      '<div class="kpi-number">' + duplicates + '</div>' +
      '<div class="kpi-label">групп предположений</div>' +
    '</div>';

  var cards = container.querySelectorAll(".kpi-card");
  cards.forEach(function(card) {
    card.addEventListener("click", function() {
      var filterType = card.getAttribute("data-filter");
      if (filterType === "high") {
        document.getElementById("filter-priority").value = "high";
        applyFilters();
      } else if (filterType === "missing") {
        document.getElementById("filter-data").value = "missing";
        applyFilters();
      } else if (filterType === "duplicates") {
        var dupsSection = document.getElementById("duplicates-section");
        if (dupsSection) dupsSection.scrollIntoView({ behavior: "smooth" });
      } else {
        resetFilters();
      }
    });
  });
}

function renderFocus() {
  var container = document.getElementById("focus-list");
  if (!container) return;

  var focusItems = requests.filter(function(r) {
    if (r.priority !== "high") return false;
    if (!r.deadline) return false;
    return r.deadline.indexOf("сегодня") !== -1 || r.deadline.indexOf("завтра") !== -1;
  });

  focusItems.sort(function(a, b) {
    var aToday = a.deadline.indexOf("сегодня") !== -1 ? 0 : 1;
    var bToday = b.deadline.indexOf("сегодня") !== -1 ? 0 : 1;
    return aToday - bToday;
  });

  if (focusItems.length === 0) {
    container.innerHTML = '<div class="empty-focus">Нет горящих задач на сегодня и завтра.<br>Все под контролем.</div>';
    return;
  }

  var html = "";
  focusItems.forEach(function(r) {
    html +=
      '<div class="focus-item">' +
        '<div class="focus-header">' +
          '<span class="focus-id">[' + r.id + ']</span>' +
          '<span class="focus-text">' + r.text.substring(0, 80) + (r.text.length > 80 ? "…" : "") + '</span>' +
          '<span class="priority-badge priority-' + r.priority + '">высокий</span>' +
        '</div>' +
        '<div class="focus-meta">' +
          '<span>' + r.project + ' · ' + r.source + '</span>' +
          '<span>Ответственный: ' + (r.assignee || "требует уточнения") + '</span>' +
          '<span>Срок: ' + r.deadline + '</span>' +
        '</div>' +
      '</div>';
  });

  container.innerHTML = html;
}

function renderWorkload() {
  var container = document.getElementById("workload-list");
  if (!container) return;

  var maxCount = Math.max.apply(null, executors.map(function(e) { return e.count; }));

  var html = "";
  executors.forEach(function(e) {
    var percent = Math.round((e.count / maxCount) * 100);
    var barClass = e.count >= 3 ? "bar-red" : e.count === 2 ? "bar-yellow" : "bar-green";
    var hotText = e.hotCount > 0 ? " (" + e.hotCount + " горящих)" : "";

    html +=
      '<div class="workload-item">' +
        '<div class="workload-name">' + e.name + '</div>' +
        '<div class="workload-bar-container">' +
          '<div class="workload-bar ' + barClass + '" style="width: ' + percent + '%"></div>' +
        '</div>' +
        '<div class="workload-info">' + e.count + ' задач' + hotText + '</div>' +
        '<div class="workload-projects">' + e.projects.join(", ") + '</div>' +
      '</div>';
  });

  var unassignedCount = requests.filter(function(r) { return r.assignee === null; }).length;
  if (unassignedCount > 0) {
    html +=
      '<div class="workload-item workload-unassigned">' +
        '<div class="workload-name">Не назначено</div>' +
        '<div class="workload-info">' + unassignedCount + ' задач</div>' +
      '</div>';
  }

  container.innerHTML = html;
}

function renderDuplicates() {
  var container = document.getElementById("duplicates-list");
  if (!container) return;

  var html = "";
  duplicateGroups.forEach(function(g) {
    html +=
      '<div class="duplicate-group">' +
        '<div class="duplicate-title">Группа ' + g.id + ': ' + g.title + '</div>' +
        '<div class="duplicate-ids">Запросы: ' +
          g.requestIds.map(function(id) {
            return '<a href="#" class="duplicate-link" data-id="' + id + '">' + id + '</a>';
          }).join(", ") +
        '</div>' +
        '<div class="duplicate-description">' + g.description + '</div>' +
        '<div class="duplicate-reason"><strong>Почему похоже:</strong> ' + g.reason + '</div>' +
      '</div>';
  });

  container.innerHTML = html;

  var links = container.querySelectorAll(".duplicate-link");
  links.forEach(function(link) {
    link.addEventListener("click", function(e) {
      e.preventDefault();
      var targetId = link.getAttribute("data-id");
      var targetRow = document.querySelector('.table-row[data-id="' + targetId + '"]');
      if (targetRow) {
        targetRow.scrollIntoView({ behavior: "smooth" });
        targetRow.classList.add("highlight");
        setTimeout(function() { targetRow.classList.remove("highlight"); }, 2000);
      }
    });
  });
}

function renderSummary() {
  var container = document.getElementById("summary-text");
  if (!container) return;

  container.textContent = generateSummary();
}

function renderTable() {
  var container = document.getElementById("table-body");
  if (!container) return;

  var filtered = getFilteredRequests();

  if (filtered.length === 0) {
    container.innerHTML = "";
    var emptyState = document.getElementById("empty-state");
    if (emptyState) emptyState.style.display = "block";
    return;
  }

  var emptyState = document.getElementById("empty-state");
  if (emptyState) emptyState.style.display = "none";

  var html = "";
  filtered.forEach(function(r) {
    var priorityClass = "priority-" + r.priority;
    var priorityLabel = r.priority === "high" ? "высокий" : r.priority === "medium" ? "средний" : r.priority === "low" ? "низкий" : "требует уточнения";
    var assigneeText = r.assignee || "требует уточнения";
    var deadlineText = r.deadline || "требует уточнения";

    html +=
      '<div class="table-row" data-id="' + r.id + '">' +
        '<div class="cell-id">' + r.id + '</div>' +
        '<div class="cell-text">' + r.text + '</div>' +
        '<div class="cell-source">' + r.source + '</div>' +
        '<div class="cell-project">' + r.project + '</div>' +
        '<div class="cell-assignee">' + assigneeText + '</div>' +
        '<div class="cell-deadline">' + deadlineText + '</div>' +
        '<div class="cell-priority"><span class="priority-badge ' + priorityClass + '">' + priorityLabel + '</span></div>' +
      '</div>';
  });

  container.innerHTML = html;
}

function applyFilters() {
  renderTable();
  updateResetButton();
}

function updateResetButton() {
  var searchInput = document.getElementById("search-input");
  var sourceFilter = document.getElementById("filter-source");
  var projectFilter = document.getElementById("filter-project");
  var priorityFilter = document.getElementById("filter-priority");
  var dataFilter = document.getElementById("filter-data");
  var resetBtn = document.getElementById("reset-btn");

  if (!resetBtn) return;

  var hasFilters =
    (searchInput && searchInput.value) ||
    (sourceFilter && sourceFilter.value) ||
    (projectFilter && projectFilter.value) ||
    (priorityFilter && priorityFilter.value) ||
    (dataFilter && dataFilter.value);

  resetBtn.style.display = hasFilters ? "inline-block" : "none";
}

function resetFilters() {
  var searchInput = document.getElementById("search-input");
  var sourceFilter = document.getElementById("filter-source");
  var projectFilter = document.getElementById("filter-project");
  var priorityFilter = document.getElementById("filter-priority");
  var dataFilter = document.getElementById("filter-data");

  if (searchInput) searchInput.value = "";
  if (sourceFilter) sourceFilter.value = "";
  if (projectFilter) projectFilter.value = "";
  if (priorityFilter) priorityFilter.value = "";
  if (dataFilter) dataFilter.value = "";

  applyFilters();
}

function initFilters() {
  var searchInput = document.getElementById("search-input");
  var sourceFilter = document.getElementById("filter-source");
  var projectFilter = document.getElementById("filter-project");
  var priorityFilter = document.getElementById("filter-priority");
  var dataFilter = document.getElementById("filter-data");
  var resetBtn = document.getElementById("reset-btn");

  if (searchInput) searchInput.addEventListener("keyup", applyFilters);
  if (sourceFilter) sourceFilter.addEventListener("change", applyFilters);
  if (projectFilter) projectFilter.addEventListener("change", applyFilters);
  if (priorityFilter) priorityFilter.addEventListener("change", applyFilters);
  if (dataFilter) dataFilter.addEventListener("change", applyFilters);
  if (resetBtn) resetBtn.addEventListener("click", resetFilters);

  updateResetButton();
}

function copySummary() {
  var summaryText = generateSummary();

  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(summaryText).then(function() {
      showCopyFeedback();
    }).catch(function() {
      fallbackCopy(summaryText);
    });
  } else {
    fallbackCopy(summaryText);
  }
}

function fallbackCopy(text) {
  var textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.style.position = "fixed";
  textarea.style.left = "-9999px";
  document.body.appendChild(textarea);
  textarea.select();
  try {
    document.execCommand("copy");
    showCopyFeedback();
  } catch (err) {
    alert("Не удалось скопировать. Скопируйте текст вручную.");
  }
  document.body.removeChild(textarea);
}

function showCopyFeedback() {
  var btn = document.getElementById("copy-btn");
  if (!btn) return;
  var originalText = btn.textContent;
  btn.textContent = "Скопировано ✓";
  btn.classList.add("copied");
  setTimeout(function() {
    btn.textContent = originalText;
    btn.classList.remove("copied");
  }, 2000);
}
