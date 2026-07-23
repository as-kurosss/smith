import { useState, useEffect, useCallback } from 'react'
import * as api from '../api'
import type { ApprovalRequest, Notification } from '../types'
import { Button } from '@/components/ui/button'

interface Props {
  addToast: (msg: string, type?: 'error' | 'success' | 'info') => void
}

export function InboxPage({ addToast }: Props) {
  const [approvals, setApprovals] = useState<ApprovalRequest[]>([])
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState<'approvals' | 'history'>('approvals')

  const loadApprovals = useCallback(async () => {
    try { setApprovals(await api.listPendingApprovals()) }
    catch { /* ignore */ }
  }, [])

  const loadNotifications = useCallback(async () => {
    try { setNotifications(await api.getNotifications()) }
    catch { /* ignore */ }
  }, [])

  useEffect(() => {
    Promise.all([loadApprovals(), loadNotifications()]).finally(() => setLoading(false))
    const interval = setInterval(() => { loadApprovals(); loadNotifications() }, 5000)
    return () => clearInterval(interval)
  }, [loadApprovals, loadNotifications])

  const handleApprove = async (id: string) => {
    try {
      await api.approveApproval(id)
      addToast('Approved', 'success')
      loadApprovals()
    } catch (e: any) { addToast(e.message) }
  }

  const handleDeny = async (id: string) => {
    try {
      await api.denyApproval(id)
      addToast('Denied', 'success')
      loadApprovals()
    } catch (e: any) { addToast(e.message) }
  }

  if (loading) {
    return <div className="flex items-center justify-center h-40">
      <div className="text-body-sm text-slate animate-pulse-soft">Loading…</div>
    </div>
  }

  return (
    <div className="max-w-3xl mx-auto">
      {/* Tab bar */}
      <div className="flex items-center gap-2 mb-6 border-b border-sage-cloud pb-3">
        <button
          onClick={() => setTab('approvals')}
          className={`px-4 py-2 text-body-sm font-medium rounded-lg transition-colors cursor-pointer border-none ${
            tab === 'approvals'
              ? 'bg-sage-teal text-white'
              : 'text-slate hover:bg-sage-veil'
          }`}
        >
          Approvals {approvals.length > 0 && `(${approvals.length})`}
        </button>
        <button
          onClick={() => setTab('history')}
          className={`px-4 py-2 text-body-sm font-medium rounded-lg transition-colors cursor-pointer border-none ${
            tab === 'history'
              ? 'bg-sage-teal text-white'
              : 'text-slate hover:bg-sage-veil'
          }`}
        >
          History
        </button>
      </div>

      {tab === 'approvals' ? (
        approvals.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-14 h-14 bg-white rounded-xl shadow-sm flex items-center justify-center text-2xl mx-auto mb-4">✅</div>
            <h3 className="text-subheading font-semibold text-graphite mb-2">All Clear</h3>
            <p className="text-body-sm text-slate">No pending approvals.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {approvals.map(a => (
              <div key={a.id} className="bg-white rounded-xl border border-sage-cloud p-5 card-shadow animate-fade-in-up">
                <div className="flex items-center justify-between mb-2">
                  <span className="inline-block px-2 py-0.5 rounded text-caption font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                    {a.tool_name}
                  </span>
                  <span className="text-caption text-slate">{new Date(a.created_at).toLocaleString()}</span>
                </div>
                <p className="text-body-sm text-graphite mb-3">{a.reason}</p>
                {a.tool_args != null && typeof a.tool_args === 'object' && (
                  <pre className="text-caption bg-sage-veil p-3 rounded-lg mb-4 overflow-x-auto text-slate max-h-24">
                    {JSON.stringify(a.tool_args, null, 2)}
                  </pre>
                )}
                <div className="flex items-center gap-2">
                  <Button size="sm" className="bg-sage-teal hover:bg-sage-teal/90 text-white" onClick={() => handleApprove(a.id)}>
                    ✓ Approve
                  </Button>
                  <Button size="sm" variant="outline" className="text-red-600 border-red-200 hover:bg-red-50" onClick={() => handleDeny(a.id)}>
                    ✕ Deny
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )
      ) : (
        notifications.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-14 h-14 bg-white rounded-xl shadow-sm flex items-center justify-center text-2xl mx-auto mb-4">📭</div>
            <h3 className="text-subheading font-semibold text-graphite mb-2">No Notifications</h3>
            <p className="text-body-sm text-slate">Notifications from cron jobs and system events will appear here.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {notifications.map((n, i) => (
              <div key={i} className="bg-white rounded-xl border border-sage-cloud p-4 card-shadow animate-fade-in-up">
                <div className="flex items-center gap-2 mb-1">
                  <span className={`inline-block w-2 h-2 rounded-full ${
                    n.kind === 'task_completed' ? 'bg-green-500' :
                    n.kind === 'task_failed' ? 'bg-red-500' :
                    n.kind === 'approval_created' ? 'bg-amber-500' : 'bg-slate-400'
                  }`} />
                  <span className="text-caption font-medium text-graphite">{n.kind.replace(/_/g, ' ')}</span>
                  <span className="text-caption text-slate ml-auto">{new Date(n.timestamp).toLocaleString()}</span>
                </div>
                <p className="text-body-sm text-slate">{n.message}</p>
              </div>
            ))}
          </div>
        )
      )}
    </div>
  )
}
