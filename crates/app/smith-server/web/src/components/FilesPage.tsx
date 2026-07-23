import { useState, useEffect, useCallback } from 'react'
import type { WorkspaceFile } from '../types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

interface Props {
  addToast: (msg: string, type?: 'error' | 'success' | 'info') => void
}

const API_BASE = '/api'

async function listWorkspaceFiles(dir?: string): Promise<WorkspaceFile[]> {
  const params = dir ? `?dir=${encodeURIComponent(dir)}` : ''
  const res = await fetch(`${API_BASE}/workspace/files${params}`)
  const json = await res.json()
  return json.success ? (json.data ?? []) : []
}

async function readWorkspaceFile(path: string): Promise<string> {
  const res = await fetch(`${API_BASE}/workspace/files/read?path=${encodeURIComponent(path)}`)
  const json = await res.json()
  if (!json.success) throw new Error(json.error || 'Failed to read file')
  return json.data.content
}

async function writeWorkspaceFile(path: string, content: string): Promise<boolean> {
  const res = await fetch(`${API_BASE}/workspace/files/write`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ path, content }),
  })
  const json = await res.json()
  return json.success
}

export function FilesPage({ addToast }: Props) {
  const [files, setFiles] = useState<WorkspaceFile[]>([])
  const [currentDir, setCurrentDir] = useState<string>('')
  const [pathStack, setPathStack] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedFile, setSelectedFile] = useState<string | null>(null)
  const [fileContent, setFileContent] = useState('')
  const [editing, setEditing] = useState(false)
  const [saving, setSaving] = useState(false)

  const loadFiles = useCallback(async (dir: string) => {
    setLoading(true)
    try { setFiles(await listWorkspaceFiles(dir || undefined)) }
    catch (e: any) { addToast(e.message) }
    finally { setLoading(false) }
  }, [addToast])

  useEffect(() => { loadFiles('') }, [loadFiles])

  const enterDir = (name: string) => {
    const newPath = currentDir ? `${currentDir}/${name}` : name
    setPathStack([...pathStack, currentDir])
    setCurrentDir(newPath)
    setSelectedFile(null)
    setFileContent('')
    loadFiles(newPath)
  }

  const goUp = () => {
    if (pathStack.length === 0) return
    const prev = pathStack[pathStack.length - 1]
    setPathStack(pathStack.slice(0, -1))
    setCurrentDir(prev)
    setSelectedFile(null)
    setFileContent('')
    loadFiles(prev)
  }

  const openFile = async (path: string) => {
    setSelectedFile(path)
    setEditing(false)
    try {
      const content = await readWorkspaceFile(path)
      setFileContent(content)
    } catch (e: any) { addToast(e.message); setFileContent('') }
  }

  const saveFile = async () => {
    if (!selectedFile) return
    setSaving(true)
    try {
      const ok = await writeWorkspaceFile(selectedFile, fileContent)
      if (ok) {
        addToast('File saved', 'success')
        setEditing(false)
      } else {
        addToast('Failed to save file', 'error')
      }
    } catch (e: any) { addToast(e.message) }
    finally { setSaving(false) }
  }

  const fileIcon = (f: WorkspaceFile) => {
    if (f.is_dir) return '📁'
    const ext = f.name.split('.').pop()?.toLowerCase()
    if (ext === 'md') return '📝'
    if (ext === 'json') return '📋'
    if (ext === 'toml') return '⚙'
    if (ext === 'yaml' || ext === 'yml') return '⚙'
    if (ext === 'rs') return '🦀'
    if (ext === 'ts' || ext === 'tsx') return '🔷'
    if (ext === 'css') return '🎨'
    return '📄'
  }

  return (
    <div className="flex gap-6 h-full">
      {/* File browser sidebar */}
      <div className="w-72 shrink-0 flex flex-col">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-body-sm font-semibold text-graphite">
            {currentDir || '/'}
          </h3>
          <div className="flex gap-1">
            {pathStack.length > 0 && (
              <Button variant="ghost" size="icon-sm" onClick={goUp} title="Go up">↑</Button>
            )}
            <Button variant="ghost" size="icon-sm" onClick={() => loadFiles(currentDir)} title="Refresh">↻</Button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto space-y-1">
          {loading ? (
            <div className="text-caption text-slate animate-pulse-soft py-4 text-center">Loading…</div>
          ) : files.length === 0 ? (
            <div className="text-caption text-slate py-4 text-center">Empty directory</div>
          ) : (
            files.map(f => (
              <button
                key={f.path}
                onClick={() => f.is_dir ? enterDir(f.name) : openFile(f.path)}
                className={`w-full flex items-center gap-2 px-3 py-2 text-body-sm text-left rounded-lg transition-colors cursor-pointer border-none ${
                  selectedFile === f.path ? 'bg-sage-veil text-sage-teal font-medium' : 'text-graphite hover:bg-sage-veil/50'
                }`}
              >
                <span className="shrink-0">{fileIcon(f)}</span>
                <span className="truncate">{f.name}</span>
                {f.size != null && !f.is_dir && (
                  <span className="text-caption text-slate ml-auto shrink-0">
                    {f.size > 1024 ? `${(f.size / 1024).toFixed(1)}k` : `${f.size}B`}
                  </span>
                )}
              </button>
            ))
          )}
        </div>
      </div>

      {/* Editor */}
      <div className="flex-1 flex flex-col min-w-0">
        {!selectedFile ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center">
            <div className="w-14 h-14 bg-white rounded-xl shadow-sm flex items-center justify-center text-2xl mb-4">📁</div>
            <h3 className="text-subheading font-semibold text-graphite mb-2">Workspace Files</h3>
            <p className="text-body-sm text-slate">Select a file to view or edit.</p>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-body-sm font-semibold text-graphite truncate">{selectedFile}</h3>
              <div className="flex gap-2">
                {editing ? (
                  <>
                    <Button size="sm" variant="outline" onClick={() => { setEditing(false); openFile(selectedFile) }}>
                      Cancel
                    </Button>
                    <Button size="sm" onClick={saveFile} disabled={saving}>
                      {saving ? 'Saving…' : 'Save'}
                    </Button>
                  </>
                ) : (
                  <Button size="sm" variant="outline" onClick={() => setEditing(true)} disabled={selectedFile == null}>
                    ✎ Edit
                  </Button>
                )}
              </div>
            </div>
            {editing ? (
              <textarea
                value={fileContent}
                onChange={e => setFileContent(e.target.value)}
                className="flex-1 w-full p-4 font-mono text-body-sm leading-relaxed border border-sage-cloud rounded-xl bg-white outline-none focus:border-sage-teal resize-none"
              />
            ) : (
              <pre className="flex-1 w-full p-4 font-mono text-body-sm leading-relaxed border border-sage-cloud rounded-xl bg-white overflow-auto whitespace-pre-wrap">
                {fileContent || <span className="text-slate italic">Empty file</span>}
              </pre>
            )}
          </>
        )}
      </div>
    </div>
  )
}
