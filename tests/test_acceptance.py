"""Приёмочные тесты для «Командного центра входящих задач» (Lesson 5).

Проверяют 13 критериев из AGENTS.md / docs/technical-specification.md
(AC-01..AC-13) для статического веб-приложения task-dispatcher.
"""
import re
import subprocess
from pathlib import Path

import pytest

ROOT = Path(__file__).resolve().parent.parent
APP = ROOT / "app"


def _read(rel: str) -> str:
    return (ROOT / rel).read_text(encoding="utf-8")


def _app_read(name: str) -> str:
    return (APP / name).read_text(encoding="utf-8")


# --- AC-01: файлы приложения ---

def test_app_files_exist():
    """AC-01: app/index.html, styles.css, data.js, app.js существуют."""
    for name in ("index.html", "styles.css", "data.js", "app.js"):
        assert (APP / name).is_file(), f"app/{name} не найден"


@pytest.fixture(scope="module")
def datadeclared():
    return _app_read("data.js")


@pytest.fixture(scope="module")
def appjs():
    return _app_read("app.js")


@pytest.fixture(scope="module")
def indexhtml():
    return _app_read("index.html")


@pytest.fixture(scope="module")
def stylescss():
    return _app_read("styles.css")


# --- AC-02: ровно 24 запроса ---

def test_24_requests(datadeclared):
    """AC-02: в data.js ровно 24 запроса, номера от "01" до "24"."""
    ids = re.findall(r'^\s+id: "(\d+)"', datadeclared, re.MULTILINE)
    assert len(ids) == 24
    assert ids == [f"{i:02d}" for i in range(1, 25)]


# --- AC-03: все поля у каждого запроса ---

def test_request_fields(datadeclared):
    """AC-03: у каждого запроса есть id, source, project, text, deadline, assignee, priority, dataStatus."""
    blocks = re.split(r"\n  \{\n", datadeclared)
    # первый блок — шапка/первый объект уже отделён; берём блоки, где есть id:
    request_blocks = [b for b in blocks if re.search(r'id: "(\d+)"', b)]
    assert len(request_blocks) == 24
    for block in request_blocks:
        for field in ("id", "source", "project", "text", "deadline",
                      "assignee", "priority", "dataStatus"):
            assert re.search(rf"^\s+{field}:", block, re.MULTILINE), \
                f"Поле {field} отсутствует в блоке: {block[:80]!r}"


# --- AC-04: «требует уточнения» для null-полей ---

def test_missing_data_markers(appjs):
    """AC-04: null-значения отображаются как «требует уточнения» и имеют ожидаемые счётчики."""
    assert "требует уточнения" in appjs
    assert "r.assignee ? r.assignee : 'требует уточнения'" in appjs or \
           '"требует уточнения"' in appjs
    assert re.search(r"r\.dataStatus !== \"full\"", appjs)


def test_null_counts(datadeclared):
    """AC-04: 7 запросов без ответственного, 4 без срока."""
    assert len(re.findall(r"assignee: null", datadeclared)) == 7
    assert len(re.findall(r"deadline: null,", datadeclared)) == 4


# --- AC-05: «Фокус дня» ---

def test_focus_block(indexhtml, appjs):
    """AC-05: блок «Фокус дня» и рендеринг focus-list."""
    assert 'id="focus-list"' in indexhtml
    assert "Фокус дня" in indexhtml
    assert "function renderFocus" in appjs


# --- AC-06: нагрузка по команде ---

def test_workload_block(indexhtml, appjs):
    """AC-06: блок «Нагрузка по команде», рендеринг и 11 исполнителей."""
    assert 'id="workload-list"' in indexhtml
    assert "Нагрузка по команде" in indexhtml
    assert "function renderWorkload" in appjs
    assert "Не назначено" in appjs


def test_executors_count(datadeclared):
    """AC-06: в data.js 11 исполнителей."""
    names = re.findall(r"name: \"([^\"]+)\", count:", datadeclared)
    assert len(names) == 11


# --- AC-07: дубли с объяснением ---

def test_duplicates_block(indexhtml, appjs):
    """AC-07: блок «Возможные дубли» и рендеринг."""
    assert 'id="duplicates-section"' in indexhtml
    assert 'id="duplicates-list"' in indexhtml
    assert "Возможные дубли" in indexhtml
    assert "function renderDuplicates" in appjs


def test_duplicate_groups(datadeclared):
    """AC-07: 4 группы дублей, у каждой title, requestIds и reason."""
    groups = re.findall(r'^\s+\{\n\s+id: (\d+),', datadeclared, re.MULTILINE)
    request_ids = re.findall(r"requestIds: \[([^\]]+)\]", datadeclared)
    reasons = re.findall(r"reason: \"", datadeclared)
    assert groups == ["1", "2", "3", "4"]
    assert len(request_ids) == 4
    assert len(reasons) == 4


# --- AC-08: KPI-карточки ---

def test_kpi_container(indexhtml):
    """AC-08: контейнер KPI."""
    assert 'id="kpi-container"' in indexhtml


def test_kpi_card_filters(appjs):
    """AC-08: четыре карточки KPI с фильтрами all/high/missing/duplicates."""
    for filter_type in ("all", "high", "missing", "duplicates"):
        assert f'data-filter="{filter_type}"' in appjs or \
               f"data-filter={filter_type}" in appjs, \
            f"KPI-карточка data-filter={filter_type} не найдена"


# --- AC-09: поиск и фильтры ---

def test_filters_and_search(indexhtml, appjs):
    """AC-09: поиск и фильтры по источнику, проекту, приоритету, полноте данных."""
    for element_id in ("search-input", "filter-source", "filter-project",
                       "filter-priority", "filter-data"):
        assert f'id="{element_id}"' in indexhtml, f"Нет элемента id={element_id}"
    assert "function getFilteredRequests" in appjs
    for filter_id in ("filter-source", "filter-project",
                      "filter-priority", "filter-data"):
        assert f'id="{filter_id}"' in indexhtml


def test_search_checks_multiple_fields(appjs):
    """AC-09: поиск идёт по тексту, id, проекту, исполнителю и источнику."""
    assert "r.text.toLowerCase().indexOf(search) !== -1" in appjs
    assert "r.id.indexOf(search) !== -1" in appjs
    assert "r.project.toLowerCase().indexOf(search) !== -1" in appjs
    assert "r.source.toLowerCase().indexOf(search) !== -1" in appjs


# --- AC-10: сброс фильтров и пустое состояние ---

def test_reset_button(indexhtml, appjs):
    """AC-10: кнопка «Сбросить фильтры» и функция resetFilters."""
    assert 'id="reset-btn"' in indexhtml
    assert "Сбросить фильтры" in indexhtml
    assert "function resetFilters" in appjs


def test_empty_state(indexhtml):
    """AC-10: пустое состояние «Ничего не найдено» с кнопкой сброса."""
    assert 'id="empty-state"' in indexhtml
    assert "Ничего не найдено" in indexhtml
    assert "Сбросить" in indexhtml


# --- AC-11: сводка и копирование ---

def test_summary_block(indexhtml, appjs):
    """AC-11: сводка для планёрки и кнопка копирования."""
    assert 'id="summary-text"' in indexhtml
    assert 'id="copy-btn"' in indexhtml
    assert "Сводка для планёрки" in indexhtml
    assert "Копировать сводку" in indexhtml
    assert "function copySummary" in appjs


def test_summary_generator(datadeclared):
    """AC-11: generateSummary формирует текст сводки."""
    assert "function generateSummary" in datadeclared
    assert "Сводка на планёрку" in datadeclared
    assert "Фокус дня" in datadeclared


def test_copy_fallback(appjs):
    """AC-11: clipboard API с fallback на execCommand."""
    assert "navigator.clipboard" in appjs
    assert "document.execCommand" in appjs


# --- AC-12: адаптивность ---

def test_responsive_css(stylescss):
    """AC-12: media-запрос для узкого экрана."""
    assert "@media" in stylescss
    assert "max-width: 768px" in stylescss
    assert "flex-direction: column" in stylescss


# --- AC-13: синтаксис JS ---

def test_node_syntax_data():
    """AC-13: node --check app/data.js без ошибок."""
    result = subprocess.run(
        ["node", "--check", str(APP / "data.js")],
        capture_output=True, text=True, encoding="utf-8",
    )
    assert result.returncode == 0, f"node --check data.js: {result.stderr}"


def test_node_syntax_app():
    """AC-13: node --check app/app.js без ошибок."""
    result = subprocess.run(
        ["node", "--check", str(APP / "app.js")],
        capture_output=True, text=True, encoding="utf-8",
    )
    assert result.returncode == 0, f"node --check app.js: {result.stderr}"


# --- Дополнительно ---

def test_no_external_network(indexhtml, appjs):
    """Приложение не обращается к внешним ресурсам."""
    for src in (indexhtml, appjs):
        external = re.findall(r"https?://(?!www\.w3\.org/2000/svg)\S+", src)
        assert external == [], f"Обнаружены внешние ссылки: {external}"


def test_russian_ui(indexhtml, appjs):
    """Интерфейс на русском языке."""
    for marker in ("Командный центр входящих задач", "Поиск по тексту",
                   "Приоритет", "Источник", "Проект"):
        assert marker in indexhtml, f"Маркер {marker!r} не найден в index.html"


def test_documents_exist():
    """Документация портфолио на месте."""
    for rel in ("README.md", "AGENTS.md", "LICENSE", "requirements-dev.txt",
                "docs/technical-specification.md", "docs/ci.yml.example",
                "references/requests.md", "references/business-analysis.md",
                "references/ux-spec.md", "references/qa-report.md",
                "references/task-board.md"):
        assert (ROOT / rel).is_file(), f"Нет документа {rel}"