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
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <ChatPanel
                    role="explainer"
                    messages={explainerMsgs}
                    isStreaming={false}
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
