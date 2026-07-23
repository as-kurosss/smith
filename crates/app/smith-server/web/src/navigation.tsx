import type { ReactNode } from 'react'
import {
  MessageSquare, Inbox, Bot, Plug, LayoutList, Clock,
  Brain, Zap, Link, FolderOpen, BarChart3,
  FileText, Shield, UserCog,
} from 'lucide-react'

export type View = 'chat' | 'inbox' | 'agents' | 'providers' | 'sessions_overview' | 'cronjobs' | 'memory' | 'tools-skills' | 'mcp' | 'files' | 'observe' | 'logs' | 'security' | 'settings'

interface NavItem { id: View; label: string; icon: ReactNode }
interface NavGroup { title: string; items: NavItem[] }

const ICONS: Record<string, ReactNode> = {
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
  chat: 'Chat', inbox: 'Inbox', agents: 'Agents', providers: 'Providers',
  sessions_overview: 'Sessions', cronjobs: 'Cron Jobs', memory: 'Memory',
  'tools-skills': 'Tools & Skills', mcp: 'MCP', files: 'Files',
  observe: 'Observe', logs: 'Logs', security: 'Security', settings: 'Settings',
}

export type { NavItem, NavGroup }
export { ICONS, NAV_GROUPS, VIEW_TITLES }
