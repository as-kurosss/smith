import { SecurityPanel } from '../components/SecurityPanel'

interface Props {
  addToast: (msg: string, type?: 'error' | 'success' | 'info') => void
}

export function SecurityView({ addToast }: Props) {
  return (
    <div className="p-6">
      <SecurityPanel addToast={addToast} />
    </div>
  )
}
