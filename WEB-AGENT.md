# SMITH-WEB: Инструкция для агента

> **Где ты:** корень проекта `smith/` — Rust-фреймворк для AI-агентов.
> **Задача:** довести веб-консоль (`crates/app/smith-server/web/`) до полноценного
> интерфейса управления агентами, используя `ui-do` как инструмент генерации layout-скелетов.

---

## 1. Контекст: что такое Smith

Smith — Rust-фреймворк для построения AI-агентов с Windows UI Automation.
Слоистая архитектура: Core → Domain → Integration → Agent → App.

Нас интересует **App-слой**, конкретно `smith-server` — HTTP-сервер,
который отдаёт REST API + статический SPA (веб-консоль).

```
crates/app/smith-server/
├── src/
│   ├── main.rs       # точка входа, раздаёт API + статику
│   ├── routes.rs     # все API-роуты
│   └── state.rs      # AppState
└── web/              # ← SPA (React + Vite + Tailwind v4)
    ├── src/
    │   ├── App.tsx
    │   ├── api.ts
    │   ├── types.ts
    │   ├── app.css
    │   ├── main.tsx
    │   └── components/
    │       ├── AgentsPanel.tsx
    │       ├── ProvidersPanel.tsx
    │       ├── ChatArea.tsx
    │       ├── SessionsPanel.tsx
    │       ├── SettingsPanel.tsx
    │       ├── MemoryPanel.tsx
    │       ├── SecurityPanel.tsx
    │       ├── SkillsPanel.tsx
    │       ├── ToolsPanel.tsx
    │       ├── LogsPanel.tsx
    │       ├── ObservePanel.tsx
    │       └── observe/
    ├── index.html
    ├── package.json
    ├── vite.config.ts
    └── tsconfig.json
```

---

## 2. API-эндпоинты (routes.rs)

Полный список. Веб-консоль должна покрывать **все**.

| Method | Path | Описание | Покрыт UI? |
|--------|------|----------|------------|
| `GET` | `/api/config` | Конфиг сервера | ✅ SettingsPanel |
| `GET/PUT` | `/api/config/settings` | Настройки (memory, env_gate) | ✅ SettingsPanel |
| `GET` | `/api/config/memory` | Статистика памяти | ⚠️ MemoryPanel есть, не подключён |
| `POST` | `/api/config/memory/search` | Поиск по памяти | ⚠️ MemoryPanel есть, не подключён |
| `GET` | `/api/notifications` | Уведомления | ✅ polling в App.tsx |
| `GET/POST` | `/api/providers` | CRUD провайдеров | ✅ ProvidersPanel |
| `PUT/DELETE` | `/api/providers/{id}` | Обновить/удалить провайдер | ✅ ProvidersPanel |
| `GET/POST` | `/api/agents` | CRUD агентов | ✅ AgentsPanel |
| `GET/PUT/DELETE` | `/api/agents/{id}` | Агент целиком | ✅ AgentsPanel |
| `POST` | `/api/agents/{id}/chat` | Чат (non-streaming) | ✅ ChatArea |
| `GET` | `/api/agents/{id}/chat/stream` | SSE-стриминг чата | ✅ ChatArea |
| `GET` | `/api/agents/{id}/sessions` | Сессии агента | ✅ SessionsPanel |
| `GET/DELETE` | `/api/sessions/{id}` | Детали/удаление сессии | ✅ SessionsPanel |
| `GET` | `/api/approvals/pending` | Ожидающие одобрения | ⚠️ SecurityPanel есть, не подключён |
| `POST` | `/api/approvals/{id}/approve` | Одобрить | ⚠️ SecurityPanel есть, не подключён |
| `POST` | `/api/approvals/{id}/deny` | Отклонить | ⚠️ SecurityPanel есть, не подключён |
| `GET/POST` | `/api/mcp-servers` | CRUD MCP-серверов | ❌ нет панели |
| `PUT/DELETE` | `/api/mcp-servers/{name}` | Обновить/удалить MCP | ❌ нет панели |

---

## 3. Текущее состояние web/

### Что работает
- **Sidebar** с двумя вкладками: Agents, Providers
- **ChatArea** с SSE-стримингом, tool calls, reasoning
- **SessionsPanel** — список сессий, переключение
- **SettingsPanel** — модальное окно настроек
- **Toasts** — уведомления
- **View modes** — normal / wide / simple (localStorage)
- **Notifications polling** — каждые 5 сек

### Что НЕ подключено (файлы есть, в навигации нет)
- `MemoryPanel.tsx` — статистика + поиск по эпизодической памяти
- `SecurityPanel.tsx` — approvals (одобрение/отклонение tool calls)
- `SkillsPanel.tsx` — управление скиллами агента
- `ToolsPanel.tsx` — управление инструментами
- `LogsPanel.tsx` — логи
- `ObservePanel.tsx` + `observe/` — трейсы, спаны, метрики

### Чего нет вообще
- **MCP Servers** — панель управления MCP-серверами (API есть, UI нет)
- **shadcn/ui** — проект на чистом Tailwind, без компонентной библиотеки

### Стек web/
- React 19, TypeScript 5.7, Vite 6, Tailwind CSS 4 (CSS-first)
- **Нет** shadcn, **нет** react-router, **нет** zustand
- Всё состояние в App.tsx через useState/useCallback

---

## 4. Задача

Превратить текущую веб-консоль из «чат + два списка» в **полноценную
панель управления агентским фреймворком**. Конкретно:

### 4.1. Полноценный Sidebar

Текущий Sidebar — две кнопки (Agents / Providers). Нужен полноценный
Sidebar с разделами:

```
┌──────────────────────┐
│  S  Smith Console    │
│                      │
│  ▸ Agents            │  ← список агентов + чат
│  ▸ Providers         │  ← LLM-провайдеры
│  ▸ Tools & Skills    │  ← инструменты и скиллы
│  ▸ MCP Servers       │  ← НОВОЕ: управление MCP
│  ▸ Memory            │  ← эпизодическая память
│  ▸ Security          │  ← approvals
│  ▸ Observe           │  ← трейсы, метрики
│  ▸ Logs              │  ← логи
│                      │
│  ─────────────────── │
│  ⚙ Settings          │
└──────────────────────┘
```

### 4.2. Подключить существующие панели

Все 6 неподключённых панелей (Memory, Security, Skills, Tools, Logs, Observe)
должны быть доступны через Sidebar. Каждая панель — отдельный «экран»
в основной области.

### 4.3. Создать MCP Servers панель

Новый компонент `McpServersPanel.tsx`:
- Список MCP-серверов (`GET /api/mcp-servers`)
- Добавление (`POST /api/mcp-servers`): name, command, args[]
- Редактирование (`PUT /api/mcp-servers/{name}`)
- Удаление (`DELETE /api/mcp-servers/{name}`)
- Тип `McpServerConfig` уже есть в `types.ts`

### 4.4. Добавить shadcn/ui

Установить shadcn/ui в `web/`. Мигрировать Sidebar, кнопки, инпуты,
карточки, диалоги на shadcn-компоненты. Существующую логику панелей
не ломать — только заменить разметку на shadcn-компоненты.

---

## 5. ui-do: что это и как использовать

### Что это

`ui-do` — headless-пайплайн: JSON-spec → zod-валидация → детерминированный
codegen → готовый React + Tailwind + shadcn проект.

```
JSON-spec → src/schema.ts (zod) → src/codegen/ → template/ → Vite-проект
```

**Расположение:** `../ui-do/` (рядом с `smith/`).

### Зачем он здесь

ui-do **не генерит компоненты для вставки**. Он генерит **целые проекты**.
Для smith он используется как:

1. **Генератор layout-скелетов** — создаёшь spec с Sidebar + контент-областью,
   прогоняешь через CLI, получаешь готовую разметку, копируешь нужные части
   в `smith-server/web/`.

2. **Референс для структуры** — пресеты (`dashboard`, `settings`, `list-detail`)
   показывают, как правильно организовать layout. Следуй им.

3. **Валидатор** — если пишешь JSON-spec, zod-схема проверит его до генерации.

### Как использовать CLI

```bash
# Генерация проекта из spec
npx tsx ../ui-do/src/cli.ts --spec <spec.json> --out /tmp/smith-ui

# Живой preview
npx tsx ../ui-do/src/preview.ts <spec.json>
```

### Пресеты (../ui-do/src/presets/)

| Пресет | Когда использовать |
|--------|-------------------|
| `dashboard.json` | Главный экран: sidebar + контент |
| `settings.json` | Двухколоночный: nav слева, форма справа |
| `list-detail.json` | Список слева, детали справа (агенты, сессии) |
| `auth.json` | Login-экран (если понадобится) |
| `landing.json` | Не нужен |
| `blank.json` | Пустой flex-column |

### Компоненты (из AGENT-PROMPT.md ui-do)

28 компонентов: Button, Input, Textarea, Select, Checkbox, Switch,
Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter,
Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
Tabs, TabsList, TabsTrigger, TabsContent, Badge, Avatar, Separator,
ScrollArea, Tooltip, Label, Skeleton.

---

## 6. Пошаговый план

> **Правило:** после каждого шага — `cd crates/app/smith-server/web && npx tsc --noEmit`.
> Коммит после каждого шага. Conventional commits.

---

### Шаг 1. Установить shadcn/ui в web/

```bash
cd crates/app/smith-server/web
npx shadcn@latest init
```

При инициализации:
- Style: **New York**
- Base color: **Neutral** (под текущий светлый дизайн)
- CSS variables: **yes**

Установить компоненты:

```bash
npx shadcn@latest add button input textarea select checkbox switch \
  card dialog tabs badge avatar separator scroll-area tooltip label \
  skeleton sidebar sheet dropdown-menu alert-dialog
```

**Важно:** `sidebar` — это shadcn Sidebar-компонент. Он даст полноценный
collapsible sidebar с навигацией, группами, иконками.

**Проверка:** `npx tsc --noEmit` — зелёный. shadcn-компоненты в
`src/components/ui/`.

---

### Шаг 2. Перестроить App.tsx на shadcn Sidebar

Заменить текущий самодельный Sidebar на shadcn `SidebarProvider` + `Sidebar`.

Структура:

```tsx
import { SidebarProvider, Sidebar, SidebarContent, SidebarGroup,
         SidebarGroupLabel, SidebarMenu, SidebarMenuItem, SidebarMenuButton,
         SidebarTrigger } from '@/components/ui/sidebar'

type Section = 'agents' | 'providers' | 'tools' | 'mcp' | 'memory'
             | 'security' | 'observe' | 'logs'

export default function App() {
  const [section, setSection] = useState<Section>('agents')
  // ... существующее состояние (agents, providers, selectedAgent, etc.)

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Smith Console</SidebarGroupLabel>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton isActive={section === 'agents'}
                  onClick={() => setSection('agents')}>
                  Agents
                </SidebarMenuButton>
              </SidebarMenuItem>
              {/* ... остальные разделы */}
            </SidebarMenu>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>

      <main>
        <SidebarTrigger />
        {section === 'agents' && <AgentsView />}
        {section === 'providers' && <ProvidersPanel />}
        {section === 'tools' && <ToolsPanel />}
        {section === 'mcp' && <McpServersPanel />}
        {section === 'memory' && <MemoryPanel />}
        {section === 'security' && <SecurityPanel />}
        {section === 'observe' && <ObservePanel />}
        {section === 'logs' && <LogsPanel />}
      </main>
    </SidebarProvider>
  )
}
```

**Не ломать** существующую логику: loadAgents, loadProviders, selectAgent,
chat, sessions, toasts, notifications polling. Просто обернуть в новую
layout-структуру.

**Проверка:** `npx tsc --noEmit && npm run dev` — Sidebar работает,
все разделы переключаются.

---

### Шаг 3. Подключить существующие панели

Для каждой из 6 неподключённых панелей:

1. Открыть файл (MemoryPanel.tsx, SecurityPanel.tsx, SkillsPanel.tsx,
   ToolsPanel.tsx, LogsPanel.tsx, ObservePanel.tsx)
2. Убедиться, что компонент принимает нужные props
3. Подключить в App.tsx через `section === '...'`
4. Заменить самодельную разметку на shadcn-компоненты (Card, Button, Input...)

**SkillsPanel и ToolsPanel** — объединить в один раздел «Tools & Skills»
с shadcn Tabs внутри:

```tsx
<Tabs defaultValue="tools">
  <TabsList>
    <TabsTrigger value="tools">Tools</TabsTrigger>
    <TabsTrigger value="skills">Skills</TabsTrigger>
  </TabsList>
  <TabsContent value="tools"><ToolsPanel /></TabsContent>
  <TabsContent value="skills"><SkillsPanel /></TabsContent>
</Tabs>
```

**Проверка:** каждый раздел Sidebar показывает соответствующую панель.
Данные загружаются из API.

---

### Шаг 4. Создать McpServersPanel

**Файл:** `src/components/McpServersPanel.tsx`

API:
- `GET /api/mcp-servers` → `McpServerConfig[]`
- `POST /api/mcp-servers` → создать
- `PUT /api/mcp-servers/{name}` → обновить
- `DELETE /api/mcp-servers/{name}` → удалить

Тип уже есть в `types.ts`:

```ts
interface McpServerConfig {
  name: string;
  command: string;
  args: string[];
}
```

UI:
- Список серверов в виде Card (name, command, args)
- Кнопка «Add MCP Server» → Dialog с формой (name, command, args)
- Edit / Delete на каждой карточке
- Пустое состояние: «No MCP servers configured»

Добавить функции в `api.ts`:

```ts
export async function listMcpServers(): Promise<McpServerConfig[]> {
  return request('/api/mcp-servers');
}
export async function createMcpServer(body: McpServerConfig): Promise<McpServerConfig> {
  return request('/api/mcp-servers', { method: 'POST', body: JSON.stringify(body) });
}
export async function updateMcpServer(name: string, body: McpServerConfig): Promise<McpServerConfig> {
  return request(`/api/mcp-servers/${name}`, { method: 'PUT', body: JSON.stringify(body) });
}
export async function deleteMcpServer(name: string): Promise<void> {
  return request(`/api/mcp-servers/${name}`, { method: 'DELETE' });
}
```

**Проверка:** MCP-раздел в Sidebar работает, CRUD функционален.

---

### Шаг 5. Мигрировать существующие компоненты на shadcn

Для каждого компонента заменить самодельную разметку:

| Было | Стало |
|------|-------|
| `<button className="...">` | `<Button variant="...">` |
| `<input className="...">` | `<Input />` |
| `<div className="rounded border p-4">` | `<Card><CardContent>` |
| Самодельный modal | `<Dialog>` |
| Самодельный select | `<Select>` |
| Самодельный toggle | `<Switch>` |

**Не менять логику.** Только разметку. Props, state, API-вызовы — без изменений.

Приоритет миграции:
1. ChatArea (самый видимый)
2. AgentsPanel
3. ProvidersPanel
4. SessionsPanel
5. SettingsPanel
6. Остальные панели

**Проверка:** после каждого компонента — `npx tsc --noEmit`.
Визуально — `npm run dev`, проверить что ничего не сломалось.

---

### Шаг 6. Настроить Vite proxy

Убедиться, что `vite.config.ts` проксирует API на бэкенд:

```ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    proxy: {
      '/api': 'http://localhost:3000',  // порт smith-server
    },
  },
})
```

**Проверка:** `npm run dev` → API-вызовы идут через proxy, данные загружаются.

---

### Шаг 7. Финальная проверка

```bash
cd crates/app/smith-server/web

# TypeScript
npx tsc --noEmit

# Dev-сервер
npm run dev
# → открыть браузер, проверить все разделы Sidebar

# Build
npm run build
# → dist/ создан, index.html + ассеты

# Проверка что smith-server раздаёт статику
cd ..
cargo run
# → открыть http://localhost:3000, веб-консоль загружается
```

Чеклист:
- [ ] Sidebar: 8 разделов + Settings
- [ ] Agents: список, выбор, чат, сессии
- [ ] Providers: CRUD
- [ ] Tools & Skills: вкладки, список
- [ ] MCP Servers: CRUD (новый)
- [ ] Memory: статистика + поиск
- [ ] Security: approvals (approve/deny)
- [ ] Observe: трейсы, спаны, метрики
- [ ] Logs: просмотр логов
- [ ] Settings: модальное окно
- [ ] Toasts: уведомления
- [ ] View modes: normal / wide / simple
- [ ] SSE-стриминг чата работает
- [ ] Notifications polling работает
- [ ] `npm run build` → `cargo run` → консоль в браузере

---

## 7. Правила

1. **Не ломать существующую логику.** ChatArea, SSE, sessions, toasts —
   работают. Не переписывать, только заменять разметку.
2. **Типы из `types.ts`** — не менять без необходимости. Они соответствуют
   Rust-структурам в `routes.rs`.
3. **API-клиент `api.ts`** — все запросы через `request()`. Не добавлять
   прямые `fetch()` в компоненты.
4. **Tailwind v4, CSS-first.** Нет `tailwind.config.js`. Токены в `app.css`.
5. **shadcn-компоненты** — в `src/components/ui/`. Не редактировать их.
   Кастомизация — через className-пропс.
6. **Файлы ≤ 300 строк.** Если компонент больше — разбить.
7. **Коммит после каждого шага.** Conventional commits:
   `feat(web): add shadcn sidebar`, `feat(web): add mcp servers panel`, etc.
8. **Не трогать Rust-код** (`src/main.rs`, `routes.rs`, `state.rs`).
   Только `web/`.
9. **Не добавлять зависимости** кроме shadcn (уже согласовано).
   Никаких react-router, zustand, axios. Всё через fetch + useState.

---

## 8. Чего НЕ делать

- Не переписывать ChatArea с нуля. Он работает.
- Не добавлять react-router. Навигация через `section` state в App.tsx.
- Не создавать отдельные страницы/роуты. Это SPA с одним App.tsx.
- Не трогать `smith-server/src/` (Rust).
- Не менять `types.ts` без необходимости.
- Не удалять существующие компоненты. Только мигрировать разметку.
- Не использовать ui-do CLI для генерации целых проектов в `web/`.
  ui-do — референс для layout-структуры, не генератор компонентов.