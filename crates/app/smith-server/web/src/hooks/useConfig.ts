import { useState, useEffect, useCallback, useRef } from 'react'
import { toast } from 'sonner'
import * as api from '../api'
import type { Config } from '../types'

type ViewMode = 'normal' | 'wide' | 'simple'

function loadViewMode(): ViewMode {
  try {
    const saved = localStorage.getItem('smith_view_mode')
    if (saved === 'wide' || saved === 'simple') return saved
  } catch { /* ignore */ }
  return 'normal'
}

function saveViewMode(mode: ViewMode) {
  try { localStorage.setItem('smith_view_mode', mode) }
  catch { /* ignore */ }
}

export function useConfig() {
  const [config, setConfig] = useState<Config | null>(null)
  const [viewMode, setViewMode] = useState<ViewMode>(loadViewMode)
  const [showSettings, setShowSettings] = useState(false)
  const notifIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const addToast = useCallback((msg: string, type: 'error' | 'success' | 'info' = 'error') => {
    if (type === 'success') toast.success(msg)
    else if (type === 'error') toast.error(msg)
    else toast.info(msg)
  }, [])

  const loadConfig = useCallback(async () => {
    try { setConfig(await api.getConfig()) }
    catch { /* config not critical */ }
  }, [])

  const setViewModeWithStorage = useCallback((mode: ViewMode) => {
    setViewMode(mode)
    saveViewMode(mode)
  }, [])

  // Poll notifications for background task completion
  useEffect(() => {
    if (notifIntervalRef.current) clearInterval(notifIntervalRef.current)
    notifIntervalRef.current = setInterval(async () => {
      try {
        const notes = await api.getNotifications()
        for (const n of notes) {
          if (n.kind === 'task_completed') {
            addToast(`Task completed: ${n.message}`, 'success')
          } else if (n.kind === 'task_failed') {
            addToast(`Task failed: ${n.message}`, 'error')
          } else if (n.kind === 'approval_created') {
            addToast(`🔴 ${n.message}`, 'info')
          } else {
            addToast(n.message, 'info')
          }
        }
      } catch { /* ignore polling errors */ }
    }, 5000)
    return () => {
      if (notifIntervalRef.current) clearInterval(notifIntervalRef.current)
    }
  }, [addToast])

  return { config, viewMode, showSettings, setViewMode: setViewModeWithStorage, setShowSettings, loadConfig, addToast }
}
