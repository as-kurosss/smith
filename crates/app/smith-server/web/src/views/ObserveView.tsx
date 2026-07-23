import { ObservePage } from '../components/observe/ObservePage'

interface Props {
  addToast: (msg: string, type?: 'error' | 'success' | 'info') => void
}

export function ObserveView({ addToast }: Props) {
  return (
    <div className="p-6">
      <ObservePage addToast={addToast} />
    </div>
  )
}
