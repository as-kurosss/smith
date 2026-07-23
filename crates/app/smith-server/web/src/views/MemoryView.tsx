import { MemoryPanel } from '../components/MemoryPanel'

interface Props {
  addToast: (msg: string, type?: 'error' | 'success' | 'info') => void
}

export function MemoryView({ addToast }: Props) {
  return (
    <div className="p-6">
      <MemoryPanel addToast={addToast} />
    </div>
  )
}
