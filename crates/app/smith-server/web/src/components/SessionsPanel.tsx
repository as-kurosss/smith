import { useState, useEffect, useRef } from 'react'
import * as api from '../api'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import type { SessionSummary } from '../types'

interface Props {
  sessions: SessionSummary[]
  currentSessionId: string | null
  onSelectSession: (sessionId: string) => void
  onNewSession: () => void
  agentId: string
  onSessionsChange: () => void
  addToast?: (msg: string, type?: 'error' | 'success') => void
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

export function SessionsPanel({
  sessions, currentSessionId, onSelectSession, onNewSession, agentId, onSessionsChange, addToast,
}: Props) {
  const [open, setOpen] = useState(false)
  const [filter, setFilter] = useState('')
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number; session: SessionSummary } | null>(null)
  const [renaming, setRenaming] = useState<string | null>(null)
  const [renameValue, setRenameValue] = useState('')
  const ref = useRef<HTMLDivElement>(null)
  const renameRef = useRef<HTMLInputElement>(null)

  // Close on click outside
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
        setContextMenu(null)
      }
    }
    if (open) document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [open])

  useEffect(() => {
    if (renaming && renameRef.current) renameRef.current.focus()
  }, [renaming])

  const filteredSessions = filter
    ? sessions.filter(s => (s.title || '').toLowerCase().includes(filter.toLowerCase()))
    : sessions

  // Group by date
  const grouped = filteredSessions.reduce<Record<string, SessionSummary[]>>((acc, s) => {
    const group = getDateGroup(s.updated_at)
    if (!acc[group]) acc[group] = []
    acc[group].push(s)
    return acc
  }, {})
  const groupOrder = ['Today', 'Yesterday', 'This Week', 'This Month', 'Older']

  const handleContextMenu = (e: React.MouseEvent, s: SessionSummary) => {
    e.preventDefault()
    setContextMenu({ x: e.clientX, y: e.clientY, session: s })
  }

  const renameSession = async (id: string, title: string) => {
    try {
      await api.updateSessionTitle(id, title)
      onSessionsChange()
      addToast?.('Session renamed', 'success')
    } catch { /* ignore */ }
    setRenaming(null)
  }

  const deleteSession = async (id: string) => {
    if (!confirm('Delete this session?')) return
    try {
      await api.deleteSession(id)
      onSessionsChange()
      addToast?.('Session deleted', 'success')
    } catch { /* ignore */ }
    setContextMenu(null)
  }

  return (
    <div ref={ref} className="relative">
      <Button variant="outline" size="sm" className="text-xs" onClick={() => setOpen(!open)}>
        {open ? '▲' : '▼'} Sessions {sessions.length > 0 && `(${sessions.length})`}
      </Button>
      <Button variant="outline" size="sm" className="text-xs ml-1" onClick={onNewSession}>
        + New
      </Button>

      {open && (
        <div className="absolute top-full right-0 mt-1 w-[300px] max-h-[360px] overflow-y-auto bg-white border border-sage-cloud rounded-lg shadow-md z-50 flex flex-col animate-scale-in origin-top-right">
          {/* Search filter */}
          <div className="px-3 py-2 border-b border-sage-cloud">
            <Input value={filter} onChange={e => setFilter(e.target.value)}
              placeholder="Filter by title..."
              className="h-auto py-1 px-2 text-xs" />
          </div>

          <div className="flex-1 overflow-y-auto">
            {filteredSessions.length === 0 ? (
              <div className="px-4 py-4 text-caption text-slate text-center">
                {filter ? 'No matching sessions' : 'No sessions yet'}
              </div>
            ) : (
              groupOrder.map(group => {
                const items = grouped[group]
                if (!items?.length) return null
                return (
                  <div key={group}>
                    <div className="px-3 py-2 text-caption font-semibold text-slate uppercase tracking-wide bg-sage-veil">{group}</div>
                    {items.map(s => (
                      <div key={s.id}
                        onClick={() => { onSelectSession(s.id); setOpen(false) }}
                        onContextMenu={e => handleContextMenu(e, s)}
                        className={`px-3 py-2 cursor-pointer text-caption border-b border-sage-cloud transition-all duration-150 ${
                          s.id === currentSessionId ? 'bg-sage-veil' : 'hover:bg-sage-veil'
                        }`}
                      >
                        {renaming === s.id ? (
                          <input ref={renameRef} value={renameValue}
                            onChange={e => setRenameValue(e.target.value)}
                            onKeyDown={e => {
                              if (e.key === 'Enter') renameSession(s.id, renameValue)
                              if (e.key === 'Escape') setRenaming(null)
                            }}
                            onBlur={() => setRenaming(null)}
                            style={{ width: '100%', fontSize: 12, padding: '2px 4px' }}
                            onClick={e => e.stopPropagation()}
                          />
                        ) : (
                          <div style={{ fontWeight: 500, marginBottom: 2 }}>
                            {s.title || `Session ${s.id.slice(0, 8)}`}
                          </div>
                        )}
                        <div style={{ color: 'var(--text2)', fontSize: 11 }}>
                          {s.message_count} messages
                        </div>
                        {s.preview.length > 0 && (
                          <div style={{ color: 'var(--text2)', fontSize: 10, marginTop: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {s.preview[0]}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )
              })
            )}
          </div>
        </div>
      )}

      {/* Right-click context menu */}
      {contextMenu && (
        <div className="fixed bg-white border border-sage-cloud rounded-lg shadow-md z-[100] min-w-[140px] overflow-hidden"
          style={{ left: contextMenu.x, top: contextMenu.y }}>
          <div className="px-3 py-2 cursor-pointer text-caption border-b border-sage-cloud transition hover:bg-sage-veil"
            onClick={() => {
              setRenaming(contextMenu.session.id)
              setRenameValue(contextMenu.session.title || `Session ${contextMenu.session.id.slice(0, 8)}`)
              setContextMenu(null)
            }}>✎ Rename</div>
          <div className="px-3 py-2 cursor-pointer text-caption border-b border-sage-cloud hover:bg-sage-veil"
            onClick={() => {
              addToast?.('Session pinned', 'success')
              setContextMenu(null)
            }}>📌 Pin</div>
          <div className="px-3 py-2 cursor-pointer text-caption text-red hover:bg-sage-veil"
            onClick={() => deleteSession(contextMenu.session.id)}>✕ Delete</div>
        </div>
      )}
    </div>
  )
}
