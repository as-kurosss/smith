import { useState, useEffect } from 'react'
import * as api from '../api'
import type { MemorySearchResult, MemoryStats } from '../types'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

interface Props {
  addToast: (msg: string, type?: 'error' | 'success') => void
}

export function MemoryPanel({ addToast }: Props) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<MemorySearchResult[]>([])
  const [searched, setSearched] = useState(false)
  const [searching, setSearching] = useState(false)
  const [stats, setStats] = useState<MemoryStats | null>(null)
  const [loadingStats, setLoadingStats] = useState(true)

  useEffect(() => {
    api.getMemoryStats().then(setStats).catch(() => {}).finally(() => setLoadingStats(false))
  }, [])

  const doSearch = async () => {
    if (!query.trim()) return
    setSearching(true)
    setSearched(true)
    try {
      setResults(await api.searchMemoryEpisodic(query.trim()))
    } catch (e: any) { addToast(e.message) }
    finally { setSearching(false) }
  }

  return (
    <div className="max-w-3xl mx-auto">
      {/* Memory Stats Card */}
      <div className="bg-card rounded-xl border border-border p-5 shadow-sm mb-6">
        <h3 className="text-sm font-semibold text-foreground mb-4">Episodic Memory</h3>
        {loadingStats ? (
          <div className="text-xs text-muted-foreground animate-pulse">Loading…</div>
        ) : stats ? (
          <div className="flex items-center gap-8">
            <div>
              <span className="text-xs text-muted-foreground block">Status</span>
              <span className={`text-sm font-semibold ${stats.has_episodic_memory ? 'text-green-600' : 'text-muted-foreground'}`}>
                {stats.has_episodic_memory ? 'Active' : 'Disabled'}
              </span>
            </div>
            <div>
              <span className="text-xs text-muted-foreground block">Stored Turns</span>
              <span className="text-sm font-semibold text-foreground">{stats.total_entries}</span>
            </div>
          </div>
        ) : null}
      </div>

      {!loadingStats && stats && !stats.has_episodic_memory && (
        <div className="text-center py-8 mb-4">
          <p className="text-sm text-muted-foreground">Episodic memory is disabled. Enable it in Settings to record and search past agent turns.</p>
        </div>
      )}

      {/* Search */}
      <div className="mb-6">
        <h3 className="text-sm font-semibold text-foreground mb-3">Search Memory</h3>
        <div className="flex gap-2">
          <div className="flex-1">
            <Input value={query} onChange={e => setQuery(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && doSearch()}
              placeholder="Search episodic memory…" className="h-auto py-2.5" />
          </div>
          <Button onClick={doSearch} disabled={!query.trim() || searching} className="shrink-0">
            {searching ? '…' : 'Search'}
          </Button>
        </div>
      </div>

      {searched && results.length === 0 && (
        <div className="text-center py-8">
          <p className="text-sm text-muted-foreground">No memories found.</p>
        </div>
      )}

      <div className="space-y-3">
        {results.map(r => (
          <div key={r.turn_id} className="bg-card rounded-xl border border-border p-5 shadow-sm animate-in fade-in slide-in-from-bottom-2">
            <div className="mb-2">
              <span className="text-xs font-semibold text-primary">Input</span>
              <p className="text-sm text-foreground mt-1">{r.input}</p>
            </div>
            {r.output && (
              <div className="mb-2">
                <span className="text-xs font-semibold text-primary">Output</span>
                <p className="text-sm text-foreground mt-1">{r.output}</p>
              </div>
            )}
            <div className="text-xs text-muted-foreground mt-2">{r.turn_id} · {r.timestamp}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
