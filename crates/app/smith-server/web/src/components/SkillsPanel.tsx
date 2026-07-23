import { useState, useEffect } from 'react'
import * as api from '../api'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'

interface SkillDefinition {
  id: string;
  name: string;
  enabled: boolean;
  description: string;
  version?: string;
  source_url?: string;
}

interface Props {
  addToast: (msg: string, type?: 'error' | 'success') => void
}

export function SkillsPanel({ addToast }: Props) {
  const [skills, setSkills] = useState<SkillDefinition[]>([])
  const [loading, setLoading] = useState(true)
  const [importUrl, setImportUrl] = useState('')
  const [showImport, setShowImport] = useState(false)

  const load = async () => {
    setLoading(true)
    try { setSkills(await api.listSkills() as SkillDefinition[]) }
    catch (e: any) { addToast(e.message) }
    finally { setLoading(false) }
  }

  useEffect(() => { load() }, [])

  const toggle = async (id: string, enabled: boolean) => {
    try {
      await fetch(`/api/skills/${id}/toggle`, { method: 'POST', body: JSON.stringify({ enabled }) })
      await load()
      addToast('Skill updated', 'success')
    } catch (e: any) { addToast(e.message) }
  }

  const remove = async (id: string) => {
    if (!confirm('Delete this skill?')) return
    try {
      await fetch(`/api/skills/${id}`, { method: 'DELETE' })
      await load()
      addToast('Skill deleted', 'success')
    } catch (e: any) { addToast(e.message) }
  }

  const doImport = async () => {
    if (!importUrl.trim()) return
    try {
      await fetch('/api/skills/import', { method: 'POST', body: JSON.stringify({ url: importUrl.trim() }) })
      setImportUrl('')
      setShowImport(false)
      await load()
      addToast('Skill imported', 'success')
    } catch (e: any) { addToast(e.message) }
  }

  if (loading) {
    return <div className="flex items-center justify-center h-40"><div className="text-body-sm text-slate animate-pulse-soft">Loading skills…</div></div>
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <p className="text-body-sm text-slate">Skills extend smith-agent capabilities — document processing, web search, custom workflows, and more.</p>
        <Button onClick={() => setShowImport(true)}>+ Import Skill</Button>
      </div>

      {skills.length === 0 ? (
        <div className="text-center py-16">
          <div className="w-14 h-14 bg-white rounded-xl shadow-sm flex items-center justify-center text-2xl mx-auto mb-4">⚡</div>
          <h3 className="text-subheading font-semibold text-graphite mb-2">No Skills</h3>
          <p className="text-body-sm text-slate mb-4">Import a skill to extend agent capabilities.</p>
          <Button variant="outline" onClick={() => setShowImport(true)}>Import Skill</Button>
        </div>
      ) : (
        <div className="space-y-4">
          {skills.map((s, i) => (
            <div key={s.id} className="bg-white rounded-xl border border-sage-cloud p-5 card-shadow animate-fade-in-up" style={{ animationDelay: `${i * 50}ms` }}>
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-body-sm font-semibold text-graphite">{s.name}</h3>
                    {s.version && <span className="text-caption text-fog">v{s.version}</span>}
                  </div>
                  <p className="text-caption text-slate mb-2">{s.description}</p>
                  {s.source_url && <div className="text-caption text-fog truncate">{s.source_url}</div>}
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <Switch checked={s.enabled} onCheckedChange={(v) => toggle(s.id, v)} />
                  <Button variant="ghost" size="icon-sm" className="text-red-500 hover:text-red-600" onClick={() => remove(s.id)}>✕</Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <Dialog open={showImport} onOpenChange={setShowImport}>
        <DialogContent className="sm:max-w-[480px] p-6">
          <DialogTitle className="text-subheading font-semibold text-graphite mb-4">Import Skill</DialogTitle>
          <div className="mb-4">
            <label className="block text-caption text-slate mb-1 font-medium">Skill URL</label>
            <Input value={importUrl} onChange={e => setImportUrl(e.target.value)}
              placeholder="https://github.com/owner/repo" className="h-auto py-2.5"
              onKeyDown={e => e.key === 'Enter' && doImport()} />
            <p className="text-caption text-slate mt-1">GitHub repository URL or OpenAPI spec URL.</p>
          </div>
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setShowImport(false)}>Cancel</Button>
            <Button onClick={doImport} disabled={!importUrl.trim()}>Import</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
