import { ProvidersPanel } from '../components/ProvidersPanel'
import type { ProviderConfig } from '../types'

interface Props {
  providers: ProviderConfig[]
  onRefresh: () => void
  addToast: (msg: string, type?: 'error' | 'success' | 'info') => void
}

export function ProvidersView({ providers, onRefresh, addToast }: Props) {
  return (
    <div className="p-6">
      <ProvidersPanel providers={providers} onRefresh={onRefresh} addToast={addToast} />
    </div>
  )
}
