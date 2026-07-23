import { AgentsPanel } from '../components/AgentsPanel'
import type { AgentSummary, ProviderConfig } from '../types'

interface Props {
  agents: AgentSummary[]
  providers: ProviderConfig[]
  selectedAgent: AgentSummary | null
  onSelect: (agent: AgentSummary) => void
  onRefresh: () => void
  addToast: (msg: string, type?: 'error' | 'success' | 'info') => void
}

export function AgentsView({ agents, providers, selectedAgent, onSelect, onRefresh, addToast }: Props) {
  return (
    <div className="p-6">
      <AgentsPanel
        agents={agents}
        providers={providers}
        selectedAgent={selectedAgent}
        onSelect={onSelect}
        onRefresh={onRefresh}
        addToast={addToast}
      />
    </div>
  )
}
