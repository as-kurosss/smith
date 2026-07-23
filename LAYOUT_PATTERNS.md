# LAYOUT PATTERNS

> Все паттерны используют токены из `DESIGN.md`. Агенты должны ссылаться на этот файл при старте фронтенд-задачи.

---

## Console Shell (Sidebar + Topbar + Content)

Основной лайаут для всех страниц консоли. Боковая панель навигации слева, хедер сверху, контентная область.

**Источник:** QwenPaw Console

### Desktop (md+)
|- Root: `flex h-screen bg-sage-paper`
|- Sidebar: `flex w-60 flex-col border-r border-sage-cloud bg-white`
|  - Внутри: логотип/бренд сверху, nav-секции,底部 settings
|  - Nav-секции сгруппированы заголовками (text-caption, text-ash, px-4)
|  - Пункты: `flex items-center gap-inline px-4 py-2.5 text-body-sm text-graphite`
|  - Активный: `bg-sage-veil text-sage-teal font-medium`
|  - Иконка: `w-5 h-5 text-fog` (активная: `text-sage-teal`)
|- Main Wrapper: `flex flex-1 flex-col ml-60`
|- Topbar: `sticky top-0 z-20 h-14 border-b border-sage-cloud bg-sage-paper/80 backdrop-blur-md px-6 flex items-center justify-between`
|  - Слева: заголовок страницы (text-subheading, font-semibold, text-graphite)
|  - Справа: действия (New Chat, History toggle, Model Selector, Theme Toggle)
|- Content: `flex-1 overflow-auto`

### Simple Mode (Simpler flat nav, без группировки)
|- Sidebar: `w-48` (уже)
|- Nav: плоский список без группировки по секциям
|- Список сессий: компактный, встроенный прямо в сайдебар, с поиском и группировкой по дате (Today, Yesterday, Earlier)
|- Settings popover: иконка шестерёнки снизу → открывает Popover с языком, темой, Simple/Full toggle

### Mobile (<md)
|- Sidebar: `fixed inset-y-0 left-0 z-50 w-64 bg-white` (по умолчанию скрыт)
|  - В простом режиме: `w-14` collapsed bar с иконками
|- Overlay: `fixed inset-0 bg-obsidian/40 z-40`
|- Main Wrapper: `flex flex-1 flex-col` (без ml-60)
|- Topbar: `px-4`; вспомогательные элементы (Language, Theme, GitHub) схлопнуты в Info-дропдаун
|- Content: padding неизменен

### Toggle Logic
1. Sidebar открыт/закрыт переключается через `sidebarOpen` state
2. На мобильных: sidebar открывается поверх контента с оверлеем
3. Клик по Overlay → закрыть sidebar
4. При ресайзе с mobile → desktop: sidebar открывается автоматически
5. Simple Mode: sidebar не расширяется, показывает иконки + при наведении тултипы

---

## Chat Layout (Message List + Composer)

Страница чата — центральный элемент консоли. Сообщения по центру, поле ввода снизу.

**Источник:** QwenPaw Console — Chat page

### Когда использовать
- Чат с AI-агентом
- Любой интерфейс с потоковыми сообщениями

### Desktop (lg+)
|- Root: `flex flex-1 flex-col h-full`
|- Header Chat: `flex items-center justify-between px-6 py-3 border-b border-sage-cloud`
|  - Слева: Agent Info (аватар + имя + статус)
|  - Справа: actions (New Chat btn + History toggle btn + Model Selector)
|- Message List: `flex-1 overflow-y-auto px-6 py-4 space-y-4`
|  - Сообщения: `max-w-[720px] mx-auto w-full` (центрированы, не шире 720px)
|  - User msg: `bg-sage-teal text-white rounded-lg px-4 py-3 text-body self-end max-w-[80%]`
|  - Assistant msg: `bg-white border border-sage-cloud rounded-lg px-4 py-3 text-graphite max-w-[80%]`
|  - Tool call card: `bg-sage-veil rounded-lg px-3 py-2 text-caption text-slate font-mono`
|  - Reasoning block: `text-caption text-fog italic px-4 py-2`
|- Composer Area: `border-t border-sage-cloud bg-white px-6 py-4`
|  - Input: `w-full border border-sage-cloud rounded-lg px-4 py-3 text-body text-graphite bg-sage-paper`
|  - Actions bar: `flex items-center gap-inline mt-2` (attach, voice, send btn)
|- History Panel (опционально, правая панель): `w-72 border-l border-sage-cloud bg-white overflow-y-auto`
|  - Поиск сессий сверху
|  - Список: Today / Yesterday / Earlier groups
|  - Переключение через History toggle в хедере
|  - Состояние panelOpen сохраняется в localStorage

### Mobile (<md)
|- Message List: `px-4 py-3`
|- Composer: `px-4 py-3`
|- Чат-хедер: `px-4`; модель показывается кратко (иконка или инициалы)
|- History Panel: автоматически скрыт (display: none) на экранах < 900px

---

## Card Grid Layout

Сетка карточек для страниц со множеством независимых элементов.

**Источник:** QwenPaw — Channels page, Skills page

### Когда использовать
- Каналы (список channel cards)
- Скиллы (список skill cards)
- Плагины/интеграции
- Дашборд с виджетами/статистикой

### Desktop (md+)
|- Root: `flex flex-col h-full`
|- Page Header: `flex items-center justify-between px-6 py-4 border-b border-sage-cloud`
|  - Заголовок: `text-subheading font-semibold text-graphite`
|  - Actions: `flex items-center gap-inline` (Add/Search/Filter кнопки)
|- Grid: `grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-grid p-6`
|- Card: `bg-white rounded-lg border border-sage-cloud/50 shadow-sm p-card hover:border-sage-teal/30 hover:shadow-md transition-all cursor-pointer`
|  - Иконка: `w-10 h-10 bg-sage-veil rounded-lg flex items-center justify-center mb-spacing-md`
|  - Название: `text-body font-semibold text-graphite mb-spacing-sm`
|  - Описание: `text-body-sm text-slate line-clamp-2`
|  - Статус/бейдж (опционально): `text-caption font-medium text-sage-teal`
|  - Footer actions: `flex items-center gap-inline mt-spacing-md pt-spacing-md border-t border-sage-cloud`

### Mobile (<md)
|- Grid: `grid-cols-1 sm:grid-cols-2 gap-grid p-4`
|- Page Header: `px-4 py-3`

---

## Data Table Layout

Таблица со строками данных, поиском, фильтрацией и массовыми операциями.

**Источник:** QwenPaw — Sessions page, Cron Jobs page

### Когда использовать
- Управление сессиями
- Список cron jobs
- Список агентов
- Логи/аудит

### Desktop (md+)
|- Root: `flex flex-col h-full`
|- Page Header: `flex items-center justify-between px-6 py-4 border-b border-sage-cloud flex-wrap gap-stack`
|  - Заголовок + description
|  - Search bar: `w-64 border border-sage-cloud rounded-lg px-3 py-2 text-body-sm bg-white`
|  - Filters: dropdowns (channel, status, date range)
|  - Actions: Add/Batch Delete/Export buttons
|- Table: `w-full`
|  - Header row: `bg-sage-veil text-caption font-semibold text-fog uppercase tracking-wider`
|  - Row: `border-b border-sage-cloud/50 hover:bg-sage-veil/50 transition-colors`
|  - Cells: `px-4 py-3 text-body-sm text-graphite`
|  - Selection: checkbox в первой колонке
|  - Row actions: Edit/Delete icons, появляются при hover
|- Pagination: `flex items-center justify-between px-6 py-3 border-t border-sage-cloud text-caption text-slate`

### Mobile (<md)
|- Table: horizontal scroll (`overflow-x-auto`)
|- Search: full width
|- Filters: вынесены в collapsible panel или bottom sheet
|- Page Header: `px-4 py-3`

---

## Slide-Out Detail Panel

Панель, выезжающая справа для редактирования/просмотра деталей.

**Источник:** QwenPaw — Channel settings, Skill details

### Когда использовать
- Редактирование настроек канала
- Просмотр деталей скилла
- Редактирование элемента из таблицы/грида

### Desktop (md+)
|- Overlay: `fixed inset-0 bg-obsidian/20 z-30` (опционально, приглушение фона)
|- Panel: `fixed top-0 right-0 z-40 h-full w-full max-w-lg bg-white border-l border-sage-cloud shadow-md flex flex-col`
|  - Header: `flex items-center justify-between px-6 py-4 border-b border-sage-cloud`
|    - Title: `text-subheading font-semibold text-graphite`
|    - Close btn: ghost icon button
|  - Body: `flex-1 overflow-y-auto px-6 py-4 space-y-stack`
|    - Form fields/info rows
|    - Labels: `text-caption font-medium text-fog uppercase tracking-wider mb-spacing-sm`
|    - Values: `text-body text-graphite`
|  - Footer: `px-6 py-4 border-t border-sage-cloud flex items-center justify-end gap-inline`
|    - Cancel (outlined) + Save (primary filled)

### Mobile (<md)
|- Panel: `max-w-full w-full` (выезжает снизу или на весь экран)
|- Padding: `px-4`

---

## Form Page Layout

Страница с формой/настройками, сгруппированная в карточки-секции.

**Источник:** QwenPaw — Configuration page, Cron Job creation

### Когда использовать
- Настройки конфигурации агента
- Создание/редактирование сложного объекта
- Параметры с группировкой

### Desktop (md+)
|- Root: `flex flex-col h-full`
|- Page Header: `px-6 py-4 border-b border-sage-cloud`
|  - Title: `text-subheading font-semibold text-graphite`
|  - Description: `text-body-sm text-slate`
|- Form Body: `flex-1 overflow-y-auto px-6 py-4 space-y-stack`
|- Section Card: `bg-white rounded-lg border border-sage-cloud/50 shadow-sm p-card`
|  - Card Title: `text-body font-semibold text-graphite mb-spacing-md`
|  - Card Description: `text-body-sm text-slate mb-spacing-stack`
|  - Fields: `space-y-spacing-stack`
|    - Label: `text-caption font-medium text-fog mb-spacing-xs`
|    - Input/Select/Toggle: `w-full` (input: `border border-sage-cloud rounded-lg px-3 py-2 text-body-sm bg-white`)
|    - Helper text: `text-caption text-fog mt-spacing-xs`
|- Footer: `sticky bottom-0 bg-white border-t border-sage-cloud px-6 py-4 flex items-center justify-end gap-inline`
|  - Reset (outlined) + Save (primary filled)

### Mobile (<md)
|- Padding: `px-4 py-3`
|- Section Card padding: `p-lg` (16px) или `p-card` (если места хватает)
|- Footer: `px-4`

---

## File Editor Layout

Два столбца: навигация по файлам слева, редактор/просмотр справа.

**Источник:** QwenPaw — Files page (Workspace)

### Когда использовать
- Редактирование файлов воркспейса (SOUL.md, AGENTS.md, HEARTBEAT.md и т.д.)
- Просмотр директории с файлами

### Desktop (md+)
|- Root: `flex flex-1 h-full`
|- File Tree (left): `w-64 border-r border-sage-cloud bg-white overflow-y-auto flex flex-col`
|  - Header: `px-4 py-3 text-caption font-semibold text-fog uppercase tracking-wider border-b border-sage-cloud`
|  - File item: `flex items-center gap-inline px-4 py-2.5 text-body-sm text-graphite hover:bg-sage-veil cursor-pointer`
|  - Active file: `bg-sage-veil text-sage-teal font-medium`
|  - Actions (bottom): Download/Upload кнопки
|- Editor (right): `flex-1 flex flex-col`
|  - Header: `flex items-center justify-between px-4 py-2 border-b border-sage-cloud bg-sage-paper/80`
|    - Filename: `text-body-sm font-medium text-graphite`
|    - Toggle: Preview/Edit switch
|  - Preview mode: `flex-1 overflow-y-auto p-6 text-body text-graphite prose max-w-none`
|  - Edit mode: `flex-1 flex` (textarea/CodeMirror)
|  - Footer: `px-4 py-3 border-t border-sage-cloud bg-white flex items-center justify-end gap-inline`
|    - Reset + Save

### Mobile (<md)
|- File Tree: drawer поверх (как sidebar mobile)
|- Editor: full width

---

## List with Toggles Layout

Список элементов с переключателями вкл/выкл.

**Источник:** QwenPaw — Tools page, MCP page

### Когда использовать
- Управление инструментами (вкл/выкл)
- Список MCP клиентов
- Env variables

### Desktop (md+)
|- Root: `flex flex-col h-full`
|- Page Header: `flex items-center justify-between px-6 py-4 border-b border-sage-cloud`
|  - Title + batch actions (Enable All / Disable All)
|- List: `flex-1 overflow-y-auto`
|- Item: `flex items-center justify-between px-6 py-4 border-b border-sage-cloud/50 hover:bg-sage-veil/30`
|  - Left: icon + name + short description
|  - Right: toggle switch (component) + optional dropdown/kebab menu
|  - Name: `text-body font-medium text-graphite`
|  - Description: `text-body-sm text-slate`
|- Toggle Switch: `w-10 h-5 rounded-full bg-sage-cloud relative cursor-pointer transition-colors data-[checked=true]:bg-sage-teal`
|  - Thumb: `absolute w-4 h-4 rounded-full bg-white top-0.5 left-0.5 transition-transform data-[checked=true]:translate-x-5`

### Mobile (<md)
|- Padding: `px-4`

---

## Inbox Layout (Dual Tab)

Две вкладки: Approvals (требуют действия) и Push Messages (уведомления).

**Источник:** QwenPaw — Inbox page

### Когда использовать
- Центр уведомлений с разными типами сообщений
- Approvals / review задач

### Desktop (md+)
|- Root: `flex flex-col h-full`
|- Page Header: `px-6 py-4 border-b border-sage-cloud`
|  - Title + unread dot indicator
|- Tab Bar: `flex border-b border-sage-cloud px-6`
|  - Tab: `px-4 py-3 text-body-sm font-medium text-slate border-b-2 border-transparent cursor-pointer`
|  - Active Tab: `text-sage-teal border-sage-teal`
|- Tab Content: `flex-1 overflow-y-auto p-6 space-y-stack`
|  - **Approvals tab:**
|    - Approval Card: `bg-white rounded-lg border border-sage-cloud/50 shadow-sm p-card`
|    - Header: agent name + timer (countdown)
|    - Description/context
|    - Actions: `flex gap-inline` (Approve primary + Reject outlined)
|  - **Push Messages tab:**
|    - Message Card: `bg-white rounded-lg border border-sage-cloud/50 shadow-sm p-card cursor-pointer`
|    - Header: timestamp + source (cron/heartbeat)
|    - Preview text: `text-body-sm text-slate line-clamp-2`
|    - Click → expand trace details

### Mobile (<md)
|- Padding: `p-4`
|- Approval Card padding: `p-lg` (16px)

---

## Centered Card

### Когда использовать
- Страницы аутентификации (логин, регистрация, восстановление пароля)
- Однократные действия (подтверждение email, приглашение)
- Сообщения об ошибках (403, 404) с возвратом на главную

### Desktop (md+)
|- Root: `flex h-screen items-center justify-center bg-sage-paper`
|- Card: `w-full max-w-sm bg-white rounded-xl shadow-sm p-8`
|- Внутри: вертикальный стек с `gap-6`, элементы выровнены по центру

### Mobile (<md)
|- Root: `p-4` (отступы от краёв)
|- Card: `max-w-sm` (та же ширина, вписана в отступы)

### Структура карточки
1. Логотип/бренд (сверху, центрирован)
2. Заголовок (text-subheading, font-semibold, text-graphite)
3. Описание (text-body-sm, text-slate)
4. Форма/контент (stack gap-4)
5. Action-кнопка (primary, full width)
