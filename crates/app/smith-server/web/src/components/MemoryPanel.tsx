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
      <div className="bg-white rounded-xl border border-sage-cloud p-5 card-shadow mb-6">
        <h3 className="text-body-sm font-semibold text-graphite mb-4">Episodic Memory</h3>
        {loadingStats ? (
          <div className="text-caption text-slate animate-pulse-soft">Loading…</div>
        ) : stats ? (
          <div className="flex items-center gap-8">
            <div>
              <span className="text-caption text-slate block">Status</span>
              <span className={`text-body-sm font-semibold ${stats.has_episodic_memory ? 'text-green-600' : 'text-slate'}`}>
                {stats.has_episodic_memory ? 'Active' : 'Disabled'}
              </span>
            </div>
            <div>
              <span className="text-caption text-slate block">Stored Turns</span>
              <span className="text-body-sm font-semibold text-graphite">{stats.total_entries}</span>
            </div>
          </div>
        ) : null}
      </div>

      {!loadingStats && stats && !stats.has_episodic_memory && (
        <div className="text-center py-8 mb-4">
          <p className="text-body-sm text-slate">Episodic memory is disabled. Enable it in Settings to record and search past agent turns.</p>
        </div>
      )}

      {/* Search */}
      <div className="mb-6">
        <h3 className="text-body-sm font-semibold text-graphite mb-3">Search Memory</h3>
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
          <p className="text-body-sm text-slate">No memories found.</p>
        </div>
      )}

      <div className="space-y-3">
        {results.map(r => (
          <div key={r.turn_id} className="bg-white rounded-xl border border-sage-cloud p-5 card-shadow animate-fade-in-up">
            <div className="mb-2">
              <span className="text-caption font-semibold text-sage-teal">Input</span>
              <p className="text-body-sm text-graphite mt-1">{r.input}</p>
            </div>
            {r.output && (
              <div className="mb-2">
                <span className="text-caption font-semibold text-sage-teal">Output</span>
                <p className="text-body-sm text-graphite mt-1">{r.output}</p>
              </div>
            )}
            <div className="text-caption text-fog mt-2">{r.turn_id} · {r.timestamp}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
