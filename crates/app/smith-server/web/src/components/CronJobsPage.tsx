import { useState, useEffect, useCallback } from 'react'
import type { CronJobDefinition } from '../types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'

interface Props {
  addToast: (msg: string, type?: 'error' | 'success' | 'info') => void
}

const API_BASE = '/api'

async function listCronJobs(): Promise<CronJobDefinition[]> {
  const res = await fetch(`${API_BASE}/cron-jobs`)
  const json = await res.json()
  return json.success ? (json.data ?? []) : []
}

async function createCronJob(body: Partial<CronJobDefinition>): Promise<boolean> {
  const res = await fetch(`${API_BASE}/cron-jobs`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
  const json = await res.json()
  return json.success
}

async function updateCronJob(id: string, body: Partial<CronJobDefinition>): Promise<boolean> {
  const res = await fetch(`${API_BASE}/cron-jobs/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
  const json = await res.json()
  return json.success
}

async function deleteCronJob(id: string): Promise<boolean> {
  const res = await fetch(`${API_BASE}/cron-jobs/${id}`, { method: 'DELETE' })
  const json = await res.json()
  return json.success
}

async function toggleCronJob(id: string, enabled: boolean): Promise<boolean> {
  return updateCronJob(id, { enabled } as Partial<CronJobDefinition>)
}

const CRON_PRESETS = [
  { label: 'Every 5 min', value: '*/5 * * * *' },
  { label: 'Every 30 min', value: '*/30 * * * *' },
  { label: 'Every hour', value: '0 * * * *' },
  { label: 'Daily 9am', value: '0 9 * * *' },
  { label: 'Daily 6pm', value: '0 18 * * *' },
  { label: 'Weekly Mon 9am', value: '0 9 * * 1' },
]

export function CronJobsPage({ addToast }: Props) {
  const [jobs, setJobs] = useState<CronJobDefinition[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editId, setEditId] = useState<string | null>(null)

  // Form fields
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [schedule, setSchedule] = useState('')
  const [taskType, setTaskType] = useState<'text' | 'agent'>('text')
  const [content, setContent] = useState('')

  const load = useCallback(async () => {
    setLoading(true)
    try { setJobs(await listCronJobs()) }
    catch (e: any) { addToast(e.message) }
    finally { setLoading(false) }
  }, [addToast])

  useEffect(() => { load() }, [load])

  const openCreate = () => {
    setEditId(null)
    setName('')
    setDescription('')
    setSchedule('')
    setTaskType('text')
    setContent('')
    setShowForm(true)
  }

  const openEdit = (job: CronJobDefinition) => {
    setEditId(job.id)
    setName(job.name)
    setDescription(job.description || '')
    setSchedule(job.schedule)
    setTaskType(job.task_type)
    setContent(job.content || '')
    setShowForm(true)
  }

  const save = async () => {
    const body = { name, description: description || null, schedule, task_type: taskType, content: content || null }
    try {
      if (editId) {
        await updateCronJob(editId, body as Partial<CronJobDefinition>)
        addToast('Cron job updated', 'success')
      } else {
        await createCronJob(body as Partial<CronJobDefinition>)
        addToast('Cron job created', 'success')
      }
      setShowForm(false)
      load()
    } catch (e: any) { addToast(e.message) }
  }

  const remove = async (id: string) => {
    if (!confirm('Delete this cron job?')) return
    try {
      await deleteCronJob(id)
      addToast('Cron job deleted', 'success')
      load()
    } catch (e: any) { addToast(e.message) }
  }

  const handleToggle = async (id: string, enabled: boolean) => {
    try {
      await toggleCronJob(id, enabled)
      load()
    } catch (e: any) { addToast(e.message) }
  }

  if (loading) {
    return <div className="flex items-center justify-center h-40">
      <div className="text-body-sm text-slate animate-pulse-soft">Loading cron jobs…</div>
    </div>
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-body-sm text-slate">Manage scheduled tasks that run automatically.</p>
        </div>
        <Button onClick={openCreate}>+ New Cron Job</Button>
      </div>

      {jobs.length === 0 ? (
        <div className="text-center py-16">
          <div className="w-14 h-14 bg-white rounded-xl shadow-sm flex items-center justify-center text-2xl mx-auto mb-4">⏰</div>
          <h3 className="text-subheading font-semibold text-graphite mb-2">No Cron Jobs</h3>
          <p className="text-body-sm text-slate">Create a scheduled job to run tasks automatically.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {jobs.map((job, i) => (
            <div key={job.id} className="bg-white rounded-xl border border-sage-cloud p-5 card-shadow animate-fade-in-up" style={{ animationDelay: `${i * 50}ms` }}>
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-body-sm font-semibold text-graphite">{job.name}</h3>
                    <span className={`inline-block w-2 h-2 rounded-full ${job.enabled ? 'bg-green-500' : 'bg-slate-300'}`} />
                  </div>
                  {job.description && <p className="text-caption text-slate mb-2">{job.description}</p>}
                  <div className="flex flex-wrap items-center gap-3 text-caption text-fog">
                    <code className="px-1.5 py-0.5 bg-sage-veil rounded text-xs font-mono">{job.schedule}</code>
                    <span>·</span>
                    <span>{job.task_type}</span>
                    {job.agent_id && <><span>·</span><span>Agent: {job.agent_id}</span></>}
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" checked={job.enabled} onChange={e => handleToggle(job.id, e.target.checked)} className="sr-only peer" />
                    <div className="w-9 h-5 bg-sage-cloud rounded-full peer peer-checked:bg-sage-teal peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all" />
                  </label>
                  <Button variant="ghost" size="icon-sm" onClick={() => openEdit(job)} title="Edit">✎</Button>
                  <Button variant="ghost" size="icon-sm" className="text-red-500 hover:text-red-600" onClick={() => remove(job.id)} title="Delete">✕</Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Form dialog */}
      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="sm:max-w-[520px] max-h-[85vh] overflow-y-auto p-6">
          <DialogTitle className="text-subheading font-semibold text-graphite mb-4">
            {editId ? 'Edit Cron Job' : 'New Cron Job'}
          </DialogTitle>

          <div className="mb-4">
            <label className="block text-caption text-slate mb-1 font-medium">Name</label>
            <Input value={name} onChange={e => setName(e.target.value)} placeholder="Daily Summary" className="h-auto py-2.5" />
          </div>

          <div className="mb-4">
            <label className="block text-caption text-slate mb-1 font-medium">Description</label>
            <Input value={description} onChange={e => setDescription(e.target.value)} placeholder="Optional description" className="h-auto py-2.5" />
          </div>

          <div className="mb-4">
            <label className="block text-caption text-slate mb-1 font-medium">Cron Schedule</label>
            <Input value={schedule} onChange={e => setSchedule(e.target.value)} placeholder="0 9 * * *" className="h-auto py-2.5 mb-2 font-mono" />
            <div className="flex flex-wrap gap-1.5">
              {CRON_PRESETS.map(p => (
                <button key={p.value} type="button" onClick={() => setSchedule(p.value)}
                  className={`px-2 py-1 text-caption rounded-md border transition-colors cursor-pointer ${
                    schedule === p.value ? 'bg-sage-teal text-white border-sage-teal' : 'bg-white text-slate border-sage-cloud hover:bg-sage-veil'
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-caption text-slate mb-1 font-medium">Task Type</label>
            <select value={taskType} onChange={e => setTaskType(e.target.value as 'text' | 'agent')}
              className="w-full h-auto py-2.5 rounded-lg border border-input bg-transparent px-2.5 text-body-sm text-foreground outline-none focus:border-ring"
            >
              <option value="text">Text — send fixed message</option>
              <option value="agent">Agent — ask the agent a question</option>
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-caption text-slate mb-1 font-medium">
              {taskType === 'text' ? 'Message' : 'Request Content'}
            </label>
            <Textarea value={content} onChange={e => setContent(e.target.value)}
              placeholder={taskType === 'text' ? 'Message to send…' : 'Question for the agent…'}
              className="min-h-[80px]" />
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <Button variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
            <Button onClick={save} disabled={!name.trim() || !schedule.trim()}>Save</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
