import React, { useState } from 'react'
import TopNav from '../components/layout/TopNav'
import SessionSidebar from '../components/developer/layout/SessionSideBar'
import SessionHeader from '../components/developer/SessionHeader'
import ChatPanel from '../components/developer/ChatPanel'

const DeveloperPage = () => {
  const [mode, setMode] = useState('developer');
  const [activeSession, setActiveSession] = useState(null);

  const [coderMsgs, setCoderMsgs] = useState([]);
  const [explainerMsgs, setExplainerMsgs] = useState([]);
  const [streamingRole, setStreamingRole] = useState(null); // "coder" | "explainer" | null

  // Mock data for UI testing
  const mockSessions = [
    { id: 1, title: "Python Backend Debugging" },
    { id: 2, title: "React Performance Audit" }
  ]

    const handleRun = async (prompt, role) => {
    // UI demo: add placeholder output.
    setStreamingRole(role)

    setTimeout(() => {
      const out = `**${role.toUpperCase()}** received:\n\n${prompt}`;
      if (role === "coder") setCoderMsgs((prev) => [...prev, { output: out }]);
      else setExplainerMsgs((prev) => [...prev, { output: out }]);
      setStreamingRole(null);
    }, 400);
  }

  return (
    <div className="flex flex-col h-screen bg-[#0f111a] overflow-hidden">
      <TopNav mode={mode} setMode={setMode} />

      <div className="flex flex-1 overflow-hidden">
        <SessionSidebar
          sessions={mockSessions}
          activeSessionId={activeSession?.id}
          onSelectSession={(id) => setActiveSession(mockSessions.find((s) => s.id === id))}
        />

        <main className="flex-1 flex flex-col bg-[#0a0b10] overflow-hidden">
          {activeSession ? (
            <>
              <SessionHeader title={activeSession.title} />

              {/* Dual Pane Layout */}
              <div className="flex-1 flex flex-col md:flex-row p-4 gap-4 overflow-hidden">
                <div className="flex-1 min-w-0">
                  <ChatPanel
                    role="coder"
                    messages={coderMsgs}
                    isStreaming={streamingRole === "coder"}
                    onRun={handleRun}
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <ChatPanel
                    role="explainer"
                    messages={explainerMsgs}
                    isStreaming={streamingRole === "explainer"}
                    onRun={handleRun}
                  />
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-500 italic text-sm">
              Select a session from the sidebar to start coding
            </div>
          )}
        </main>
      </div>
    </div>
  )
}

export default DeveloperPage