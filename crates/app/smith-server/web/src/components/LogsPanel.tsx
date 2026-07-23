import { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import * as api from '../api'

interface LogEntry {
  level: string;
  message: string;
  target: string;
  timestamp: string;
}

interface Props {
  addToast: (msg: string, type?: 'error' | 'success' | 'info') => void
}

const LEVEL_COLORS: Record<string, string> = {
  error: 'text-red-500',
  warn: 'text-amber-500',
  info: 'text-sage-teal',
  debug: 'text-slate-400',
  trace: 'text-slate-400',
}

export function LogsPanel({ addToast }: Props) {
  const [logs, setLogs] = useState<LogEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [autoScroll, setAutoScroll] = useState(true)
  const [filter, setFilter] = useState<string>('all')
  const containerRef = useRef<HTMLDivElement>(null)
  const pollingRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const load = async () => {
    try { setLogs(await api.streamLogs() as LogEntry[]) }
    catch (e: any) { addToast(e.message) }
    finally { setLoading(false) }
  }

  useEffect(() => { load() }, [])

  useEffect(() => {
    pollingRef.current = setInterval(async () => {
      try { setLogs(await api.streamLogs() as LogEntry[]) }
      catch { /* silent */ }
    }, 3000)
    return () => { if (pollingRef.current) clearInterval(pollingRef.current) }
  }, [])

  useEffect(() => {
    if (autoScroll && containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight
    }
  }, [logs, autoScroll])

  const filteredLogs = filter === 'all' ? logs : logs.filter(l => l.level === filter)

  if (loading) {
    return <div className="flex items-center justify-center h-40"><div className="text-body-sm text-slate animate-pulse-soft">Loading logs…</div></div>
  }

  return (
    <div className="flex flex-col h-full">
      {/* Controls */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-1.5">
          {['all', 'error', 'warn', 'info', 'debug', 'trace'].map(l => (
            <Button key={l}
              variant={filter === l ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setFilter(l)}
            >
              {l.toUpperCase()}
            </Button>
          ))}
        </div>
        <label className="flex items-center gap-1.5 text-xs text-muted-foreground cursor-pointer select-none">
          <Checkbox checked={autoScroll} onCheckedChange={(v) => v !== null && setAutoScroll(v)} />
          Auto-scroll
        </label>
      </div>

      {/* Log viewport */}
      <div ref={containerRef} className="flex-1 overflow-y-auto bg-[#1a1a1a] rounded-xl p-4 font-mono text-caption leading-relaxed min-h-[300px]">
        {filteredLogs.length === 0 ? (
          <div className="text-slate-500 text-center py-10">No log entries.</div>
        ) : (
          filteredLogs.map((log, i) => (
            <div key={i} className="py-0.5 flex gap-3 hover:bg-white/5 rounded px-1 transition-colors">
              <span className="text-slate-500 shrink-0 w-16">{log.timestamp?.split('T')[1]?.split('.')[0] || '--:--:--'}</span>
              <span className={`shrink-0 w-12 ${LEVEL_COLORS[log.level] || 'text-slate-400'}`}>{log.level.toUpperCase()}</span>
              <span className="text-slate-500 shrink-0 mr-1">[{log.target}]</span>
              <span className="text-gray-300 break-words">{log.message}</span>
            </div>
          ))
        )}
      </div>

      <div className="text-caption text-slate mt-2">
        {logs.length} entries · Polling every 3s
      </div>
    </div>
  )
}
