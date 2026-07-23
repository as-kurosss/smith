import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import type { Config } from '../types'

interface Props {
  config: Config | null
  viewMode: 'normal' | 'wide' | 'simple'
  onViewModeChange: (mode: 'normal' | 'wide' | 'simple') => void
  onClose: () => void
  addToast: (msg: string, type?: 'error' | 'success' | 'info') => void
}

export function SettingsPanel({ config, viewMode, onViewModeChange, onClose }: Props) {
  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[10vh]" onClick={onClose}>
      <div className="fixed inset-0 bg-black/10 backdrop-blur-sm" />
      <div onClick={e => e.stopPropagation()}
        className="relative w-full max-w-lg bg-white rounded-2xl shadow-xl border border-sage-cloud p-8 animate-scale-in max-h-[70vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-subheading font-semibold text-graphite">Settings</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            ✕
          </Button>
        </div>

        {/* Request Timeout */}
        <div className="mb-6 pb-6 border-b border-sage-cloud">
          <label className="block text-body-sm font-medium text-graphite mb-1">Request Timeout</label>
          <div className="text-body-sm text-fog">{config?.request_timeout_seconds ?? 30}s</div>
          <p className="text-caption text-slate mt-1">Maximum time the server waits for an LLM response before timing out.</p>
        </div>

        {/* Owner */}
        {config?.owner_id && (
          <div className="mb-6 pb-6 border-b border-sage-cloud">
            <label className="block text-body-sm font-medium text-graphite mb-1">Session Owner</label>
            <div className="text-body-sm text-fog">{config.owner_id}</div>
          </div>
        )}

        {/* View Mode */}
        <div>
          <label className="block text-body-sm font-medium text-graphite mb-3">View Mode</label>
          <div className="flex items-center gap-2">
            {(['normal', 'wide', 'simple'] as const).map(mode => (
              <Button key={mode}
                variant={viewMode === mode ? 'default' : 'outline'}
                size="sm"
                onClick={() => onViewModeChange(mode)}
              >
                {mode.charAt(0).toUpperCase() + mode.slice(1)}
              </Button>
            ))}
          </div>
          <p className="text-caption text-slate mt-2">
            {viewMode === 'normal' && 'Sidebar visible, standard layout.'}
            {viewMode === 'wide' && 'Sidebar hidden, full-width chat area.'}
            {viewMode === 'simple' && 'Minimal UI — sidebar hidden, flat navigation, compact.'}
          </p>
        </div>
      </div>
    </div>
  )
}
