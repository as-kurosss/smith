import { useState, useEffect, useCallback } from 'react'
import { ChevronsUpDown, PanelLeft, UserCog, MessageSquare } from 'lucide-react'
import { Toaster } from './components/ui/sonner'
import { Button } from './components/ui/button'
import { Separator } from './components/ui/separator'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from './components/ui/sheet'
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from './components/ui/breadcrumb'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './components/ui/dropdown-menu'
import { SidebarProvider, Sidebar, SidebarContent, SidebarGroup, SidebarGroupLabel, SidebarGroupContent, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarHeader, SidebarFooter, SidebarSeparator, SidebarTrigger, SidebarInset, SidebarRail } from './components/ui/sidebar'
import { TooltipProvider } from './components/ui/tooltip'
import { ICONS, NAV_GROUPS, VIEW_TITLES } from './navigation'
import type { View } from './navigation'
import { useAgents } from './hooks/useAgents'
import { useChat } from './hooks/useChat'
import { useSessions } from './hooks/useSessions'
import { useConfig } from './hooks/useConfig'
import { AgentsView } from './views/AgentsView'
import { ProvidersView } from './views/ProvidersView'
import { ToolsSkillsView } from './views/ToolsSkillsView'
import { McpView } from './views/McpView'
import { MemoryView } from './views/MemoryView'
import { SecurityView } from './views/SecurityView'
import { ObserveView } from './views/ObserveView'
import { LogsView } from './views/LogsView'
import { ChatArea } from './components/ChatArea'
import { InboxPage } from './components/InboxPage'
import { SessionsOverviewPage } from './components/SessionsOverviewPage'
import { CronJobsPage } from './components/CronJobsPage'
import { FilesPage } from './components/FilesPage'
import { SettingsPanel } from './components/SettingsPanel'
import { SessionsPanel } from './components/SessionsPanel'
import type { AgentSummary } from './types'

import './app.css'

function AppContent() {
  const [activeView, setActiveView] = useState<View>('chat')
  const agents = useAgents()
  const chat = useChat()
  const sessions = useSessions()
  const config = useConfig()
  const { addToast } = config

  useEffect(() => { agents.loadAgents(); agents.loadProviders(); config.loadConfig() }, [])

  const selectAgent = useCallback((agent: AgentSummary) => {
    agents.setSelectedAgent(agent)
    sessions.setCurrentSessionId(null)
    chat.setMessages([])
    agents.setTools([])
    sessions.loadSessions(agent.id)
    agents.loadTools(agent)
    setActiveView('chat')
  }, [agents, sessions, chat])

  const navigate = useCallback((view: View) => {
    if (view === 'settings') config.setShowSettings(true)
    else setActiveView(view)
  }, [config])

  const pageTitle = VIEW_TITLES[activeView]
  const sidebarShown = config.viewMode === 'normal'

  const renderContent = () => {
    switch (activeView) {
      case 'chat':
        if (agents.selectedAgent) {
          return (
            <ChatArea
              key={agents.selectedAgent.id}
              agentId={agents.selectedAgent.id}
              sessionId={sessions.currentSessionId}
              messages={chat.messages}
              onMessagesChange={chat.setMessages}
              onSessionChange={(sid) => {
                sessions.setCurrentSessionId(sid)
                if (agents.selectedAgent) sessions.loadSessions(agents.selectedAgent.id)
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
      case 'inbox': return <div className="p-6"><InboxPage addToast={addToast} /></div>
      case 'agents': return <AgentsView agents={agents.agents} providers={agents.providers} selectedAgent={agents.selectedAgent} onSelect={selectAgent} onRefresh={agents.loadAgents} addToast={addToast} />
      case 'providers': return <ProvidersView providers={agents.providers} onRefresh={agents.loadProviders} addToast={addToast} />
      case 'sessions_overview': return <div className="p-6"><SessionsOverviewPage addToast={addToast} /></div>
      case 'cronjobs': return <div className="p-6"><CronJobsPage addToast={addToast} /></div>
      case 'memory': return <MemoryView addToast={addToast} />
      case 'tools-skills': return <ToolsSkillsView tools={agents.tools} onToolsChange={agents.setTools} addToast={addToast} />
      case 'mcp': return <McpView addToast={addToast} />
      case 'files': return <div className="p-6"><FilesPage addToast={addToast} /></div>
      case 'observe': return <ObserveView addToast={addToast} />
      case 'logs': return <LogsView addToast={addToast} />
      case 'security': return <SecurityView addToast={addToast} />
      case 'settings': return null
      default: return null
    }
  }

  if (config.viewMode === 'simple') {
    return (
      <div className="flex h-screen flex-col app-simple">
        <div className="sticky top-0 z-20 h-12 border-b border-border bg-background/80 backdrop-blur-md px-4 flex items-center justify-between flex-shrink-0">
          <h1 className="text-sm font-semibold text-foreground truncate">{pageTitle}</h1>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={() => config.setViewMode('normal')}>
              <PanelLeft className="size-4 mr-1" /> Sidebar
            </Button>
            <Button variant="ghost" size="icon" onClick={() => config.setShowSettings(true)} title="Settings">
              <UserCog className="size-4" />
            </Button>
          </div>
        </div>
        <div className="flex-1 overflow-auto">{renderContent()}</div>
        <Toaster position="bottom-right" richColors />
        <Sheet open={config.showSettings} onOpenChange={config.setShowSettings}>
          <SheetContent side="right" className="w-full sm:max-w-lg">
            <SheetHeader><SheetTitle>Settings</SheetTitle></SheetHeader>
            <SettingsPanel config={config.config} viewMode={config.viewMode} onViewModeChange={config.setViewMode} onClose={() => config.setShowSettings(false)} addToast={addToast} />
          </SheetContent>
        </Sheet>
      </div>
    )
  }

  return (
    <TooltipProvider>
      <SidebarProvider defaultOpen={sidebarShown}>
        {sidebarShown && (
          <Sidebar variant="floating" collapsible="icon">
            <SidebarHeader>
              <SidebarMenu>
                <SidebarMenuItem>
                  <DropdownMenu>
                    <DropdownMenuTrigger className="w-full">
                      <SidebarMenuButton>
                        Smith Console
                        <ChevronsUpDown className="ml-auto" />
                      </SidebarMenuButton>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-(--anchor-width)">
                      <DropdownMenuItem>Default Workspace</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarHeader>
            <SidebarContent>
              {NAV_GROUPS.map((group) => (
                <SidebarGroup key={group.title}>
                  <SidebarGroupLabel>{group.title}</SidebarGroupLabel>
                  <SidebarGroupContent>
                    <SidebarMenu>
                      {group.items.map((item) => (
                        <SidebarMenuItem key={item.id}>
                          <SidebarMenuButton isActive={activeView === item.id} onClick={() => navigate(item.id)} tooltip={item.label}>
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
                  <SidebarMenuButton onClick={() => config.setShowSettings(true)} tooltip="Settings">
                    <UserCog className="size-4" />
                    <span>Settings</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarFooter>
            <SidebarRail />
          </Sidebar>
        )}
        <SidebarInset>
          <div className="sticky top-0 z-20 h-14 border-b border-border bg-background/80 backdrop-blur-md px-4 flex items-center justify-between flex-shrink-0">
            <div className="flex items-center gap-3 min-w-0">
              <SidebarTrigger />
              <Separator orientation="vertical" className="h-4 mr-2" />
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem>
                    <BreadcrumbLink href="#" onClick={() => setActiveView('agents')}>Smith</BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbPage>{pageTitle}</BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
              {activeView === 'chat' && agents.selectedAgent && (
                <span className="text-xs text-muted-foreground hidden sm:inline ml-2">
                  {agents.providers.find(p => p.id === agents.selectedAgent!.provider_id)?.label || agents.selectedAgent!.provider_id}
                  {' '}{agents.selectedAgent!.tool_count} tools
                </span>
              )}
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              {activeView === 'chat' && agents.selectedAgent && (
                <SessionsPanel
                  sessions={sessions.sessions}
                  currentSessionId={sessions.currentSessionId}
                  onSelectSession={(id) => { sessions.setCurrentSessionId(id); chat.setMessages([]) }}
                  onNewSession={() => { sessions.setCurrentSessionId(null); chat.setMessages([]) }}
                  agentId={agents.selectedAgent.id}
                  onSessionsChange={() => sessions.loadSessions(agents.selectedAgent!.id)}
                />
              )}
            </div>
          </div>
          <div className="flex-1 overflow-auto">{renderContent()}</div>
          <Toaster position="bottom-right" richColors />
          <Sheet open={config.showSettings} onOpenChange={config.setShowSettings}>
            <SheetContent side="right" className="w-full sm:max-w-lg">
              <SheetHeader><SheetTitle>Settings</SheetTitle></SheetHeader>
              <SettingsPanel config={config.config} viewMode={config.viewMode} onViewModeChange={config.setViewMode} onClose={() => config.setShowSettings(false)} addToast={addToast} />
            </SheetContent>
          </Sheet>
        </SidebarInset>
      </SidebarProvider>
    </TooltipProvider>
  )
}

export default function App() {
  return <AppContent />
}
