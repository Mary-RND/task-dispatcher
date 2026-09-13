var requests = [
  {
    id: "01",
    source: "почта",
    project: "Орион",
    text: "Ирина просит обновить коммерческое предложение для клиента «Орион»: добавить новые цены и сроки внедрения.",
    deadline: "сегодня до 17:00",
    assignee: "Максим",
    priority: "high",
    dataStatus: "full"
  },
  {
    id: "02",
    source: "рабочий чат",
    project: "Весенняя рекламная кампания",
    text: "До завтрашнего запуска рекламы нужно проверить лендинг: форму заявки, мобильную версию и номер телефона.",
    deadline: "завтра до 10:00",
    assignee: null,
    priority: "high",
    dataStatus: "missing_assignee"
  },
  {
    id: "03",
    source: "встреча",
    project: "Материалы для отдела продаж",
    text: "Собрать комментарии к новой презентации и подготовить короткую сводку замечаний.",
    deadline: "до конца недели",
    assignee: "Олег",
    priority: "medium",
    dataStatus: "full"
  },
  {
    id: "04",
    source: "форма внутренних запросов",
    project: "Операционная отчётность",
    text: "Подготовить шаблон ежемесячного отчёта. Можно сделать, когда появится свободное время.",
    deadline: null,
    assignee: "Елена",
    priority: "low",
    dataStatus: "missing_deadline"
  },
  {
    id: "05",
    source: "поручение руководителя",
    project: "Вебинар для клиентов",
    text: "Срочно согласовать с экспертом дату записи вебинара и вернуть три подходящих временных слота.",
    deadline: "до среды, 12:00",
    assignee: null,
    priority: "high",
    dataStatus: "missing_assignee"
  },
  {
    id: "06",
    source: "почта",
    project: "Орион",
    text: "Юристы клиента прислали комментарии к приложению договора. Нужно собрать спорные формулировки и подготовить вопросы к созвону.",
    deadline: "пятница, 15:00",
    assignee: "Марина",
    priority: "medium",
    dataStatus: "full"
  },
  {
    id: "07",
    source: "рабочий чат",
    project: "Орион",
    text: "Клиент снова просит обновить в коммерческом предложении этапы внедрения и календарный план.",
    deadline: "сегодня",
    assignee: "Максим",
    priority: "high",
    dataStatus: "full"
  },
  {
    id: "08",
    source: "встреча",
    project: "Весенняя рекламная кампания",
    text: "Перед запуском рекламы проверить мобильную версию лендинга, отправку формы и правильность телефона в шапке.",
    deadline: "сегодня до 18:00",
    assignee: "Дарья",
    priority: "high",
    dataStatus: "full"
  },
  {
    id: "09",
    source: "форма внутренних запросов",
    project: "Переезд в CRM",
    text: "Подготовить инструкцию по импорту контактов из старой таблицы в новую CRM.",
    deadline: "до конца недели",
    assignee: null,
    priority: "medium",
    dataStatus: "missing_assignee"
  },
  {
    id: "10",
    source: "поручение руководителя",
    project: "Адаптация сотрудников",
    text: "Собрать чек-лист первого рабочего дня для нового менеджера по работе с клиентами.",
    deadline: null,
    assignee: "Светлана",
    priority: "low",
    dataStatus: "missing_deadline"
  },
  {
    id: "11",
    source: "почта",
    project: "Вебинар для клиентов",
    text: "Эксперт прислал три доступные даты записи вебинара. Нужно выбрать подходящий слот и подтвердить его участникам.",
    deadline: "среда до 11:00",
    assignee: "Алина",
    priority: "high",
    dataStatus: "full"
  },
  {
    id: "12",
    source: "рабочий чат",
    project: "Весенняя рекламная кампания",
    text: "Добавить UTM-метки к рекламному лендингу и зафиксировать таблицу соответствия источников.",
    deadline: "четверг",
    assignee: "Павел",
    priority: "medium",
    dataStatus: "full"
  },
  {
    id: "13",
    source: "встреча",
    project: "Переезд в CRM",
    text: "Запуск импорта блокируется дублями карточек клиентов. Нужно найти повторяющиеся записи и подготовить правила объединения.",
    deadline: "сегодня до 16:00",
    assignee: "Иван",
    priority: "high",
    dataStatus: "full"
  },
  {
    id: "14",
    source: "форма внутренних запросов",
    project: "Операционная отчётность",
    text: "Добавить в еженедельный дашборд отдельное поле «Источник обращения».",
    deadline: "пятница",
    assignee: null,
    priority: "medium",
    dataStatus: "missing_assignee"
  },
  {
    id: "15",
    source: "поручение руководителя",
    project: "Орион",
    text: "Подготовить короткую записку к завтрашнему созвону с клиентом: открытые вопросы, риски и следующие шаги.",
    deadline: "до завтрашней встречи",
    assignee: "Ирина",
    priority: "high",
    dataStatus: "full"
  },
  {
    id: "16",
    source: "почта",
    project: "Обновление базы знаний",
    text: "Срочно исправить неверный номер службы поддержки в FAQ до завтрашней клиентской рассылки.",
    deadline: "сегодня до 15:00",
    assignee: "Анна",
    priority: "high",
    dataStatus: "full"
  },
  {
    id: "17",
    source: "рабочий чат",
    project: "Вебинар для клиентов",
    text: "Ждём подтверждение эксперта по слотам для записи. Нужно согласовать дату не позднее среды.",
    deadline: "до среды",
    assignee: null,
    priority: "high",
    dataStatus: "missing_assignee"
  },
  {
    id: "18",
    source: "встреча",
    project: "Квартальное планирование",
    text: "Распределить между командами задачи, которые зафиксировали после квартальной встречи.",
    deadline: "завтра",
    assignee: null,
    priority: "medium",
    dataStatus: "missing_assignee"
  },
  {
    id: "19",
    source: "форма внутренних запросов",
    project: "Орион",
    text: "Заменить в коммерческом предложении старые цены, этапы работ и сроки запуска проекта.",
    deadline: "сегодня до 17:00",
    assignee: "Максим",
    priority: "high",
    dataStatus: "full"
  },
  {
    id: "20",
    source: "поручение руководителя",
    project: "Весенняя рекламная кампания",
    text: "Подготовить краткую сводку результатов рекламной кампании за неделю.",
    deadline: null,
    assignee: "Дарья",
    priority: "low",
    dataStatus: "missing_deadline"
  },
  {
    id: "21",
    source: "почта",
    project: "Весенняя рекламная кампания",
    text: "Срочно проставить UTM-метки на посадочной странице до запуска рекламных объявлений.",
    deadline: "сегодня до 14:00",
    assignee: "Павел",
    priority: "high",
    dataStatus: "full"
  },
  {
    id: "22",
    source: "рабочий чат",
    project: "Финансовые документы",
    text: "Проверить и согласовать счета подрядчиков за текущий месяц.",
    deadline: "пятница",
    assignee: null,
    priority: "medium",
    dataStatus: "missing_assignee"
  },
  {
    id: "23",
    source: "встреча",
    project: "Переезд в CRM",
    text: "Провести тестовый импорт двадцати карточек клиентов и зафиксировать ошибки сопоставления полей.",
    deadline: "четверг до 16:00",
    assignee: "Иван",
    priority: "medium",
    dataStatus: "full"
  },
  {
    id: "24",
    source: "форма внутренних запросов",
    project: "HR-документы",
    text: "Обновить шаблон графика отпусков на следующий период.",
    deadline: null,
    assignee: "Светлана",
    priority: "low",
    dataStatus: "missing_deadline"
  }
];

var duplicateGroups = [
  {
    id: 1,
    title: "Обновление КП «Орион»",
    requestIds: ["01", "07", "19"],
    description: "Все три записи требуют обновить коммерческое предложение для клиента «Орион» (цены, этапы, сроки), но поступили из разных источников.",
    reason: "Проект один (Орион), ответственный один (Максим), дедлайн один (сегодня до 17:00). Источники разные: почта, чат, форма."
  },
  {
    id: 2,
    title: "Проверка лендинга перед запуском рекламы",
    requestIds: ["02", "08"],
    description: "Обе записи о проверке лендинга: форма заявки, мобильная версия и номер телефона перед запуском рекламной кампании.",
    reason: "Проверяются одни и те же элементы лендинга. Источники и ответственные разные, дедлайны отличаются (сегодня vs завтра)."
  },
  {
    id: 3,
    title: "UTM-метки на лендинге",
    requestIds: ["12", "21"],
    description: "Обе записи про UTM-метки для рекламного лендинга. Ответственный один — Павел.",
    reason: "Одна задача — добавить UTM-метки. Сроки разные (четверг vs сегодня до 14:00). Запрос 21 требует «срочно»."
  },
  {
    id: 4,
    title: "Согласование даты вебинара",
    requestIds: ["05", "11", "17"],
    description: "Три записи связаны с согласованием даты вебинара с экспертом: согласование даты (05), подтверждение слотов (11), ожидание подтверждения (17).",
    reason: "Все три — про согласование даты вебинара. Могут описывать три этапа одного процесса или быть частичными дублями."
  }
];

var executors = [
  { name: "Максим", count: 3, hotCount: 3, projects: ["Орион"] },
  { name: "Павел", count: 2, hotCount: 1, projects: ["Весенняя рекламная кампания"] },
  { name: "Дарья", count: 2, hotCount: 1, projects: ["Весенняя рекламная кампания"] },
  { name: "Иван", count: 2, hotCount: 1, projects: ["Переезд в CRM"] },
  { name: "Светлана", count: 2, hotCount: 0, projects: ["Адаптация сотрудников", "HR-документы"] },
  { name: "Ирина", count: 1, hotCount: 1, projects: ["Орион"] },
  { name: "Марина", count: 1, hotCount: 0, projects: ["Орион"] },
  { name: "Олег", count: 1, hotCount: 0, projects: ["Материалы для отдела продаж"] },
  { name: "Елена", count: 1, hotCount: 0, projects: ["Операционная отчётность"] },
  { name: "Алина", count: 1, hotCount: 0, projects: ["Вебинар для клиентов"] },
  { name: "Анна", count: 1, hotCount: 1, projects: ["Обновление базы знаний"] }
];

function generateSummary() {
  var today = new Date();
  var dateStr = today.toLocaleDateString("ru-RU", { day: "numeric", month: "long", year: "numeric" });

  var totalCount = requests.length;
  var highCount = requests.filter(function(r) { return r.priority === "high"; }).length;
  var missingCount = requests.filter(function(r) { return r.dataStatus !== "full"; }).length;

  var focusItems = requests.filter(function(r) {
    return r.priority === "high" && r.deadline && (r.deadline.indexOf("сегодня") !== -1 || r.deadline.indexOf("завтра") !== -1);
  });

  var focusText = "";
  focusItems.forEach(function(r) {
    focusText += "— [" + r.id + "] " + r.text.substring(0, 60) + "… · " + (r.assignee || "требует уточнения") + " · " + r.deadline + "\n";
  });

  var unassignedCount = requests.filter(function(r) { return r.assignee === null; }).length;

  var workloadParts = [];
  executors.slice(0, 4).forEach(function(e) {
    workloadParts.push(e.name + " — " + e.count + " задач" + (e.hotCount > 0 ? " (" + e.hotCount + " горящих)" : ""));
  });

  var duplicatesText = "";
  duplicateGroups.forEach(function(g, i) {
    duplicatesText += (i + 1) + ". Запросы " + g.requestIds.join(", ") + " — " + g.title.toLowerCase() + "\n";
  });

  return "Сводка на планёрку — " + dateStr + "\n\n" +
    "Всего входящих запросов: " + totalCount + "\n" +
    "Высокий приоритет: " + highCount + "\n" +
    "Требуют уточнения: " + missingCount + " (нет срока или ответственного)\n\n" +
    "Фокус дня (сегодня/завтра):\n" + focusText + "\n" +
    "Нагрузка: " + workloadParts.join(", ") + ".\n" +
    "Не назначены: " + unassignedCount + " задач.\n\n" +
    "Возможные дубли:\n" + duplicatesText;
}
