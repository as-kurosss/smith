import { useState, useCallback } from 'react'
import * as api from '../api'
import type { SessionSummary } from '../types'

export function useSessions() {
  const [sessions, setSessions] = useState<SessionSummary[]>([])
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null)

  const loadSessions = useCallback(async (agentId: string) => {
    try { setSessions(await api.listSessions(agentId)) }
    catch { /* ignore */ }
  }, [])

  return { sessions, currentSessionId, setCurrentSessionId, loadSessions, setSessions }
}
