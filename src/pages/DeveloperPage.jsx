import React, { useEffect, useState, useCallback } from "react"
import TopNav from "../components/layout/TopNav"
import SessionSidebar from "../components/developer/layout/SessionSideBar"
import SessionHeader from "../components/developer/SessionHeader"
import ChatPanel from "../components/developer/ChatPanel"
import api from "../services/api"

const DeveloperPage = () => {
  const [mode, setMode] = useState("developer")

  const [coderMsgs, setCoderMsgs] = useState([])
  const [explainerMsgs, setExplainerMsgs] = useState([])

  const [loading, setLoading] = useState(true)
  const [sessions, setSessions] = useState([])

  const [activeSessionId, setActiveSessionId] = useState(null)
  const [activeSessionDetails, setActiveSessionDetails] = useState(null)
  const [sessionLoading, setSessionLoading] = useState(false)

  /* ------------ Function 1: Fetch user sessions */
  const fetchSessions = useCallback(async () => {
    try {
      // Call the BE
      const response = await api.get("/developing/sessions/")
      setSessions(response.data?.data?.sessions ?? [])
    } catch (error) {
      console.error("Error when fetching the sessions:", error)
      setSessions([])
    } finally {
      setLoading(false)
    }
  }, [])

  /* ------------ Function 2: Fetch session details */
  const fetchSessionDetails = useCallback(async (id) => {
    setSessionLoading(true)
    try {
      const res = await api.get(`/developing/sessions/${id}/`)
      setActiveSessionDetails(res.data?.data ?? null)
    } catch (e) {
      console.error("Failed to fetch session details:", e)
      setActiveSessionDetails(null)
    } finally {
      setSessionLoading(false)
    }
  }, [])

    /* ------------ Function 3: Run prompt (streaming) */
  const runPrompt = async (prompt, role) => {
    if (!activeSessionId) return

    const trimmed = (prompt ?? "").trim()
    if (!trimmed) return

    // 1) Add the user bubble to the SAME panel they ran from
    const userMsg = { output: `**You:** ${trimmed}`, kind: "user" }
    if (role === "coder") setCoderMsgs((prev) => [...prev, userMsg])
    else setExplainerMsgs((prev) => [...prev, userMsg])

    // 2) Prepare endpoint
    const target = role === "explainer" ? "explainer" : "pipeline"
    const url = `/developing/sessions/${activeSessionId}/run/?target=${encodeURIComponent(target)}`

    // 3) Stream via fetch (axios doesn't handle streaming well in browsers)
    try {
      const token = localStorage.getItem("access_token")
      const res = await fetch(`${api.defaults.baseURL}${url}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        credentials: "include",
        body: JSON.stringify({
          prompt: trimmed,
          initiator_role: role,
        }),
      })

      /* Handle errors */
      if (!res.ok) {
        const text = await res.text()
        const errMsg = text || `Request failed (${res.status})`
        const fail = { output: `**Error:** ${errMsg}`, kind: "ai" }
        if (role === "coder") setCoderMsgs((prev) => [...prev, fail])
        else setExplainerMsgs((prev) => [...prev, fail])
        return
      }

      if (!res.body) {
        const fail = { output: "**Error:** No stream body returned", kind: "ai" }
        if (role === "coder") setCoderMsgs((prev) => [...prev, fail])
        else setExplainerMsgs((prev) => [...prev, fail])
        return
      }

      // 4) Read stream chunks (To be displayed in the cat as soon ad the llm sends it)
      const reader = res.body.getReader()
      const decoder = new TextDecoder("utf-8")
      let buffer = ""

      const appendToPanel = (panelRole, delta) => {
        if (!delta) return

        if (panelRole === "coder") {
          setCoderMsgs(prev => {
            const copy = [...prev]
            const last = copy[copy.length - 1]

            if (!last || last.kind !== "ai" || last.streaming !== true) {
              copy.push({ output: delta, kind: "ai", streaming: true })
            } else {
              last.output += delta
            }

            return copy
          })
        }

        if (panelRole === "explainer") {
          setExplainerMsgs(prev => {
            const copy = [...prev]
            const last = copy[copy.length - 1]

            if (!last || last.kind !== "ai" || last.streaming !== true) {
              copy.push({ output: delta, kind: "ai", streaming: true })
            } else {
              last.output += delta
            }

            return copy
          })
        }
      }


      // Streaming
      while (true) {
        const { value, done } = await reader.read()
        if (done) break

        buffer += decoder.decode(value, { stream: true })

        const lines = buffer.split("\n")
        buffer = lines.pop() || ""

        for (const line of lines) {
          const trimmedLine = line.trim()
          if (!trimmedLine) continue

          try {
            const obj = JSON.parse(trimmedLine)

            const delta = obj.text ?? ""
            const chunkRole = obj.sender

            if (!delta) continue

            if (chunkRole === "coder" || chunkRole === "explainer") {
              appendToPanel(chunkRole, delta)
            }

          } catch (err) {
            console.warn("Stream parse error:", err)
          }
        }
      }
    } catch (err) {
        console.warn("Stream parse error:", err)
    }
  }



  // ------ Hook 1: Fetch the initial list of sessions
  // Run only once, immediately after mounting
  useEffect(() => {
    fetchSessions()
  }, [fetchSessions])

  // ---- Hook 2: Fetch the session details once there is an active session
  // Also clear old chats when switching sessions
  useEffect(() => {
    if (!activeSessionId) {
      setActiveSessionDetails(null)
      setCoderMsgs([])
      setExplainerMsgs([])
      return
    }
    fetchSessionDetails(activeSessionId)
  }, [activeSessionId, fetchSessionDetails])

  // ------ Hook 3: Render previous messages (user + AI) in each dedicated window
  useEffect(() => {
    if (!activeSessionDetails) {
      setCoderMsgs([])
      setExplainerMsgs([])
      return
    }

    const { coderMsgs, explainerMsgs } = mapRunsToPanels(activeSessionDetails.runs ?? [])
    setCoderMsgs(coderMsgs)
    setExplainerMsgs(explainerMsgs)
  }, [activeSessionDetails])


  /* ------------ Helper 1: Map session runs to panel messages */
  const mapRunsToPanels = (runs = []) => {
    const coder = []
    const explainer = []

    for (const run of runs) {
      const prompt = (run?.user_prompt ?? "").trim()
      const initiatorRole = run?.initiator_role

      // 1) User prompt goes ONLY to the window where user sent it
      if (prompt && (initiatorRole === "coder" || initiatorRole === "explainer")) {
        const userMsg = { output: `**You:** ${prompt}`, kind: "user", runId: run.id }

        if (initiatorRole === "coder") coder.push(userMsg)
        else explainer.push(userMsg)
      }

      // 2) AI outputs go to their dedicated windows
      const results = Array.isArray(run?.results) ? run.results : []

      for (const r of results) {
        const role = r?.role
        const text = (r?.output ?? "").trim()

        if (!role || !text) continue

        const aiMsg = { output: text, kind: "ai", runId: run.id }

        if (role === "coder") coder.push(aiMsg)
        if (role === "explainer") explainer.push(aiMsg)
      }
    }

    return { coderMsgs: coder, explainerMsgs: explainer }
  }

  if (loading) return <div className="p-4 text-gray-500">Loading...</div>

  return (
    <div className="flex flex-col h-screen bg-[#0f111a] overflow-hidden">
      <TopNav mode={mode} setMode={setMode} />

      <div className="flex flex-1 overflow-hidden">
        <SessionSidebar
          sessions={sessions}
          activeSessionId={activeSessionId}
          onSelectSession={setActiveSessionId}
        />

        <main className="flex-1 flex flex-col bg-[#0a0b10] overflow-hidden">
          {activeSessionDetails ? (
            <>
              <SessionHeader
                title={activeSessionDetails.title}
                modelConfigs={activeSessionDetails.model_configs}
              />

              {/* Dual Pane Layout */}
              <div className="flex-1 flex flex-col md:flex-row p-4 gap-4 overflow-hidden">
                <div className="flex-1 min-w-0">
                  <ChatPanel
                    role="coder"
                    messages={coderMsgs}
                    isStreaming={false}
                    onRun={runPrompt}
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <ChatPanel
                    role="explainer"
                    messages={explainerMsgs}
                    isStreaming={false}
                    onRun={runPrompt}
                  />
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-500 italic text-sm">
              {sessionLoading
                ? "Loading session..."
                : "Select a session from the sidebar to start coding"}
            </div>
          )}
        </main>
      </div>
    </div>
  )
}

export default DeveloperPage
