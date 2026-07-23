import { useState, useEffect, useCallback, useRef } from 'react'
import { toast } from 'sonner'
import { ThemeProvider } from 'next-themes'
import {
  MessageSquare, Inbox, Bot, Plug, LayoutList, Clock,
  Brain, Zap, Link, FolderOpen, BarChart3,
  FileText, Shield, UserCog, PanelLeft,
} from 'lucide-react'
import './app.css'
import { Toaster } from './components/ui/sonner'
import { Button } from './components/ui/button'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from './components/ui/sheet'
import { ScrollArea } from './components/ui/scroll-area'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs'
import {
  SidebarProvider, Sidebar, SidebarContent, SidebarGroup, SidebarGroupLabel,
  SidebarGroupContent, SidebarMenu, SidebarMenuItem, SidebarMenuButton,
  SidebarHeader, SidebarFooter, SidebarSeparator, SidebarTrigger,
  SidebarInset, SidebarRail,
} from './components/ui/sidebar'
import { TooltipProvider } from './components/ui/tooltip'
import { ProvidersPanel } from './components/ProvidersPanel'
import { AgentsPanel } from './components/AgentsPanel'
import { ChatArea } from './components/ChatArea'
import { SessionsPanel } from './components/SessionsPanel'
import { SettingsPanel } from './components/SettingsPanel'
import { LoginPage } from './components/LoginPage'
import { LogsPanel } from './components/LogsPanel'
import { MemoryPanel } from './components/MemoryPanel'
import { ObservePage } from './components/observe/ObservePage'
import { SecurityPanel } from './components/SecurityPanel'
import { SkillsPanel } from './components/SkillsPanel'
import { ToolsPanel } from './components/ToolsPanel'
import { InboxPage } from './components/InboxPage'
import { SessionsOverviewPage } from './components/SessionsOverviewPage'
import { CronJobsPage } from './components/CronJobsPage'
import { FilesPage } from './components/FilesPage'
import { McpPage } from './components/McpPage'
import * as api from './api'
import type { AgentSummary, ProviderConfig, SessionSummary, ChatMessage, Config, ToolBinding } from './types'

type View = 'chat' | 'inbox' | 'agents' | 'providers' | 'sessions_overview' | 'cronjobs' | 'memory' | 'tools-skills' | 'mcp' | 'files' | 'observe' | 'logs' | 'security' | 'settings'

type ViewMode = 'normal' | 'wide' | 'simple'

interface NavItem {
  id: View
  label: string
  icon: React.ReactNode
}

interface NavGroup {
  title: string
  items: NavItem[]
}

const ICONS: Record<string, React.ReactNode> = {
  chat: <MessageSquare className="size-4" />,
  inbox: <Inbox className="size-4" />,
  agents: <Bot className="size-4" />,
  providers: <Plug className="size-4" />,
  sessions_overview: <LayoutList className="size-4" />,
  cronjobs: <Clock className="size-4" />,
  memory: <Brain className="size-4" />,
  'tools-skills': <Zap className="size-4" />,
  mcp: <Link className="size-4" />,
  files: <FolderOpen className="size-4" />,
  observe: <BarChart3 className="size-4" />,
  logs: <FileText className="size-4" />,
  security: <Shield className="size-4" />,
  settings: <UserCog className="size-4" />,
}

const NAV_GROUPS: NavGroup[] = [
  {
    title: 'Chat',
    items: [{ id: 'chat', label: 'Chat', icon: ICONS.chat }],
  },
  {
    title: 'Inbox',
    items: [{ id: 'inbox', label: 'Inbox', icon: ICONS.inbox }],
  },
  {
    title: 'Control',
    items: [
      { id: 'agents', label: 'Agents', icon: ICONS.agents },
      { id: 'providers', label: 'Providers', icon: ICONS.providers },
      { id: 'sessions_overview', label: 'Sessions', icon: ICONS.sessions_overview },
      { id: 'cronjobs', label: 'Cron Jobs', icon: ICONS.cronjobs },
    ],
  },
  {
    title: 'Workspace',
    items: [
      { id: 'memory', label: 'Memory', icon: ICONS.memory },
      { id: 'tools-skills', label: 'Tools & Skills', icon: ICONS['tools-skills'] },
      { id: 'mcp', label: 'MCP', icon: ICONS.mcp },
      { id: 'files', label: 'Files', icon: ICONS.files },
    ],
  },
  {
    title: 'Observe',
    items: [
      { id: 'observe', label: 'Observe', icon: ICONS.observe },
      { id: 'logs', label: 'Logs', icon: ICONS.logs },
      { id: 'security', label: 'Security', icon: ICONS.security },
    ],
  },
]

const VIEW_TITLES: Record<View, string> = {
  chat: 'Chat',
  inbox: 'Inbox',
  agents: 'Agents',
  providers: 'Providers',
  sessions_overview: 'Sessions',
  cronjobs: 'Cron Jobs',
  memory: 'Memory',
  'tools-skills': 'Tools & Skills',
  mcp: 'MCP',
  files: 'Files',
  observe: 'Observe',
  logs: 'Logs',
  security: 'Security',
  settings: 'Settings',
}

function loadViewMode(): ViewMode {
  try {
    const saved = localStorage.getItem('smith_view_mode')
    if (saved === 'wide' || saved === 'simple') return saved
  } catch { /* ignore */ }
  return 'normal'
}

function saveViewMode(mode: ViewMode) {
  try { localStorage.setItem('smith_view_mode', mode) }
  catch { /* ignore */ }
}

function AppContent() {
  const [isAuthenticated] = useState(true)

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleLogin = useCallback(() => {
    // auth temporarily disabled
  }, [])

  const [activeView, setActiveView] = useState<View>('chat')
  const [agents, setAgents] = useState<AgentSummary[]>([])
  const [providers, setProviders] = useState<ProviderConfig[]>([])
  const [selectedAgent, setSelectedAgent] = useState<AgentSummary | null>(null)
  const [sessions, setSessions] = useState<SessionSummary[]>([])
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [tools, setTools] = useState<ToolBinding[]>([])
  const [config, setConfig] = useState<Config | null>(null)
  const [showSettings, setShowSettings] = useState(false)
  const [viewMode, setViewMode] = useState<ViewMode>(loadViewMode)
  const notifIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const addToast = useCallback((msg: string, type: 'error' | 'success' | 'info' = 'error') => {
    if (type === 'success') toast.success(msg)
    else if (type === 'error') toast.error(msg)
    else toast.info(msg)
  }, [])

  const loadAgents = useCallback(async () => {
    try { setAgents(await api.listAgents()) }
    catch (e: any) { addToast(e.message) }
  }, [addToast])

  const loadProviders = useCallback(async () => {
    try { setProviders(await api.listProviders()) }
    catch (e: any) { addToast(e.message) }
  }, [addToast])

  const loadConfig = useCallback(async () => {
    try { setConfig(await api.getConfig()) }
    catch { /* config not critical */ }
  }, [])

  const loadSessions = useCallback(async (agentId: string) => {
    try { setSessions(await api.listSessions(agentId)) }
    catch { /* ignore */ }
  }, [])

  const selectAgent = useCallback((agent: AgentSummary) => {
    setSelectedAgent(agent)
    setCurrentSessionId(null)
    setMessages([])
    loadSessions(agent.id)
    setActiveView('chat')
  }, [loadSessions])

  const handleViewModeChange = useCallback((mode: ViewMode) => {
    setViewMode(mode)
    saveViewMode(mode)
  }, [])

  useEffect(() => { loadProviders(); loadAgents(); loadConfig() }, [loadProviders, loadAgents, loadConfig])

  // Poll notifications for background task completion
  useEffect(() => {
    if (notifIntervalRef.current) clearInterval(notifIntervalRef.current)
    notifIntervalRef.current = setInterval(async () => {
      try {
        const notes = await api.getNotifications()
        for (const n of notes) {
          if (n.kind === 'task_completed') {
            addToast(`Task completed: ${n.message}`, 'success')
          } else if (n.kind === 'task_failed') {
            addToast(`Task failed: ${n.message}`, 'error')
          } else if (n.kind === 'approval_created') {
            addToast(`🔴 ${n.message}`, 'info')
          } else {
            addToast(n.message, 'info')
          }
        }
      } catch { /* ignore polling errors */ }
    }, 5000)
    return () => {
      if (notifIntervalRef.current) clearInterval(notifIntervalRef.current)
    }
  }, [addToast])

  const refreshAll = useCallback(() => {
    loadProviders(); loadAgents(); loadConfig()
    if (selectedAgent) loadSessions(selectedAgent.id)
  }, [loadProviders, loadAgents, loadConfig, loadSessions, selectedAgent])

  // Navigation
  const navigate = useCallback((view: View) => {
    if (view === 'settings') {
      setShowSettings(true)
    } else {
      setActiveView(view)
    }
  }, [])

  // Render content for the active view
  const renderContent = () => {
    switch (activeView) {
      case 'chat':
        if (selectedAgent) {
          return (
            <ChatArea
              key={selectedAgent.id}
              agentId={selectedAgent.id}
              sessionId={currentSessionId}
              messages={messages}
              onMessagesChange={setMessages}
              onSessionChange={(sid) => {
                setCurrentSessionId(sid)
                if (selectedAgent) loadSessions(selectedAgent.id)
              }}
              addToast={addToast}
            />
          )
        }
        return (
          <div className="flex-1 flex flex-col items-center justify-center text-center px-8">
            <div className="size-16 rounded-xl bg-primary/10 flex items-center justify-center mb-6">
              <MessageSquare className="size-7 text-primary" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">Smith Console</h3>
            <p className="text-sm text-muted-foreground max-w-xs">Select an agent from the sidebar to start chatting.</p>
          </div>
        )
      case 'inbox':
        return (
          <div className="p-6">
            <InboxPage addToast={addToast} />
          </div>
        )
      case 'agents':
        return (
          <div className="p-6">
            <AgentsPanel
              agents={agents}
              providers={providers}
              selectedAgent={selectedAgent}
              onSelect={selectAgent}
              onRefresh={loadAgents}
              addToast={addToast}
            />
          </div>
        )
      case 'providers':
        return (
          <div className="p-6">
            <ProvidersPanel
              providers={providers}
              onRefresh={loadProviders}
              addToast={addToast}
            />
          </div>
        )
      case 'sessions_overview':
        return (
          <div className="p-6">
            <SessionsOverviewPage addToast={addToast} />
          </div>
        )
      case 'cronjobs':
        return (
          <div className="p-6">
            <CronJobsPage addToast={addToast} />
          </div>
        )
      case 'memory':
        return (
          <div className="p-6">
            <MemoryPanel addToast={addToast} />
          </div>
        )
      case 'tools-skills':
        return (
          <div className="p-6">
            <Tabs defaultValue="tools">
              <TabsList>
                <TabsTrigger value="tools">Tools</TabsTrigger>
                <TabsTrigger value="skills">Skills</TabsTrigger>
              </TabsList>
              <TabsContent value="tools" className="mt-4">
                <ToolsPanel tools={tools} onToolsChange={setTools} />
              </TabsContent>
              <TabsContent value="skills" className="mt-4">
                <SkillsPanel addToast={addToast} />
              </TabsContent>
            </Tabs>
          </div>
        )
      case 'mcp':
        return (
          <div className="p-6">
            <McpPage addToast={addToast} />
          </div>
        )
      case 'files':
        return (
          <div className="p-6">
            <FilesPage addToast={addToast} />
          </div>
        )
      case 'observe':
        return (
          <div className="p-6">
            <ObservePage addToast={addToast} />
          </div>
        )
      case 'logs':
        return (
          <div className="p-6">
            <LogsPanel addToast={addToast} />
          </div>
        )
      case 'security':
        return (
          <div className="p-6">
            <SecurityPanel addToast={addToast} />
          </div>
        )
      case 'settings':
        return null // handled by Sheet overlay
      default:
        return null
    }
  }

  if (!isAuthenticated) {
    return <LoginPage onLogin={handleLogin} />
  }

  const sidebarShown = viewMode === 'normal'
  const sidebarCollapsed = viewMode === 'wide'
  const pageTitle = VIEW_TITLES[activeView]

  // Simple mode: minimal layout without sidebar
  if (viewMode === 'simple') {
    return (
      <div className="flex h-screen flex-col app-simple">
        {config?.owner_id && (
          <div className="bg-primary text-primary-foreground text-center px-4 py-1.5 text-xs font-medium flex-shrink-0">
            View-Only Mode — You are viewing {config.owner_id}&apos;s console
          </div>
        )}
        <div className="sticky top-0 z-20 h-12 border-b border-border bg-background/80 backdrop-blur-md px-4 flex items-center justify-between flex-shrink-0">
          <h1 className="text-sm font-semibold text-foreground truncate">{pageTitle}</h1>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={() => handleViewModeChange('normal')}>
              <PanelLeft className="size-4 mr-1" /> Sidebar
            </Button>
            <Button variant="ghost" size="icon" onClick={() => setShowSettings(true)} title="Settings">
              <UserCog className="size-4" />
            </Button>
          </div>
        </div>
        <div className="flex-1 overflow-auto">
          {renderContent()}
        </div>
        <Toaster position="bottom-right" richColors />
        <Sheet open={showSettings} onOpenChange={setShowSettings}>
          <SheetContent side="right" className="w-full sm:max-w-lg">
            <SheetHeader>
              <SheetTitle>Settings</SheetTitle>
            </SheetHeader>
            <SettingsPanel config={config} viewMode={viewMode} onViewModeChange={handleViewModeChange} onClose={() => setShowSettings(false)} addToast={addToast} />
          </SheetContent>
        </Sheet>
      </div>
    )
  }

  return (
    <TooltipProvider>
      <SidebarProvider defaultOpen={sidebarShown}>
        {/* View-only banner */}
        {config?.owner_id && (
          <div className="bg-primary text-primary-foreground text-center px-4 py-1.5 text-xs font-medium flex-shrink-0 fixed top-0 left-0 right-0 z-50">
            View-Only Mode — You are viewing {config.owner_id}&apos;s console
          </div>
        )}
        {sidebarShown && (
          <Sidebar variant="floating" collapsible="icon">
            <SidebarHeader>
              <div className="flex items-center gap-3 px-2 py-1">
                <div className="size-7 rounded-lg bg-sidebar-primary flex items-center justify-center text-sidebar-primary-foreground text-xs font-semibold">
                  S
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-semibold text-sidebar-foreground leading-tight">Smith</span>
                  <span className="text-[11px] text-sidebar-foreground/60 leading-tight">Console</span>
                </div>
              </div>
            </SidebarHeader>
            <SidebarContent>
              {NAV_GROUPS.map((group) => (
                <SidebarGroup key={group.title}>
                  <SidebarGroupLabel>{group.title}</SidebarGroupLabel>
                  <SidebarGroupContent>
                    <SidebarMenu>
                      {group.items.map((item) => (
                        <SidebarMenuItem key={item.id}>
                          <SidebarMenuButton
                            isActive={activeView === item.id}
                            onClick={() => navigate(item.id)}
                            tooltip={item.label}
                          >
                            {item.icon}
                            <span>{item.label}</span>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                      ))}
                    </SidebarMenu>
                  </SidebarGroupContent>
                </SidebarGroup>
              ))}
            </SidebarContent>
            <SidebarSeparator />
            <SidebarFooter>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton onClick={() => setShowSettings(true)} tooltip="Settings">
                    <UserCog className="size-4" />
                    <span>Settings</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarFooter>
          <SidebarRail />
          </Sidebar>
        )}
        <SidebarInset className={config?.owner_id ? 'pt-7' : ''}>
          {/* Topbar */}
          <div className="sticky top-0 z-20 h-14 border-b border-border bg-background/80 backdrop-blur-md px-4 flex items-center justify-between flex-shrink-0">
            <div className="flex items-center gap-3 min-w-0">
              {sidebarShown && <SidebarTrigger />}
              <h1 className="text-base font-semibold text-foreground truncate">{pageTitle}</h1>
              {activeView === 'chat' && selectedAgent && (
                <span className="text-xs text-muted-foreground hidden sm:inline">
                  {providers.find(p => p.id === selectedAgent.provider_id)?.label || selectedAgent.provider_id}
                  {' · '}{selectedAgent.tool_count} tools
                </span>
              )}
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              {activeView === 'chat' && selectedAgent && (
                <SessionsPanel
                  sessions={sessions}
                  currentSessionId={currentSessionId}
                  onSelectSession={(id) => {
                    setCurrentSessionId(id)
                    setMessages([])
                  }}
                  onNewSession={() => {
                    setCurrentSessionId(null)
                    setMessages([])
                  }}
                  agentId={selectedAgent.id}
                  onSessionsChange={() => loadSessions(selectedAgent.id)}
                />
              )}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowSettings(true)}
                title="Settings"
              >
                <UserCog className="size-4" />
              </Button>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-auto">
            {renderContent()}
          </div>

          <Toaster position="bottom-right" richColors />

          {/* Settings Sheet */}
          <Sheet open={showSettings} onOpenChange={setShowSettings}>
            <SheetContent side="right" className="w-full sm:max-w-lg">
              <SheetHeader>
                <SheetTitle>Settings</SheetTitle>
              </SheetHeader>
              <SettingsPanel
                config={config}
                viewMode={viewMode}
                onViewModeChange={handleViewModeChange}
                onClose={() => setShowSettings(false)}
                addToast={addToast}
              />
            </SheetContent>
          </Sheet>
        </SidebarInset>
      </SidebarProvider>
    </TooltipProvider>
  )
}

export default function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      <AppContent />
    </ThemeProvider>
  )
}
