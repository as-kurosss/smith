import { McpPage } from '../components/McpPage'

interface Props {
  addToast: (msg: string, type?: 'error' | 'success' | 'info') => void
}

export function McpView({ addToast }: Props) {
  return (
    <div className="p-6">
      <McpPage addToast={addToast} />
    </div>
  )
}
