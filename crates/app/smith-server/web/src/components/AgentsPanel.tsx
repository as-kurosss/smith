import { useState } from 'react'
import * as api from '../api'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { Switch } from '@/components/ui/switch'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select'
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'
import type { AgentSummary, AgentDefinition, ProviderConfig, ToolBinding, ScrollConfig } from '../types'

interface Props {
  agents: AgentSummary[]
  providers: ProviderConfig[]
  selectedAgent: AgentSummary | null
  onSelect: (agent: AgentSummary) => void
  onRefresh: () => void
  addToast: (msg: string, type?: 'error' | 'success') => void
}

const AVAILABLE_TOOLS = [
  { name: 'calculator', desc: 'Arithmetic' },
  { name: 'time', desc: 'Current time' },
  { name: 'shell', desc: 'Shell commands' },
]

const SCROLL_OPTIONS: { value: string; label: string }[] = [
  { value: JSON.stringify({ type: 'truncate', max_messages: 50 }), label: 'Truncate (50)' },
  { value: JSON.stringify({ type: 'truncate', max_messages: 100 }), label: 'Truncate (100)' },
  { value: JSON.stringify({ type: 'sliding_window', window_size: 20 }), label: 'Sliding Window (20)' },
  { value: JSON.stringify({ type: 'no_op' }), label: 'Keep All' },
]

// Track enabled state (client-side only for now)
const enabledAgents = new Set<string>()

export function AgentsPanel({ agents, providers, selectedAgent, onSelect, onRefresh, addToast }: Props) {
  const [showForm, setShowForm] = useState(false)
  const [editId, setEditId] = useState<string | null>(null)
  const [agentEnabled, setAgentEnabled] = useState<Record<string, boolean>>({})

  // Form fields
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [providerId, setProviderId] = useState('')
  const [systemPrompt, setSystemPrompt] = useState('')
  const [temperature, setTemperature] = useState('')
  const [maxTokens, setMaxTokens] = useState('')
  const [modelOverride, setModelOverride] = useState('')
  const [selectedTools, setSelectedTools] = useState<Set<string>>(new Set())
  const [scrollStr, setScrollStr] = useState(SCROLL_OPTIONS[0].value)
  const [protectActiveTurn, setProtectActiveTurn] = useState(false)
  const [toolResultCap, setToolResultCap] = useState('')

  const openCreate = () => {
    setEditId(null)
    setName('')
    setDescription('')
    setProviderId(providers[0]?.id || '')
    setSystemPrompt('You are a helpful assistant.')
    setTemperature('')
    setMaxTokens('')
    setModelOverride('')
    setSelectedTools(new Set(['calculator', 'time']))
    setScrollStr(SCROLL_OPTIONS[0].value)
    setProtectActiveTurn(false)
    setToolResultCap('')
    setShowForm(true)
  }

  const openEdit = async (agentId: string) => {
    try {
      const a: AgentDefinition = await api.getAgent(agentId)
      setEditId(a.id)
      setName(a.name)
      setDescription(a.description || '')
      setProviderId(a.provider_id)
      setSystemPrompt(a.system_prompt)
      setTemperature(a.temperature != null ? String(a.temperature) : '')
      setMaxTokens(a.max_tokens != null ? String(a.max_tokens) : '')
      setModelOverride('')
      setSelectedTools(new Set(
        a.tools.filter((t): t is ToolBinding & { type: 'builtin' } => t.type === 'builtin').map(t => t.name)
      ))
      setScrollStr(JSON.stringify(a.scroll_strategy))
      setProtectActiveTurn(a.protect_active_turn ?? false)
      setToolResultCap(a.tool_result_cap != null ? String(a.tool_result_cap) : '')
      setShowForm(true)
    } catch (e: any) {
      addToast(e.message)
    }
  }

  const toggleEnabled = (agentId: string) => {
    setAgentEnabled(prev => {
      const next = { ...prev }
      next[agentId] = !prev[agentId]
      if (!next[agentId]) delete next[agentId]
      return next
    })
    addToast('Agent state toggled', 'success')
  }

  const toggleTool = (tool: string) => {
    setSelectedTools(prev => {
      const next = new Set(prev)
      if (next.has(tool)) next.delete(tool)
      else next.add(tool)
      return next
    })
  }

  const save = async () => {
    const tools: ToolBinding[] = Array.from(selectedTools).map(name => ({
      type: 'builtin' as const,
      name,
      enabled: true,
    }))
    let scrollStrategy: ScrollConfig
    try { scrollStrategy = JSON.parse(scrollStr) }
    catch { scrollStrategy = { type: 'truncate', max_messages: 50 } }

    const body: Partial<AgentDefinition> = {
      name,
      description: description || null,
      provider_id: providerId,
      system_prompt: systemPrompt,
      temperature: temperature ? parseFloat(temperature) : null,
      max_tokens: maxTokens ? parseInt(maxTokens) : null,
      tools,
      scroll_strategy: scrollStrategy,
      protect_active_turn: protectActiveTurn,
      tool_result_cap: toolResultCap ? parseInt(toolResultCap) : null,
    }

    try {
      if (editId) {
        await api.updateAgent(editId, body)
      } else {
        await api.createAgent(body)
      }
      setShowForm(false)
      onRefresh()
      addToast('Agent saved', 'success')
    } catch (e: any) {
      addToast(e.message)
    }
  }

  const remove = async (id: string) => {
    if (!confirm('Delete this agent?')) return
    try {
      await api.deleteAgent(id)
      onRefresh()
      addToast('Agent deleted', 'success')
    } catch (e: any) {
      addToast(e.message)
    }
  }

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-body-sm text-slate">Manage AI agents — each agent can use a different provider, system prompt, and set of tools.</p>
        </div>
        <Button onClick={openCreate} className="shrink-0">+ New Agent</Button>
      </div>

      {agents.length === 0 ? (
        <div className="text-center py-16">
          <div className="w-14 h-14 bg-white rounded-xl shadow-sm flex items-center justify-center text-2xl mx-auto mb-4">🤖</div>
          <h3 className="text-subheading font-semibold text-graphite mb-2">No Agents</h3>
          <p className="text-body-sm text-slate mb-4">Create your first agent to start automating tasks.</p>
          <Button variant="outline" onClick={openCreate}>+ New Agent</Button>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4">
          {agents.map((a, idx) => {
            const isDisabled = agentEnabled[a.id] === false
            const provider = providers.find(p => p.id === a.provider_id)
            return (
              <div key={a.id}
                style={{ animationDelay: `${idx * 60}ms` }}
                className={`bg-white rounded-xl border px-5 py-4 cursor-pointer transition-all duration-200 animate-fade-in-up card-shadow ${
                  selectedAgent?.id === a.id ? 'border-sage-teal bg-sage-veil' : isDisabled ? 'border-sage-cloud opacity-60' : 'border-sage-cloud hover:card-shadow hover:-translate-y-0.5'
                }`}
                onClick={() => onSelect(a)}
                onDoubleClick={() => openEdit(a.id)}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className={`w-2.5 h-2.5 rounded-full ${isDisabled ? 'bg-slate-300' : 'bg-green-400'}`} />
                    <h3 className="text-body-sm font-semibold text-graphite">{a.name}</h3>
                  </div>
                  <div className="flex gap-0.5">
                    <Button variant="ghost" size="icon-sm"
                      onClick={e => { e.stopPropagation(); openEdit(a.id) }}
                      title="Edit" className="opacity-0 group-hover:opacity-100">✎</Button>
                    <Button variant="ghost" size="icon-sm" className="text-red-400 hover:text-red-500"
                      onClick={e => { e.stopPropagation(); remove(a.id) }}>✕</Button>
                  </div>
                </div>
                <p className="text-caption text-slate line-clamp-2 mb-3">{a.system_prompt}</p>
                <div className="flex items-center gap-3 text-caption text-fog">
                  <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-sage-veil">{provider?.label || a.provider_id}</span>
                  <span>{a.tool_count} tools</span>
              <Switch checked={!isDisabled} onCheckedChange={() => toggleEnabled(a.id)}
                onClick={e => e.stopPropagation()} size="sm" />
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Agent form modal */}
      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="sm:max-w-[600px] max-h-[85vh] overflow-y-auto p-6">
          <DialogTitle className="text-subheading font-semibold text-graphite mb-4">
            {editId ? 'Edit Agent' : 'New Agent'}
          </DialogTitle>

          <div className="mb-4">
            <label className="block text-caption text-slate mb-1 font-medium">Name</label>
            <Input value={name} onChange={e => setName(e.target.value)} placeholder="My Assistant" className="h-auto py-2.5" />
          </div>

          <div className="mb-4">
            <label className="block text-caption text-slate mb-1 font-medium">Description</label>
            <Input value={description} onChange={e => setDescription(e.target.value)} placeholder="Optional description" className="h-auto py-2.5" />
          </div>

          <div className="mb-4">
            <label className="block text-caption text-slate mb-1 font-medium">Provider</label>
            {providers.length === 0 ? (
              <div className="text-caption text-red py-2">
                No providers configured. Create one in the Providers tab first.
              </div>
            ) : (
              <Select value={providerId} onValueChange={(v) => v !== null && setProviderId(v)}>
                <SelectTrigger className="w-full h-10">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {providers.map(p => (
                    <SelectItem key={p.id} value={p.id}>{p.label} ({p.kind})</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>

          <div className="mb-4">
            <label className="block text-caption text-slate mb-1 font-medium">System Prompt</label>
            <Textarea value={systemPrompt} onChange={e => setSystemPrompt(e.target.value)}
              placeholder="You are a helpful assistant." className="min-h-[80px]" />
          </div>

          <div className="flex gap-3 mb-4">
            <div className="flex-1">
              <label className="block text-caption text-slate mb-1 font-medium">Temperature</label>
              <Input value={temperature} onChange={e => setTemperature(e.target.value)}
                type="number" step="0.1" placeholder="Default" className="h-auto py-2.5" />
            </div>
            <div className="flex-1">
              <label className="block text-caption text-slate mb-1 font-medium">Max Tokens</label>
              <Input value={maxTokens} onChange={e => setMaxTokens(e.target.value)}
                type="number" placeholder="Default" className="h-auto py-2.5" />
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-caption text-slate mb-1 font-medium">Model Override <span className="font-normal text-fog">(optional)</span></label>
            <Input value={modelOverride} onChange={e => setModelOverride(e.target.value)}
              placeholder="Leave empty to use provider default model" className="h-auto py-2.5" />
          </div>

          <div className="mb-4">
            <label className="flex items-center gap-1.5 cursor-pointer text-caption text-slate font-medium mb-1">
              <Checkbox checked={protectActiveTurn}
                onCheckedChange={(v: boolean) => setProtectActiveTurn(v)} />
              Protect Active Turn
            </label>
            <div className="text-caption text-fog mt-0.5">
              Pins the most recent user message and prevents it from being evicted during scroll.
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-caption text-slate mb-1 font-medium">Tool Result Cap (bytes) <span className="font-normal text-fog">(empty = no cap)</span></label>
            <Input value={toolResultCap} onChange={e => setToolResultCap(e.target.value)}
              type="number" placeholder="e.g. 4096" className="h-auto py-2.5" />
          </div>

          <div className="mb-4">
            <label className="block text-caption text-slate mb-1 font-medium">Tools</label>
            {AVAILABLE_TOOLS.map(t => (
              <label key={t.name} className="flex items-center gap-1.5 mb-1 cursor-pointer">
                <Checkbox checked={selectedTools.has(t.name)}
                  onCheckedChange={() => toggleTool(t.name)} />
                <span className="text-body-sm text-graphite">{t.name}</span>
                <span className="text-caption text-slate">— {t.desc}</span>
              </label>
            ))}
          </div>

          <div className="mb-4">
            <label className="block text-caption text-slate mb-1 font-medium">Scroll Strategy</label>
            <Select value={scrollStr} onValueChange={(v) => v !== null && setScrollStr(v)}>
              <SelectTrigger className="w-full h-10">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {SCROLL_OPTIONS.map(o => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}
              </SelectContent>
            </Select>
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
