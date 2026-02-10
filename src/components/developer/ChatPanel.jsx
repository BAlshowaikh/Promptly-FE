import React, { useState, useMemo } from 'react'
import ReactMarkdown from 'react-markdown'; // Highly recommended for AI output

const ChatPanel = ({ role, messages, isStreaming, onRun, placeholder, runLabel = "Run", }) => {
  const isCoder = role === 'coder'
  const [prompt, setPrompt] = useState("")

  const title = useMemo(() => 
    (isCoder ? "Coder Output" : "Explainer Output"), 
  [isCoder])

  const handleRun = () => {
    const value = prompt.trim();
    if (!value || isStreaming) return;
    onRun?.(value, role);
    setPrompt("");
  }

  const onKeyDown = (e) => {
    // Enter to run, Shift+Enter for newline
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleRun();
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
      <div className="flex-1 overflow-y-auto p-4 space-y-6 custom-scrollbar">
        {messages.map((msg, idx) => (
          <div key={idx} className="animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="text-sm text-gray-300 leading-relaxed prose prose-invert max-w-none">
              <ReactMarkdown>{msg.output}</ReactMarkdown>
            </div>
          </div>
        ))}

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
            placeholder={placeholder || (isCoder ? "Ask the coder to generate/fix code..." : "Ask the explainer to explain..." )}
            className="flex-1 resize-none bg-[#1a1b26] border border-gray-700 rounded-lg px-3 py-2 text-sm text-gray-100 outline-none focus:border-gray-500"
            disabled={isStreaming}
          />
          <button
            onClick={handleRun}
            disabled={isStreaming || !prompt.trim()}
            className={`px-4 rounded-lg font-bold text-white text-sm ${
              isCoder ? "bg-blue-600" : "bg-purple-600"
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