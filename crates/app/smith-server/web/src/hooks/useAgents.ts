import { useState, useCallback } from 'react'
import { toast } from 'sonner'
import * as api from '../api'
import type { AgentSummary, ProviderConfig, ToolBinding } from '../types'

export function useAgents() {
  const [agents, setAgents] = useState<AgentSummary[]>([])
  const [providers, setProviders] = useState<ProviderConfig[]>([])
  const [selectedAgent, setSelectedAgent] = useState<AgentSummary | null>(null)
  const [tools, setTools] = useState<ToolBinding[]>([])

  const addToast = useCallback((msg: string, type: 'error' | 'success' | 'info' = 'error') => {
    if (type === 'success') toast.success(msg)
    else if (type === 'error') toast.error(msg)
    else toast.info(msg)
  }, [])

  const loadAgents = useCallback(async () => {
    try { setAgents(await api.listAgents()) }
    catch (e: any) { addToast(e.message) }
  }, [addToast])

  const loadProviders = useCallback(async () => {
    try { setProviders(await api.listProviders()) }
    catch (e: any) { addToast(e.message) }
  }, [addToast])

  const loadTools = useCallback(async (agent: AgentSummary) => {
    try {
      const agentDef = await api.getAgent(agent.id)
      setTools(agentDef.tools ?? [])
    } catch { /* ignore */ }
  }, [])

  return {
    agents, providers, selectedAgent, tools,
    setSelectedAgent, setTools,
    loadAgents, loadProviders, loadTools,
  }
}
