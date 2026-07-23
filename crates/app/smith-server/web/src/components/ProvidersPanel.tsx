import { useState } from 'react'
import * as api from '../api'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select'
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'
import type { ProviderConfig, ProviderKind } from '../types'

interface Props {
  providers: ProviderConfig[]
  onRefresh: () => void
  addToast: (msg: string, type?: 'error' | 'success') => void
}

const PROVIDER_KINDS: { value: ProviderKind; label: string; defaultUrl: string }[] = [
  { value: 'openai', label: 'OpenAI', defaultUrl: 'https://api.openai.com/v1' },
  { value: 'anthropic', label: 'Anthropic', defaultUrl: 'https://api.anthropic.com/v1' },
  { value: 'gemini', label: 'Gemini', defaultUrl: 'https://generativelanguage.googleapis.com/v1beta' },
  { value: 'ollama', label: 'Ollama', defaultUrl: 'http://localhost:11434/v1' },
  { value: 'custom', label: 'Custom (OpenAI-compatible)', defaultUrl: 'https://' },
  { value: 'lm_studio', label: 'LM Studio', defaultUrl: 'http://localhost:1234/v1' },
]

const DEFAULT_MODELS: Record<ProviderKind, string> = {
  openai: 'gpt-4o',
  anthropic: 'claude-3-5-sonnet-20241022',
  gemini: 'gemini-2.0-flash',
  ollama: 'llama3.2',
  custom: 'gpt-4o-mini',
  lm_studio: 'local-model',
}

export function ProvidersPanel({ providers, onRefresh, addToast }: Props) {
  const [editing, setEditing] = useState<ProviderConfig | null>(null)
  const [showForm, setShowForm] = useState(false)

  const [kind, setKind] = useState<ProviderKind>('openai')
  const [label, setLabel] = useState('')
  const [model, setModel] = useState('')
  const [apiKey, setApiKey] = useState('')
  const [apiUrl, setApiUrl] = useState('')

  const openCreate = () => {
    setEditing(null)
    setKind('openai')
    setLabel('')
    setModel('gpt-4o')
    setApiKey('')
    setApiUrl('https://api.openai.com/v1')
    setShowForm(true)
  }

  const openEdit = (p: ProviderConfig) => {
    setEditing(p)
    setKind(p.kind)
    setLabel(p.label)
    setModel(p.model)
    setApiKey(p.api_key)
    setApiUrl(p.api_url || '')
    setShowForm(true)
  }

  const handleKindChange = (k: ProviderKind) => {
    setKind(k)
    setModel(DEFAULT_MODELS[k])
    setApiUrl(PROVIDER_KINDS.find(x => x.value === k)?.defaultUrl || '')
  }

  const save = async () => {
    const body = { kind, label, model, api_key: apiKey, api_url: apiUrl || null }
    try {
      if (editing) {
        await api.updateProvider(editing.id, body)
      } else {
        await api.createProvider(body)
      }
      setShowForm(false)
      onRefresh()
      addToast('Provider saved', 'success')
    } catch (e: any) {
      addToast(e.message)
    }
  }

  const remove = async (id: string) => {
    if (!confirm('Delete this provider?')) return
    try {
      await api.deleteProvider(id)
      onRefresh()
      addToast('Provider deleted', 'success')
    } catch (e: any) {
      addToast(e.message)
    }
  }

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-body-sm text-slate">Configure API providers for agent backends. Supported: OpenAI, Anthropic, Gemini, Ollama, and OpenAI-compatible servers.</p>
        </div>
        <Button onClick={openCreate} className="shrink-0">+ New Provider</Button>
      </div>

      {providers.length === 0 ? (
        <div className="text-center py-16">
          <div className="w-14 h-14 bg-white rounded-xl shadow-sm flex items-center justify-center text-2xl mx-auto mb-4">🔌</div>
          <h3 className="text-subheading font-semibold text-graphite mb-2">No Providers</h3>
          <p className="text-body-sm text-slate mb-4">Add a provider to connect agents to LLM APIs.</p>
          <Button variant="outline" onClick={openCreate}>+ New Provider</Button>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4">
          {providers.map((p, idx) => {
            const kindColors: Record<string, string> = {
              openai: 'bg-emerald-500',
              anthropic: 'bg-amber-500',
              gemini: 'bg-blue-500',
              ollama: 'bg-purple-500',
              custom: 'bg-slate-500',
              lm_studio: 'bg-rose-500',
            }
            const kindLabels: Record<string, string> = {
              openai: 'OpenAI',
              anthropic: 'Anthropic',
              gemini: 'Gemini',
              ollama: 'Ollama',
              custom: 'Custom',
              lm_studio: 'LM Studio',
            }
            return (
              <div className="bg-white rounded-xl border border-sage-cloud px-5 py-4 cursor-pointer transition-all duration-200 animate-fade-in-up card-shadow hover:card-shadow hover:-translate-y-0.5" key={p.id} onClick={() => openEdit(p)}
                style={{ animationDelay: `${idx * 60}ms` }}>
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <h3 className="text-body-sm font-semibold text-graphite">{p.label}</h3>
                    <span className={`px-1.5 py-0.5 rounded text-[10px] font-semibold text-white ${kindColors[p.kind] || 'bg-slate-500'}`}>{kindLabels[p.kind] || p.kind}</span>
                  </div>
                  <Button variant="ghost" size="icon-sm" className="text-red-400 hover:text-red-500" onClick={e => { e.stopPropagation(); remove(p.id) }}>✕</Button>
                </div>
                <p className="text-caption text-slate mb-1 font-mono">{p.model}</p>
                <div className="text-caption text-fog truncate" title={p.id}>{p.id}</div>
              </div>
            )
          })}
        </div>
      )}

      {/* Provider form modal */}
      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="sm:max-w-[600px] max-h-[85vh] overflow-y-auto p-6">
          <DialogTitle className="text-subheading font-semibold text-graphite mb-4">
            {editing ? 'Edit Provider' : 'New Provider'}
          </DialogTitle>
          <div className="mb-4">
            <label className="block text-caption text-slate mb-1 font-medium">Label</label>
            <Input value={label} onChange={e => setLabel(e.target.value)} placeholder="My OpenAI Key" className="h-auto py-2.5" />
          </div>
          <div className="flex gap-3 mb-4">
            <div className="flex-1">
              <label className="block text-caption text-slate mb-1 font-medium">Provider</label>
              <Select value={kind} onValueChange={(v) => v !== null && handleKindChange(v as ProviderKind)}>
                <SelectTrigger className="w-full h-10">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {PROVIDER_KINDS.map(k => <SelectItem key={k.value} value={k.value}>{k.label}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="flex-1">
              <label className="block text-caption text-slate mb-1 font-medium">Model</label>
              <Input value={model} onChange={e => setModel(e.target.value)} placeholder="gpt-4o" className="h-auto py-2.5" />
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-caption text-slate mb-1 font-medium">API Key {kind === 'ollama' ? <span className="font-normal text-fog">(optional for local)</span> : ''}</label>
            <Input value={apiKey} onChange={e => setApiKey(e.target.value)} type="password" placeholder={kind === 'ollama' ? 'Leave empty for local' : 'sk-...'} className="h-auto py-2.5" />
          </div>
          <div className="mb-4">
            <label className="block text-caption text-slate mb-1 font-medium">API URL</label>
            <Input value={apiUrl} onChange={e => setApiUrl(e.target.value)} placeholder={PROVIDER_KINDS.find(k => k.value === kind)?.defaultUrl || 'https://...'} className="h-auto py-2.5" />
          </div>
          <div className="flex justify-end gap-3 mt-6">
            <Button variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
            <Button onClick={save}>Save</Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
