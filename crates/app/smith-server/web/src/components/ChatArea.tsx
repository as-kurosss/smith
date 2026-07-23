import { useState, useRef, useEffect, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { chatNonStreaming, getSession } from '../api'
import type { ChatMessage } from '../types'

interface Props {
  agentId: string
  sessionId: string | null
  messages: ChatMessage[]
  onMessagesChange: (msgs: ChatMessage[]) => void
  onSessionChange: (sessionId: string) => void
  addToast: (msg: string, type?: 'error' | 'success' | 'info') => void
}

export function ChatArea({ agentId, sessionId, messages, onMessagesChange, onSessionChange, addToast }: Props) {
  const [input, setInput] = useState('')
  const [streaming, setStreaming] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [expandedReasoning, setExpandedReasoning] = useState<number | null>(null)
  const [messageQueue, setMessageQueue] = useState<string[]>([])
  const chatRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const eventSourceRef = useRef<EventSource | null>(null)
  const processingRef = useRef(false)
  const queueRef = useRef<string[]>([])

  // Cleanup EventSource on unmount
  useEffect(() => {
    return () => {
      eventSourceRef.current?.close()
      eventSourceRef.current = null
    }
  }, [])

  // Auto-scroll
  useEffect(() => {
    if (chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight
  }, [messages])

  // Load session messages from server ONLY when switching to an existing session
  // (messages are empty on switch).  DO NOT reload when sessionId changes due to
  // onSessionChange mid-conversation — the server may not have saved yet,
  // causing stale data to overwrite the current conversation.
  useEffect(() => {
    if (sessionId && messages.length === 0) {
      getSession(sessionId).then(s => {
        onMessagesChange(s.messages)
      }).catch(() => {})
    }
  }, [sessionId]) // eslint-disable-line

  // Focus input
  useEffect(() => {
    if (!streaming) inputRef.current?.focus()
  }, [streaming])

  // Queue a message to be sent after current stream finishes, or send immediately
  const sendMessage = useCallback(async (textOverride?: string) => {
    const text = (textOverride ?? input).trim()
    if (!text) return

    if (streaming || processingRef.current) {
      // Stream in progress — queue this message
      queueRef.current = [...queueRef.current, text]
      setMessageQueue([...queueRef.current])
      setInput('')
      addToast('Message queued — will send after current response completes', 'info')
      return
    }

    setInput('')
    await doSendMessage(text)
  }, [input, streaming, addToast])

  const processNextInQueue = useCallback(() => {
    processingRef.current = false
    queueRef.current = queueRef.current.slice(1)
    setMessageQueue([...queueRef.current])
    if (queueRef.current.length > 0) {
      const nextText = queueRef.current[0]
      processingRef.current = true
      doSendMessage(nextText)
    }
  }, []) // eslint-disable-line

  const doSendMessage = useCallback(async (text: string) => {
    processingRef.current = true
    setIsLoading(true)

    // Add user message
    const userMsg: ChatMessage = { role: 'user', content: text }
    const updatedMessages = [...messages, userMsg]
    onMessagesChange(updatedMessages)

    // Try streaming first
    const streamUrl = `/api/agents/${agentId}/chat/stream?message=${encodeURIComponent(text)}${sessionId ? `&session_id=${encodeURIComponent(sessionId)}` : ''}`

    // Close any previous EventSource (safety)
    eventSourceRef.current?.close()
    const es = new EventSource(streamUrl)
    eventSourceRef.current = es
    let currentSession = sessionId || ''
    let assistantContent = ''
    let reasoningContent = ''
    let toolCalls: { id: string; name: string; }[] = []
    let done = false

    // Add a placeholder for the assistant response
    const assistantIndex = updatedMessages.length
    const placeholderMsg: ChatMessage = { role: 'assistant', content: '' }
    onMessagesChange([...updatedMessages, placeholderMsg])
    setStreaming(true)
    setIsLoading(false)

    es.addEventListener('token', (e: MessageEvent) => {
      assistantContent += e.data
      const msgs = [...updatedMessages]
      msgs[assistantIndex] = { role: 'assistant', content: assistantContent, tool_calls: toolCalls.length > 0 ? toolCalls.map(tc => ({ id: tc.id, name: tc.name, arguments: null })) : null }
      onMessagesChange(msgs)
    })

    es.addEventListener('tool_call_start', (e: MessageEvent) => {
      try {
        const data = JSON.parse(e.data)
        toolCalls = [...toolCalls, { id: data.id, name: data.name }]
        const msgs = [...updatedMessages]
        msgs[assistantIndex] = {
          role: 'assistant',
          content: assistantContent,
          tool_calls: toolCalls.map(tc => ({ id: tc.id, name: tc.name, arguments: null })),
        }
        onMessagesChange(msgs)
      } catch { /* ignore parse errors */ }
    })

    es.addEventListener('tool_call_end', () => {
      // Tool call completed — the next tokens will follow
    })

    es.addEventListener('reasoning', (e: MessageEvent) => {
      reasoningContent += e.data
      // Update the assistant message in-place with partial reasoning content
      const msgs = [...updatedMessages]
      msgs[assistantIndex] = {
        ...msgs[assistantIndex],
        reasoning_content: reasoningContent,
      }
      onMessagesChange(msgs)
    })

    es.addEventListener('session_id', (e: MessageEvent) => {
      // Store session id but DON'T update parent yet —
      // doing so would change currentSessionId → remount ChatArea mid-stream.
      currentSession = e.data
    })

    const finishStream = (saveSession: boolean) => {
      done = true
      es.close()
      eventSourceRef.current = null
      setStreaming(false)
      // Update with final content
      const msgs = [...updatedMessages]
      const finalContent = assistantContent.trim()
      msgs[assistantIndex] = {
        role: 'assistant',
        content: finalContent || null,
        reasoning_content: reasoningContent || null,
        tool_calls: toolCalls.length > 0 ? toolCalls.map(tc => ({ id: tc.id, name: tc.name, arguments: null })) : null,
      }
      onMessagesChange(msgs)
      // Only tell parent about session id on success
      if (saveSession && currentSession) onSessionChange(currentSession)
      // Process next message in queue
      setTimeout(() => processNextInQueue(), 100)
    }

    es.addEventListener('done', () => {
      finishStream(true)
    })

    es.addEventListener('error', () => {
      if (done) return
      // Close EventSource FIRST to prevent auto-reconnect,
      // which would create a second identical request on the server.
      es.close()
      eventSourceRef.current = null
      setStreaming(false)
      // Don't finishStream/fallback immediately — the `done` event might be
      // queued behind this `error` event in the JS event loop (browsers can
      // dispatch `error` from connection-close before the `done` event from
      // the last received SSE data is dispatched).
      // Wait 1.5s for `done` to arrive; if it does, `done` handler sets UI.
      // If not, this was a genuine error and we fallback.
      setTimeout(() => {
        if (done) return
        finishStream(false)
        // Save the streaming session (may differ from prop if server assigned a new one)
        if (currentSession) onSessionChange(currentSession)
        const sid = sessionId || ''
        fallbackToNonStreaming(text, sid, updatedMessages)
      }, 1500)
    })

    // Timeout safety — if no events within 30s, fallback
    const timeoutId = setTimeout(() => {
      if (!done) {
        es.close()
        eventSourceRef.current = null
        setStreaming(false)
        // Use original prop sessionId, not streaming-created currentSession
        const sid = sessionId || ''
        fallbackToNonStreaming(text, sid, updatedMessages)
      }
    }, 30000)

    es.addEventListener('done', () => clearTimeout(timeoutId), { once: true })
  }, [messages, agentId, sessionId, onMessagesChange, onSessionChange, addToast])

  const fallbackToNonStreaming = async (text: string, sid: string, currentMessages: ChatMessage[]) => {
    processingRef.current = false
    try {
      const result = await chatNonStreaming(agentId, text, sid || null)
      // Append — DO NOT replace the last element of currentMessages, because
      // currentMessages (updatedMessages) ends with the user message, not the
      // placeholder. Replacing .length-1 would silently delete the user message.
      const finalMsgs = [...currentMessages, { role: 'assistant', content: result.message }]
      onMessagesChange(finalMsgs)
      onSessionChange(result.session_id)
    } catch (e: any) {
      addToast(e.message)
      // DON'T remove the assistant response — finishStream(false) already saved
      // the streamed content (even if partial). Calling onMessagesChange(currentMessages)
      // would erase what was already streamed and shown in the UI.
    }
    setTimeout(() => processNextInQueue(), 100)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const userLabel = (i: number) => (
    <div className="flex items-center gap-3 self-end max-w-[80%] animate-fade-in-up" style={{ animationDelay: `${Math.min(i * 30, 200)}ms` }}>
      <div className="px-6 py-4 rounded-2xl text-body-sm leading-relaxed whitespace-pre-wrap break-words bg-sage-teal/10 text-graphite">
        {messages[i].content}
      </div>
      <div className="w-8 h-8 rounded-full shrink-0 flex items-center justify-center bg-sage-teal text-white text-body-sm font-semibold">U</div>
    </div>
  )

  const assistantLabel = (i: number) => {
    const msg = messages[i]
    const isLast = i === messages.length - 1
    const isStreamingAssistant = streaming && isLast
    const isReasoningExpanded = expandedReasoning === i
    return (
      <div key={i} className={`flex items-start gap-3 animate-fade-in-up${isStreamingAssistant ? ' border-l-2 border-sage-teal pl-3' : ''}`} style={{ animationDelay: `${Math.min(i * 30, 200)}ms` }}>
        <div className="w-8 h-8 rounded-full shrink-0 flex items-center justify-center bg-white border border-sage-cloud text-caption">🤖</div>
        <div className={`flex-1 min-w-0 px-6 py-4 rounded-2xl text-body-sm leading-relaxed whitespace-pre-wrap break-words bg-white border text-graphite ${isStreamingAssistant ? 'border-sage-teal/40' : 'border-sage-cloud'}`}>
          {msg.reasoning_content && (
            <div className="mb-2">
              <div
                className="flex items-center gap-1.5 text-caption text-slate cursor-pointer select-none py-1 px-2 rounded-lg hover:bg-sage-veil transition-colors"
                onClick={() => setExpandedReasoning(isReasoningExpanded ? null : i)}
              >
                <span className="text-[10px]">{isReasoningExpanded ? '▼' : '▶'}</span>
                <span>Thinking</span>
                <span className="w-1 h-1 rounded-full bg-slate" />
                <span className="text-fog">expanded{isReasoningExpanded ? '' : ' ↕'}</span>
              </div>
              {isReasoningExpanded && (
                <div className="mt-1 text-caption text-slate leading-relaxed border-t border-sage-cloud pt-2">{msg.reasoning_content}</div>
              )}
            </div>
          )}
          {msg.content || ''}
          {msg.tool_calls && msg.tool_calls.length > 0 && (
            <div className="mt-2 pt-2 border-t border-sage-cloud flex flex-wrap gap-1.5">
              {msg.tool_calls.map((tc, j) => (
                <span key={j} className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-sage-veil text-slate inline-flex items-center gap-1">
                  <span>🔧</span> {tc.name}
                </span>
              ))}
            </div>
          )}
          {isStreamingAssistant && !msg.content && !msg.tool_calls?.length && (
            <span className="animate-typing">▍</span>
          )}
          {!isStreamingAssistant && isLast && !msg.content && !msg.tool_calls?.length && !msg.reasoning_content && (
            <div className="text-caption text-slate text-center italic py-2">
              The agent returned an empty response. Try rephrasing your message or check provider settings.
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="flex-1 overflow-y-auto px-6 sm:px-8 py-6 flex flex-col gap-5" ref={chatRef}>
        {messages.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center text-3xl mb-4">💬</div>
            <h3 className="text-body font-semibold text-graphite mb-1">Start a conversation</h3>
            <p className="text-body-sm text-slate">Type a message below to chat with this agent.</p>
          </div>
        ) : (
          messages.map((msg, i) => {
            if (msg.role === 'user') return userLabel(i)
            if (msg.role === 'assistant') return assistantLabel(i)
            if (msg.role === 'system') {
              return <div key={i} className="max-w-[80%] px-4 py-3 rounded-xl text-body-sm leading-relaxed whitespace-pre-wrap break-words self-center text-slate italic bg-sage-veil animate-fade-in">{msg.content}</div>
            }
            if (msg.role === 'tool') {
              return (
                <div key={i} className="max-w-[90%] px-4 py-3 rounded-xl text-caption text-slate self-center border border-sage-cloud bg-white animate-fade-in">
                  <strong className="text-body-sm text-carbon">{msg.name || 'tool'}</strong>
                  {msg.content && <pre className="text-caption mt-2 p-2 bg-sage-veil rounded-lg overflow-x-auto">{msg.content}</pre>}
                </div>
              )
            }
            return null
          })
        )}
        {isLoading && !streaming && (
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full shrink-0 flex items-center justify-center bg-white border border-sage-cloud text-caption">🤖</div>
            <div className="px-5 py-4 rounded-2xl bg-white border border-sage-cloud text-graphite text-body-sm animate-pulse-soft">…</div>
          </div>
        )}
      </div>

      <div className="px-8 py-5 border-t border-sage-cloud flex gap-4 bg-sage-paper relative">
        {messageQueue.length > 0 && (
          <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-amber-100 text-amber-700 text-caption font-medium">
            {messageQueue.length} queued
          </div>
        )}
        <Input
          ref={inputRef}
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={streaming ? 'Streaming in progress...' : 'Type a message...'}
          disabled={false}
          className="flex-1 h-auto py-3 px-4 rounded-xl border-sage-cloud bg-white"
        />
        <Button className="h-auto py-3 px-5 shrink-0 rounded-xl" onClick={() => sendMessage()} disabled={!input.trim()}>
          {streaming ? 'Queue' : 'Send'}
        </Button>
      </div>
    </>
  )
}
