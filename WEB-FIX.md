# WEB-FIX: Исправление всех архитектурных замечаний веб-консоли

> **Где ты:** корень проекта `smith/`. Веб-консоль в `crates/app/smith-server/web/`.
> **Задача:** исправить 15 замечаний (3 критичных, 3 серьёзных, 6 средних, 3 мелких)
> и адаптировать Sidebar под shadcn sidebar-08 layout.
> **Принцип:** не ломать рабочую логику (SSE-стриминг, API-вызовы, состояние).
> Менять разметку, стили, структуру — не поведение.

---

## 0. Текущее состояние

```
web/src/
├── App.tsx              # 549 строк, God Component
├── api.ts               # API-клиент, 120 строк
├── types.ts             # типы + BUILTIN_TOOLS const
├── app.css              # shadcn-токены, НЕТ кастомных цветов
├── main.tsx
└── components/
    ├── ui/              # shadcn-компоненты (не трогать)
    ├── ChatArea.tsx     # 360 строк, использует несуществующие CSS-классы
    ├── AgentsPanel.tsx
    ├── ProvidersPanel.tsx
    ├── SessionsPanel.tsx
    ├── SettingsPanel.tsx
    ├── MemoryPanel.tsx
    ├── SecurityPanel.tsx
    ├── SkillsPanel.tsx
    ├── ToolsPanel.tsx
    ├── LogsPanel.tsx
    ├── ObservePanel.tsx
    ├── LoginPage.tsx    # мёртвый код
    └── observe/
```

Стек: React 19, Vite 6, Tailwind v4 (CSS-first), shadcn (base-nova), TypeScript 5.7.

---

## 1. Пошаговый план

> После каждого шага: `cd crates/app/smith-server/web && npx tsc --noEmit`.
> Коммит после каждого шага. Conventional commits.

---

### Шаг 1. Починить ChatArea: заменить несуществующие CSS-классы

**Проблема:** ChatArea.tsx использует цвета и утилиты из старого дизайна,
которых нет в `app.css`:

| Несуществующий класс | Заменить на |
|---|---|
| `bg-sage-teal/10` | `bg-primary/10` |
| `text-graphite` | `text-foreground` |
| `border-sage-cloud` | `border-border` |
| `bg-sage-veil` | `bg-muted` |
| `text-slate` | `text-muted-foreground` |
| `bg-sage-paper` | `bg-card` |
| `text-carbon` | `text-foreground` |
| `text-fog` | `text-muted-foreground` |
| `text-body-sm` | `text-sm` |
| `text-body` | `text-base` |
| `text-caption` | `text-xs` |
| `animate-fade-in-up` | `animate-in fade-in slide-in-from-bottom-2` (tw-animate-css) |
| `animate-typing` | `animate-pulse` |
| `animate-pulse-soft` | `animate-pulse` |
| `animate-fade-in` | `animate-in fade-in` |

**Как:** открыть `ChatArea.tsx`, найти все вхождения, заменить по таблице.
Не менять логику (SSE, очередь, таймауты). Только className-строки.

**Проверка:**
```bash
grep -n "sage-teal\|graphite\|sage-cloud\|sage-veil\|sage-paper\|carbon\|fog\|text-body\|text-caption\|animate-fade-in-up\|animate-typing\|animate-pulse-soft" src/components/ChatArea.tsx
# → 0 результатов
npx tsc --noEmit
npm run dev
# → чат отображается: пузыри сообщений имеют фон, текст читаем
```

---

### Шаг 2. Починить View-Only баннер

**Проблема:** в App.tsx:

```tsx
{config?.owner_id && (
  <div>View-Only Mode — You are viewing {config.owner_id}'s console</div>
)}
```

`owner_id` — обязательное поле в `Config`. Баннер показывается **всегда**.

**Решение:** удалить баннер целиком. View-only mode не реализован на бэкенде.
Если понадобится — добавится позже с отдельным флагом `is_view_only`.

**Как:** найти блок `{config?.owner_id && (...)}` в App.tsx, удалить.

**Проверка:** баннер не отображается. `npx tsc --noEmit`.

---

### Шаг 3. Адаптировать Sidebar под sidebar-08

**Проблема:** текущий Sidebar — базовый (без header, footer, breadcrumbs).
Нужен sidebar-08 layout из shadcn.

**Что такое sidebar-08:**

```
SidebarProvider
├── Sidebar (collapsible="icon")
│   ├── SidebarHeader
│   │   └── SidebarMenu → DropdownMenu (project/workspace switcher)
│   ├── SidebarContent
│   │   ├── SidebarGroup (collapsible) → Agent
│   │   ├── SidebarGroup (collapsible) → Infrastructure
│   │   └── SidebarGroup (collapsible) → Monitoring
│   └── SidebarFooter
│       └── SidebarMenu → Settings button
└── SidebarInset
    ├── header (breadcrumbs + SidebarTrigger + Separator)
    └── main (контент)
```

**Как:**

1. Убедиться, что все нужные shadcn-компоненты установлены:

```bash
cd crates/app/smith-server/web
npx shadcn@latest add sidebar breadcrumb dropdown-menu separator
```

2. Перестроить layout в App.tsx:

```tsx
import {
  SidebarProvider, Sidebar, SidebarHeader, SidebarContent,
  SidebarGroup, SidebarGroupLabel, SidebarGroupContent,
  SidebarMenu, SidebarMenuItem, SidebarMenuButton,
  SidebarFooter, SidebarTrigger, SidebarInset,
  useSidebar,
} from '@/components/ui/sidebar'
import {
  Breadcrumb, BreadcrumbItem, BreadcrumbLink,
  BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { Separator } from '@/components/ui/separator'
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

// NAV_GROUPS уже есть — оставить как есть

function AppSidebar({ activeView, onNavigate }: { ... }) {
  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton>
                  Smith Console
                  <ChevronsUpDown className="ml-auto" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem>Default Workspace</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        {NAV_GROUPS.map(group => (
          <SidebarGroup key={group.label}>
            <SidebarGroupLabel>{group.label}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map(item => (
                  <SidebarMenuItem key={item.id}>
                    <SidebarMenuButton
                      isActive={activeView === item.id}
                      onClick={() => onNavigate(item.id)}
                    >
                      {ICONS[item.id]}
                      <span>{item.label}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton onClick={() => setShowSettings(true)}>
              <Settings2 /> Settings
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}

// В основном return:
<SidebarProvider>
  <AppSidebar activeView={activeView} onNavigate={setActiveView} />
  <SidebarInset>
    <header className="flex h-14 items-center gap-2 border-b px-4">
      <SidebarTrigger />
      <Separator orientation="vertical" className="h-4" />
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbPage>{VIEW_TITLES[activeView]}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    </header>
    <main className="flex-1 overflow-auto p-4">
      {renderView()}
    </main>
  </SidebarInset>
</SidebarProvider>
```

3. Удалить старый самодельный Sidebar (div с кнопками).

**Проверка:**
- Sidebar collapsible (иконка → полный)
- Header с dropdown
- Footer с Settings
- Breadcrumbs показывают текущий раздел
- Все 10 разделов переключаются
- `npx tsc --noEmit`

---

### Шаг 4. Разбить App.tsx (God Component → модули)

**Проблема:** 549 строк, 12 useState, 8 useCallback, 14 case в switch.

**Решение:** вынести в отдельные файлы.

```
web/src/
├── App.tsx              # ~120 строк: layout + routing
├── hooks/
│   ├── useAgents.ts     # agents, providers, loadAgents, loadProviders, selectAgent
│   ├── useChat.ts       # messages, isStreaming, sendMessage, SSE-логика
│   ├── useSessions.ts   # sessions, currentSessionId, loadSessions
│   └── useConfig.ts     # config, viewMode, showSettings, notifications
├── views/
│   ├── AgentsView.tsx   # AgentsPanel + ChatArea + SessionsPanel
│   ├── ProvidersView.tsx
│   ├── ToolsSkillsView.tsx  # Tabs: ToolsPanel + SkillsPanel
│   ├── McpView.tsx
│   ├── MemoryView.tsx
│   ├── SecurityView.tsx
│   ├── ObserveView.tsx
│   └── LogsView.tsx
```

**App.tsx после рефакторинга:**

```tsx
export default function App() {
  const [activeView, setActiveView] = useState<ViewId>('agents')
  const agents = useAgents()
  const chat = useChat(agents.selectedAgent)
  const sessions = useSessions(agents.selectedAgent)
  const config = useConfig()

  return (
    <SidebarProvider>
      <AppSidebar activeView={activeView} onNavigate={setActiveView} />
      <SidebarInset>
        <AppHeader title={VIEW_TITLES[activeView]} />
        <main>
          {activeView === 'agents' && (
            <AgentsView agents={agents} chat={chat} sessions={sessions} />
          )}
          {activeView === 'providers' && <ProvidersView agents={agents} />}
          {/* ... */}
        </main>
      </SidebarInset>
      <SettingsDialog open={config.showSettings} onClose={...} />
      <Toaster />
    </SidebarProvider>
  )
}
```

**Правила:**
- Каждый хук — один файл, ≤ 100 строк
- Каждый view — один файл, ≤ 150 строк
- App.tsx — только layout + композиция, ≤ 120 строк
- Не менять логику. Только переносить код в файлы.
- Props передавать явно, без контекста (пока).

**Проверка:** `npx tsc --noEmit && npm run dev` — всё работает как раньше.

---

### Шаг 5. Починить api.ts

**Проблема 1:** нет проверки `res.ok`.

```ts
// БЫЛО:
async function request<T>(path: string, opts: RequestInit = {}): Promise<T> {
  const res = await fetch(path, {...});
  const json: ApiResponse<T> = await res.json();  // ← SyntaxError на HTML 500
  if (!json.success) throw new ApiError(json.error || 'API error');
  return json.data as T;
}

// СТАЛО:
async function request<T>(path: string, opts: RequestInit = {}): Promise<T> {
  const res = await fetch(path, {...});

  if (!res.ok) {
    // Пробуем распарсить JSON-ошибку, иначе — текст
    let message = `HTTP ${res.status}`;
    try {
      const json = await res.json();
      if (json.error) message = json.error;
    } catch { /* не JSON — оставляем HTTP status */ }
    throw new ApiError(message);
  }

  const json: ApiResponse<T> = await res.json();
  if (!json.success) throw new ApiError(json.error || 'API error');
  return json.data as T;
}
```

**Проблема 2:** дублирование searchMemory.

Удалить `searchMemory` (GET `/api/memory/search`). Оставить только
`searchMemoryEpisodic` (POST `/api/config/memory/search`) — это
реальный эндпоинт из `routes.rs`.

Если MemoryPanel использует `searchMemory` — заменить на `searchMemoryEpisodic`.

**Проверка:**
```bash
grep -n "searchMemory[^E]" src/ -r
# → 0 результатов (кроме searchMemoryEpisodic)
npx tsc --noEmit
```

---

### Шаг 6. Загрузить tools из API

**Проблема:** `tools` state в App.tsx инициализируется `[]` и никогда
не загружается.

**Решение:** в хуке `useAgents` (после рефакторинга) или в App.tsx
(до рефакторинга) добавить загрузку:

```ts
const loadTools = useCallback(async (agentId: string) => {
  try {
    const agent = await getAgent(agentId);
    setTools(agent.tools ?? []);
  } catch { /* ignore */ }
}, []);
```

Вызывать при `selectAgent`. ToolsPanel получит реальные данные.

Если API не возвращает tools в Agent-объекте — проверить `routes.rs`,
поле `tools` в `AgentConfig`. Если его нет — ToolsPanel показывает
встроенные инструменты из `BUILTIN_TOOLS` как fallback.

**Проверка:** раздел Tools & Skills показывает данные. `npx tsc --noEmit`.

---

### Шаг 7. Убрать next-themes

**Проблема:** `next-themes` — для Next.js, не для Vite.

**Решение:**

1. Удалить зависимость:
```bash
npm uninstall next-themes
```

2. Удалить из App.tsx:
```tsx
// УДАЛИТЬ:
import { ThemeProvider } from 'next-themes'
// УДАЛИТЬ:
<ThemeProvider attribute="class" defaultTheme="light">...</ThemeProvider>
```

3. Тёмная тема (если нужна) — через CSS-переменные, которые уже есть
в `app.css` (`.dark { ... }`). Переключение:
```ts
document.documentElement.classList.toggle('dark')
```

Пока тема только светлая — просто убрать ThemeProvider.

**Проверка:** `npx tsc --noEmit && npm run dev` — UI не сломался.

---

### Шаг 8. Почистить package.json

**Проблема 1:** `shadcn` CLI в dependencies.

```bash
npm uninstall shadcn
# shadcn используется через npx, не нужен в package.json
```

**Проблема 2:** `@fontsource-variable/geist` загружается, но CSS
использует Inter.

Вариант A (предпочтительный): заменить Inter на Geist в app.css:
```css
/* app.css */
@import '@fontsource-variable/geist';

:root {
  --font-sans: 'Geist Variable', ui-sans-serif, system-ui, sans-serif;
}
```

Вариант B: удалить Geist, загрузить Inter:
```bash
npm uninstall @fontsource-variable/geist
npm install @fontsource-variable/inter
```
```css
@import '@fontsource-variable/inter';
```

Выбрать вариант A (Geist уже загружен, просто не используется).

**Проблема 3:** `@radix-ui/react-icons` — проверить, используется ли.

```bash
grep -r "@radix-ui/react-icons" src/
```

Если 0 результатов — удалить:
```bash
npm uninstall @radix-ui/react-icons
```

**Проверка:** `npm ls` — нет ошибок. `npx tsc --noEmit`.

---

### Шаг 9. Вынести BUILTIN_TOOLS из types.ts

**Проблема:** runtime-константа в файле типов.

**Решение:**

1. Создать `src/constants.ts`:
```ts
export const BUILTIN_TOOLS = [
  { name: 'calculator', description: 'Performs arithmetic calculations' },
  { name: 'time', description: 'Gets the current time' },
  { name: 'shell', description: 'Executes shell commands' },
] as const;
```

2. В `types.ts` — удалить `BUILTIN_TOOLS`, оставить только `type` и `interface`.

3. Обновить импорты:
```bash
grep -rn "BUILTIN_TOOLS" src/
# → заменить import { BUILTIN_TOOLS } from './types'
#   на import { BUILTIN_TOOLS } from './constants'
```

**Проверка:** `npx tsc --noEmit`.

---

### Шаг 10. Удалить мёртвый код

1. **LoginPage.tsx** — удалить файл. Удалить импорт из App.tsx.
   Удалить `isAuthenticated` state и `handleLogin` callback.

2. **sidebarCollapsed** — удалить переменную из App.tsx (не используется).

3. **searchMemory** (GET) — удалён в шаге 5.

**Проверка:**
```bash
grep -rn "LoginPage\|isAuthenticated\|handleLogin\|sidebarCollapsed" src/
# → 0 результатов
npx tsc --noEmit
```

---

### Шаг 11. Починить Vite proxy

**Проблема:** при ECONNREFUSED возвращает HTTP 200.

```ts
// БЫЛО:
proxy.on('error', (err, _req, res) => {
  if ((err as any)?.code === 'ECONNREFUSED') {
    (res as any)?.writeHead?.(200, {'Content-Type': 'application/json'})
    ;(res as any)?.end?.(JSON.stringify({success: false, error: 'Backend unavailable'}))
  }
})

// СТАЛО:
proxy.on('error', (err, _req, res) => {
  if ((err as NodeJS.ErrnoException)?.code === 'ECONNREFUSED') {
    if (res && 'writeHead' in res) {
      res.writeHead(502, { 'Content-Type': 'application/json' })
      res.end(JSON.stringify({ success: false, error: 'Backend unavailable (smith-server not running)' }))
    }
  }
})
```

**Проверка:** остановить бэкенд, открыть веб → API-вызовы возвращают 502,
UI показывает ошибку, а не пустые данные.

---

### Шаг 12. Починить EventSource в ChatArea

**Проблема:** два обработчика `done`, первый без `{once: true}`.

```ts
// БЫЛО:
es.addEventListener('done', () => { finishStream(true) })
// ...
es.addEventListener('done', () => clearTimeout(timeoutId), { once: true })

// СТАЛО: один обработчик
es.addEventListener('done', () => {
  clearTimeout(timeoutId)
  finishStream(true)
}, { once: true })
```

Также добавить `{ once: true }` на обработчик `error`:

```ts
es.addEventListener('error', () => {
  clearTimeout(timeoutId)
  es.close()
  finishStream(false)
}, { once: true })
```

**Проверка:** `npx tsc --noEmit`. Визуально: чат стримит, после
завершения — нет дублирования сообщений.

---

### Шаг 13. Финальная проверка

```bash
cd crates/app/smith-server/web

# 1. TypeScript
npx tsc --noEmit

# 2. Dev-сервер
npm run dev
# → открыть браузер

# 3. Чеклист:
# - [ ] Sidebar: sidebar-08 layout (header, collapsible groups, footer)
# - [ ] Breadcrumbs показывают текущий раздел
# - [ ] Sidebar collapsible (иконка ↔ полный)
# - [ ] Все 10 разделов переключаются
# - [ ] Чат: пузыри имеют фон, текст читаем, анимации работают
# - [ ] Нет баннера "View-Only Mode"
# - [ ] Tools & Skills показывает данные
# - [ ] MCP Servers: CRUD работает
# - [ ] Memory: поиск работает
# - [ ] Security: approvals отображаются
# - [ ] Settings: модальное окно открывается
# - [ ] SSE-стриминг чата работает
# - [ ] Toasts показываются
# - [ ] View modes (normal/wide/simple) работают

# 4. Build
npm run build

# 5. Проверка через cargo
cd ..
cargo run
# → http://localhost:3000 — консоль загружается

# 6. Нет мусора
grep -rn "sage-teal\|graphite\|sage-cloud\|text-body-sm\|next-themes\|LoginPage\|sidebarCollapsed" src/
# → 0 результатов

# 7. App.tsx ≤ 120 строк
wc -l src/App.tsx
# → ≤ 120
```

---

## 2. Правила

1. **Не ломать рабочую логику.** SSE-стриминг, API-вызовы, состояние,
   notifications polling — работают. Не переписывать.
2. **shadcn-компоненты в `src/components/ui/`** — не редактировать.
3. **Tailwind v4, CSS-first.** Нет `tailwind.config.js`. Токены в `app.css`.
4. **Файлы ≤ 150 строк** (компоненты), **≤ 120 строк** (App.tsx),
   **≤ 100 строк** (хуки).
5. **Коммит после каждого шага.** Conventional commits:
   `fix(web): replace dead CSS classes in ChatArea`,
   `feat(web): adapt sidebar-08 layout`,
   `refactor(web): split App.tsx into hooks and views`, etc.
6. **Не трогать Rust-код** (`src/main.rs`, `routes.rs`, `state.rs`).
7. **Не добавлять зависимости** кроме тех, что указаны в шагах.
8. **Не создавать react-router.** Навигация через `activeView` state.

---

## 3. Чего НЕ делать

- Не переписывать ChatArea с нуля. Только заменить CSS-классы.
- Не менять SSE-логику (EventSource, очередь, таймауты).
- Не менять `types.ts` (кроме удаления BUILTIN_TOOLS).
- Не удалять существующие панели. Только подключать и мигрировать разметку.
- Не трогать `observe/` подкаталог.
- Не добавлять тёмную тему. Только убрать next-themes.
- Не менять API-эндпоинты. Только чинить клиент.