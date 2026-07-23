import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import type { ToolBinding } from '../types'
import { BUILTIN_TOOLS } from '../constants'

interface Props {
  tools: ToolBinding[]
  onToolsChange: (tools: ToolBinding[]) => void
}

export function ToolsPanel({ tools, onToolsChange }: Props) {
  const enabledTools = tools.filter(t =>
    (t.type === 'builtin' && t.enabled) || (t.type === 'custom' && t.enabled)
  )
  const availableTools = BUILTIN_TOOLS.map(bt => {
    const existing = tools.find(t => t.type === 'builtin' && t.name === bt.name)
    return { ...bt, enabled: existing ? existing.enabled : false }
  }).filter(t => !t.enabled)

  const toggleTool = (name: string, enabled: boolean) => {
    const existing = tools.find(t => t.type === 'builtin' && t.name === name)
    if (existing) {
      onToolsChange(tools.map(t =>
        t.type === 'builtin' && t.name === name ? { ...t, enabled } : t
      ))
    } else {
      onToolsChange([...tools, { type: 'builtin' as const, name, enabled }])
    }
  }

  const enableAll = () => {
    onToolsChange(BUILTIN_TOOLS.map(bt => ({ type: 'builtin' as const, name: bt.name, enabled: true })))
  }

  const disableAll = () => {
    onToolsChange(tools.filter(t => t.type === 'custom'))
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-6">
        <p className="text-body-sm text-slate">Toggle built-in tools on or off. Disabled tools cannot be called by the agent in chat.</p>
      </div>

      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-body-sm font-semibold text-graphite">Enabled ({enabledTools.length})</h3>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={enableAll}>Enable All</Button>
            <Button variant="outline" size="sm" onClick={disableAll}>Disable All</Button>
          </div>
        </div>
        {enabledTools.length === 0 ? (
          <div className="text-center py-10 bg-white rounded-xl border border-sage-cloud border-dashed">
            <p className="text-body-sm text-slate">No tools enabled. Toggle tools below to add them.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {enabledTools.map(t => (
              <Card key={t.type === 'builtin' ? t.name : t.name} className="border-primary/40">
                <CardContent className="flex items-center justify-between p-4">
                  <div>
                    <span className="text-sm font-semibold">{t.name}</span>
                    {t.type === 'custom' && <span className="ml-1.5 px-1.5 py-0.5 rounded text-xs font-medium bg-amber-50 text-amber-700">custom</span>}
                  </div>
                  <Button variant="ghost" size="icon-sm" onClick={() => toggleTool(t.name, false)} className="text-muted-foreground hover:text-destructive">✕</Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      <div>
        <h3 className="text-body-sm font-semibold text-graphite mb-4">Available</h3>
        {availableTools.length === 0 ? (
          <div className="text-center py-10 bg-white rounded-xl border border-sage-cloud border-dashed">
            <p className="text-body-sm text-slate">All tools are enabled.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {availableTools.map(t => (
              <Card key={t.name}
                className="opacity-70 hover:opacity-100 transition-opacity cursor-pointer"
                onClick={() => toggleTool(t.name, true)}>
                <CardContent className="flex items-center justify-between p-4">
                  <div>
                    <span className="text-sm font-medium">{t.name}</span>
                    <p className="text-xs text-muted-foreground mt-0.5">{t.description}</p>
                  </div>
                  <span className="text-xs text-primary font-medium shrink-0">Enable</span>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
