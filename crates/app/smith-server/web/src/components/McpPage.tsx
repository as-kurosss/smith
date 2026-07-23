import { useState, useEffect, useCallback } from 'react'
import * as api from '../api'
import type { McpServerConfig } from '../types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'

interface Props {
  addToast: (msg: string, type?: 'error' | 'success' | 'info') => void
}

export function McpPage({ addToast }: Props) {
  const [servers, setServers] = useState<McpServerConfig[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [mcpName, setMcpName] = useState('')
  const [mcpCommand, setMcpCommand] = useState('')
  const [mcpArgs, setMcpArgs] = useState('')

  const load = useCallback(async () => {
    setLoading(true)
    try { setServers(await api.listMcpServers()) }
    catch (e: any) { addToast(e.message) }
    finally { setLoading(false) }
  }, [addToast])

  useEffect(() => { load() }, [load])

  const addServer = async () => {
    if (!mcpName.trim() || !mcpCommand.trim()) return
    try {
      await api.createMcpServer({
        name: mcpName.trim(),
        command: mcpCommand.trim(),
        args: mcpArgs.split(' ').filter(Boolean),
      })
      addToast('MCP server added', 'success')
      setMcpName(''); setMcpCommand(''); setMcpArgs('')
      setShowForm(false)
      load()
    } catch (e: any) { addToast(e.message) }
  }

  const removeServer = async (name: string) => {
    if (!confirm(`Remove "${name}"?`)) return
    try {
      await api.deleteMcpServer(name)
      addToast('MCP server removed', 'success')
      load()
    } catch (e: any) { addToast(e.message) }
  }

  if (loading) {
    return <div className="flex items-center justify-center h-40">
      <div className="text-body-sm text-slate animate-pulse-soft">Loading MCP servers…</div>
    </div>
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-body-sm text-slate">Manage MCP (Model Context Protocol) servers connected to this agent runtime.</p>
        </div>
        <Button onClick={() => setShowForm(true)}>+ Add Server</Button>
      </div>

      {servers.length === 0 ? (
        <div className="text-center py-16">
          <div className="w-14 h-14 bg-white rounded-xl shadow-sm flex items-center justify-center text-2xl mx-auto mb-4">🔗</div>
          <h3 className="text-subheading font-semibold text-graphite mb-2">No MCP Servers</h3>
          <p className="text-body-sm text-slate">Add an MCP server to extend agent capabilities with external tools.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {servers.map((s, i) => (
            <div key={s.name} className="bg-white rounded-xl border border-sage-cloud p-5 card-shadow animate-fade-in-up" style={{ animationDelay: `${i * 50}ms` }}>
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <h3 className="text-body-sm font-semibold text-graphite mb-1">{s.name}</h3>
                  <code className="text-caption text-fog block font-mono">
                    {s.command} {s.args.join(' ')}
                  </code>
                </div>
                <Button variant="ghost" size="icon-sm" className="text-red-500 hover:text-red-600 shrink-0" onClick={() => removeServer(s.name)}>
                  ✕
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add server dialog */}
      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="sm:max-w-[480px] p-6">
          <DialogTitle className="text-subheading font-semibold text-graphite mb-4">Add MCP Server</DialogTitle>

          <div className="mb-4">
            <label className="block text-caption text-slate mb-1 font-medium">Server Name</label>
            <Input value={mcpName} onChange={e => setMcpName(e.target.value)} placeholder="brave-search" className="h-auto py-2.5" />
          </div>

          <div className="mb-4">
            <label className="block text-caption text-slate mb-1 font-medium">Command</label>
            <Input value={mcpCommand} onChange={e => setMcpCommand(e.target.value)} placeholder="npx" className="h-auto py-2.5" />
          </div>

          <div className="mb-4">
            <label className="block text-caption text-slate mb-1 font-medium">Arguments</label>
            <Input value={mcpArgs} onChange={e => setMcpArgs(e.target.value)} placeholder="-y @anthropic/mcp-serve" className="h-auto py-2.5" />
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <Button variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
            <Button onClick={addServer} disabled={!mcpName.trim() || !mcpCommand.trim()}>Add</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
