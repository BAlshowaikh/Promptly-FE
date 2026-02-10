import React, { useState, useMemo } from "react"
import ReactMarkdown from "react-markdown"

const ChatPanel = ({
  role,
  messages,
  isStreaming,
  onRun,
  placeholder,
  runLabel = "Run",
}) => {
  const isCoder = role === "coder"
  const [prompt, setPrompt] = useState("")

  const title = useMemo(() => (isCoder ? "Coder Output" : "Explainer Output"), [isCoder])

  const handleRun = () => {
    const value = prompt.trim()
    if (!value || isStreaming) return
    onRun?.(value, role)
    setPrompt("")
  }

  const onKeyDown = (e) => {
    // Enter to run, Shift+Enter for newline
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleRun()
    }
  }

  const bubbleClasses = (msg) => {
    const isUser = msg?.kind === "user"

    if (isUser) {
      return {
        wrap: "flex justify-end w-full",
        bubble:
          "w-full max-w-[72%] rounded-2xl rounded-br-md px-3 py-2 border border-gray-700 bg-[#0f111a] text-gray-100 shadow-sm",
        meta: "text-[10px] text-gray-500 mt-1 text-right",
      }
    }

    // AI bubble (role-themed)
    const tint = isCoder
      ? "border-blue-900/50 bg-blue-500/10"
      : "border-purple-900/50 bg-purple-500/10"

    return {
      wrap: "flex justify-start w-full",
      bubble: `w-full max-w-[85%] rounded-2xl rounded-bl-md px-3 py-2 border ${tint} text-gray-200 shadow-sm`,
      meta: `text-[10px] mt-1 ${isCoder ? "text-blue-400/70" : "text-purple-400/70"}`,
    }
  }

  return (
    <div className="flex flex-col h-full w-full bg-[#1a1b26] border border-gray-800 rounded-lg overflow-hidden">
      {/* Panel Header */}
      <div className="h-10 flex items-center px-4 border-b border-gray-800 bg-[#11121a] justify-between">
        <span
          className={`text-[10px] font-bold uppercase tracking-widest ${
            isCoder ? "text-blue-400" : "text-purple-400"
          }`}
        >
          {title}
        </span>

        {isStreaming && (
          <div className="flex gap-1">
            <span className="w-1 h-1 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
            <span className="w-1 h-1 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
            <span className="w-1 h-1 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
          </div>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
        {messages.map((msg, idx) => {
          const cls = bubbleClasses(msg)

          return (
            <div
              key={idx}
              className={`${cls.wrap} animate-in fade-in slide-in-from-bottom-2 duration-300`}
            >
              <div className="flex flex-col w-full">
                <div className={cls.bubble}>
                  <div className="text-sm leading-relaxed max-w-none">
                    <ReactMarkdown
                      components={{
                        // inline code (single backticks)
                        code({ inline, children, ...props }) {
                          if (inline) {
                            return (
                              <code
                                className="px-1.5 py-0.5 rounded-md border border-gray-700 bg-black/30 text-gray-100"
                                {...props}
                              >
                                {children}
                              </code>
                            )
                          }

                          // fenced code block
                          return (
                            <pre className="mt-2 overflow-x-auto rounded-lg border border-gray-700 bg-black/30 p-3">
                              <code className="text-gray-100" {...props}>
                                {children}
                              </code>
                            </pre>
                          )
                        },
                        // paragraphs tighter
                        p({ children }) {
                          return <p className="m-0 text-gray-200">{children}</p>
                        },
                      }}
                    >
                      {msg.output}
                    </ReactMarkdown>
                  </div>
                </div>

                {msg?.kind === "user" ? (
                  <div className={cls.meta}>You</div>
                ) : (
                  <div className={cls.meta}>{isCoder ? "Coder" : "Explainer"}</div>
                )}
              </div>
            </div>
          )
        })}

        {messages.length === 0 && !isStreaming && (
          <div className="h-full flex items-center justify-center text-gray-600 text-xs italic">
            Waiting for prompt...
          </div>
        )}
      </div>

      {/* Run Input (inside the panel) */}
      <div className="p-3 bg-[#11121a] border-t border-gray-800">
        <div className="flex gap-2">
          <textarea
            rows={1}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder={
              placeholder || (isCoder ? "Ask the coder to generate/fix code..." : "Ask the explainer to explain...")
            }
            className="flex-1 resize-none bg-[#1a1b26] border border-gray-700 rounded-lg px-3 py-2 text-sm text-gray-100 outline-none focus:border-gray-500"
            disabled={isStreaming}
          />
          <button
            onClick={handleRun}
            disabled={isStreaming || !prompt.trim()}
            className={`px-4 rounded-lg font-bold text-white text-sm ${
              isCoder ? "bg-blue-600 hover:bg-blue-500" : "bg-purple-600 hover:bg-purple-500"
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {runLabel}
          </button>
        </div>

        <div className="mt-2 text-[10px] text-gray-500">
          Enter to run • Shift+Enter for new line
        </div>
      </div>
    </div>
  )
}

export default ChatPanel
