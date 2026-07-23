import { useState, useEffect, useCallback } from 'react'
import * as api from '../api'
import type { SessionSummary } from '../types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

interface Props {
  addToast: (msg: string, type?: 'error' | 'success' | 'info') => void
}

function getDateGroup(dateStr: string): string {
  const d = new Date(dateStr)
  const now = new Date()
  const diffDays = Math.floor((now.getTime() - d.getTime()) / 86400000)
  if (diffDays === 0) return 'Today'
  if (diffDays === 1) return 'Yesterday'
  if (diffDays < 7) return 'This Week'
  if (diffDays < 30) return 'This Month'
  return 'Older'
}

export function SessionsOverviewPage({ addToast }: Props) {
  const [sessions, setSessions] = useState<SessionSummary[]>([])
  const [agents, setAgents] = useState<{ id: string; name: string }[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('')
  const [selectedAgentFilter, setSelectedAgentFilter] = useState('all')
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [deleting, setDeleting] = useState(false)

  const load = useCallback(async () => {
    try {
      const agentList = await api.listAgents()
      setAgents(agentList)
      const allSessions: SessionSummary[] = []
      for (const agent of agentList) {
        try {
          const s = await api.listSessions(agent.id)
          allSessions.push(...s)
        } catch { /* skip agents that fail */ }
      }
      setSessions(allSessions.sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()))
    } catch (e: any) { addToast(e.message) }
    finally { setLoading(false) }
  }, [addToast])

  useEffect(() => { load() }, [load])

  const agentName = (agentId: string) => agents.find(a => a.id === agentId)?.name || agentId

  const filtered = sessions.filter(s => {
    if (selectedAgentFilter !== 'all' && s.agent_id !== selectedAgentFilter) return false
    if (filter) {
      const q = filter.toLowerCase()
      return (s.title || '').toLowerCase().includes(q) || s.id.toLowerCase().includes(q)
    }
    return true
  })

  const toggleSelect = (id: string) => {
    setSelected(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id); else next.add(id)
      return next
    })
  }

  const batchDelete = async () => {
    if (selected.size === 0) return
    if (!confirm(`Delete ${selected.size} session(s)?`)) return
    setDeleting(true)
    let count = 0
    for (const id of selected) {
      try { await api.deleteSession(id); count++ }
      catch { /* skip failures */ }
    }
    addToast(`Deleted ${count} session(s)`, 'success')
    setSelected(new Set())
    setDeleting(false)
    load()
  }

  const grouped = filtered.reduce<Record<string, SessionSummary[]>>((acc, s) => {
    const group = getDateGroup(s.updated_at)
    if (!acc[group]) acc[group] = []
    acc[group].push(s)
    return acc
  }, {})
  const groupOrder = ['Today', 'Yesterday', 'This Week', 'This Month', 'Older']

  if (loading) {
    return <div className="flex items-center justify-center h-40">
      <div className="text-body-sm text-slate animate-pulse-soft">Loading sessions…</div>
    </div>
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-3 mb-6">
        <div className="flex-1 min-w-[200px]">
          <Input
            value={filter}
            onChange={e => setFilter(e.target.value)}
            placeholder="Search by title or ID…"
            className="h-auto py-2.5"
          />
        </div>
        <select
          value={selectedAgentFilter}
          onChange={e => setSelectedAgentFilter(e.target.value)}
          className="h-auto py-2.5 rounded-lg border border-input bg-transparent px-3 text-body-sm text-foreground outline-none focus:border-ring"
        >
          <option value="all">All Agents</option>
          {agents.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
        </select>
        {selected.size > 0 && (
          <Button size="sm" variant="outline" className="text-red-600 border-red-200" onClick={batchDelete} disabled={deleting}>
            {deleting ? '…' : `✕ Delete (${selected.size})`}
          </Button>
        )}
        <Button size="sm" variant="outline" onClick={load}>
          ↻ Refresh
        </Button>
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-16">
          <div className="w-14 h-14 bg-white rounded-xl shadow-sm flex items-center justify-center text-2xl mx-auto mb-4">📋</div>
          <h3 className="text-subheading font-semibold text-graphite mb-2">No Sessions</h3>
          <p className="text-body-sm text-slate">Start a conversation in Chat to create sessions.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {groupOrder.map(group => {
            const items = grouped[group]
            if (!items?.length) return null
            return (
              <div key={group}>
                <h3 className="text-caption font-semibold text-ash uppercase tracking-wider mb-3 px-1">{group}</h3>
                {items.map(s => (
                  <div key={s.id}
                    className={`bg-white rounded-xl border px-5 py-4 mb-3 transition-all duration-150 card-shadow hover:card-shadow ${
                      selected.has(s.id) ? 'border-sage-teal ring-1 ring-sage-teal' : 'border-sage-cloud'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={selected.has(s.id)}
                        onChange={() => toggleSelect(s.id)}
                        className="w-4 h-4 rounded border-sage-cloud text-sage-teal focus:ring-sage-teal shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-body-sm font-semibold text-graphite truncate">
                            {s.title || `Session ${s.id.slice(0, 8)}`}
                          </span>
                          <span className="text-caption text-slate shrink-0">{agentName(s.agent_id)}</span>
                        </div>
                        <div className="flex items-center gap-3 mt-1">
                          <span className="text-caption text-fog">{s.message_count} messages</span>
                          <span className="text-caption text-fog">{new Date(s.updated_at).toLocaleString()}</span>
                        </div>
                        {s.preview.length > 0 && (
                          <p className="text-caption text-slate mt-1 truncate">{s.preview[0]}</p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
