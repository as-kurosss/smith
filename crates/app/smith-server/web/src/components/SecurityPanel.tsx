import { useState, useEffect, useCallback } from 'react'
import * as api from '../api'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import type { ApprovalRequest } from '../types'

interface SecurityPolicy {
  id: string;
  name: string;
  description: string;
  action: string;
  rules: { id: string; name: string; pattern: string; action?: string }[];
}

interface Props {
  addToast: (msg: string, type?: 'error' | 'success') => void
}

export function SecurityPanel({ addToast }: Props) {
  const [policies, setPolicies] = useState<SecurityPolicy[]>([])
  const [loading, setLoading] = useState(true)
  const [expanded, setExpanded] = useState<string | null>(null)
  const [approvals, setApprovals] = useState<ApprovalRequest[]>([])
  const [approvalsLoading, setApprovalsLoading] = useState(false)

  const load = async () => {
    setLoading(true)
    try { setPolicies(await api.getSecurityPolicies() as SecurityPolicy[]) }
    catch (e: any) { addToast(e.message) }
    finally { setLoading(false) }
  }

  const loadApprovals = useCallback(async () => {
    setApprovalsLoading(true)
    try { setApprovals(await api.listPendingApprovals()) }
    catch { /* ignore */ }
    finally { setApprovalsLoading(false) }
  }, [])

  useEffect(() => { load(); loadApprovals() }, [loadApprovals])

  const handleApprove = async (id: string) => {
    try { await api.approveApproval(id); addToast('Approved', 'success'); loadApprovals() }
    catch (e: any) { addToast(e.message) }
  }

  const handleDeny = async (id: string) => {
    try { await api.denyApproval(id); addToast('Denied', 'success'); loadApprovals() }
    catch (e: any) { addToast(e.message) }
  }

  if (loading) {
    return <div className="flex items-center justify-center h-40"><div className="text-body-sm text-slate animate-pulse-soft">Loading…</div></div>
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      {/* Pending Approvals */}
      <section>
        <h3 className="text-body-sm font-semibold text-graphite mb-4 flex items-center gap-2">
          Pending Approvals
          {approvals.length > 0 && <span className="px-2 py-0.5 rounded-full text-caption font-medium bg-amber-100 text-amber-700">{approvals.length}</span>}
        </h3>
        {approvals.length === 0 ? (
          <div className="text-center py-10 bg-white rounded-xl border border-sage-cloud border-dashed">
            <p className="text-body-sm text-slate">{approvalsLoading ? 'Loading…' : 'No pending approvals.'}</p>
          </div>
        ) : (
          <div className="space-y-3">
            {approvals.map(a => (
              <div key={a.id} className="bg-white rounded-xl border border-sage-cloud p-5 card-shadow">
                <div className="flex items-center justify-between mb-2">
                  <span className="px-2 py-0.5 rounded text-caption font-semibold bg-amber-50 text-amber-700 border border-amber-200">{a.tool_name}</span>
                  <span className="text-caption text-slate">{new Date(a.created_at).toLocaleString()}</span>
                </div>
                <p className="text-body-sm text-graphite mb-3">{a.reason}</p>
                {a.tool_args != null && typeof a.tool_args === 'object' && (
                  <pre className="text-caption bg-sage-veil p-3 rounded-lg mb-4 overflow-x-auto text-slate max-h-24">{JSON.stringify(a.tool_args, null, 2)}</pre>
                )}
                <div className="flex gap-2">
                  <Button size="sm" className="bg-sage-teal text-white" onClick={() => handleApprove(a.id)}>✓ Approve</Button>
                  <Button size="sm" variant="outline" className="text-red-600 border-red-200" onClick={() => handleDeny(a.id)}>✕ Deny</Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Security Policies */}
      <section>
        <h3 className="text-body-sm font-semibold text-graphite mb-4">Security Policies</h3>
        {policies.length === 0 ? (
          <div className="text-center py-10 bg-white rounded-xl border border-sage-cloud border-dashed">
            <p className="text-body-sm text-slate">No policies configured.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {policies.map(p => (
              <div key={p.id} className="bg-white rounded-xl border border-sage-cloud card-shadow overflow-hidden">
                <div className="p-4 cursor-pointer flex items-start justify-between" onClick={() => setExpanded(expanded === p.id ? null : p.id)}>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className="text-body-sm font-semibold text-graphite">{p.name}</h4>
                      <span className={`px-2 py-0.5 rounded text-caption font-semibold text-white ${
                        p.action === 'allow' ? 'bg-green-500' : p.action === 'deny' ? 'bg-red-500' : 'bg-amber-500'
                      }`}>{p.action.toUpperCase()}</span>
                    </div>
                    <p className="text-caption text-slate mt-1">{p.description}</p>
                  </div>
                  <span className="text-slate ml-2">{expanded === p.id ? '▲' : '▼'}</span>
                </div>
                {expanded === p.id && p.rules.length > 0 && (
                  <div className="border-t border-sage-cloud px-4 py-3 space-y-2">
                    {p.rules.map((r: any) => (
                      <div key={r.id} className="flex items-center justify-between py-1">
                        <div className="flex-1 min-w-0">
                          <span className="text-caption text-graphite">{r.name}</span>
                          <code className="block text-caption text-fog mt-0.5">{r.pattern}</code>
                        </div>
                        {r.action && (
                          <span className={`px-1.5 py-0.5 rounded text-caption font-semibold text-white shrink-0 ${
                            r.action === 'allow' ? 'bg-green-500' : r.action === 'deny' ? 'bg-red-500' : 'bg-amber-500'
                          }`}>{r.action.toUpperCase()}</span>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Sandbox */}
      <section>
        <h3 className="text-body-sm font-semibold text-graphite mb-4">Sandbox Configuration</h3>
        <div className="bg-white rounded-xl border border-sage-cloud p-5 card-shadow">
          <div className="flex items-center justify-between mb-4">
            <span className="text-body-sm font-medium text-graphite">Docker Sandbox</span>
            <Switch defaultChecked={false} />
          </div>
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-caption text-slate mb-1">Docker Image</label>
              <Input defaultValue="ubuntu:22.04" />
            </div>
            <div className="w-32">
              <label className="block text-caption text-slate mb-1">Timeout (s)</label>
              <Input type="number" defaultValue={30} />
            </div>
          </div>
        </div>
      </section>

      {/* Shell Evasion */}
      <section>
        <h3 className="text-body-sm font-semibold text-graphite mb-4">Shell Evasion Rules</h3>
        <div className="grid grid-cols-2 gap-3">
          {[
            { id: 'evade_rm', name: 'Restrict rm -rf', desc: 'Block recursive force delete' },
            { id: 'evade_curl', name: 'Restrict curl/wget', desc: 'Ask before network requests' },
            { id: 'evade_nc', name: 'Restrict netcat', desc: 'Block reverse shells' },
            { id: 'evade_chmod', name: 'Restrict chmod 777', desc: 'Block world-writable permissions' },
          ].map(rule => (
            <div key={rule.id} className="bg-white rounded-xl border border-sage-cloud p-4 card-shadow flex items-center justify-between">
              <div>
                <span className="text-body-sm font-medium text-graphite">{rule.name}</span>
                <p className="text-caption text-slate">{rule.desc}</p>
              </div>
              <Switch defaultChecked={rule.id === 'evade_rm'} />
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
