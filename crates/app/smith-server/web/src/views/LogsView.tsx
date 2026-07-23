import { LogsPanel } from '../components/LogsPanel'

interface Props {
  addToast: (msg: string, type?: 'error' | 'success' | 'info') => void
}

export function LogsView({ addToast }: Props) {
  return (
    <div className="p-6">
      <LogsPanel addToast={addToast} />
    </div>
  )
}
