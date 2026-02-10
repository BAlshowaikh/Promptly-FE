import React from 'react';
import ReactMarkdown from 'react-markdown'; // Highly recommended for AI output

const ChatPanel = ({ role, messages, isStreaming }) => {
  const isCoder = role === 'coder';

  return (
    <div className="flex flex-col h-full bg-[#1a1b26] border border-gray-800 rounded-lg overflow-hidden">
      {/* Panel Tab Header */}
      <div className={`h-10 flex items-center px-4 border-b border-gray-800 bg-[#11121a] justify-between`}>
        <span className={`text-[10px] font-bold uppercase tracking-widest ${isCoder ? 'text-blue-400' : 'text-purple-400'}`}>
          {role} Output
        </span>
        {isStreaming && (
           <div className="flex gap-1">
             <span className="w-1 h-1 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
             <span className="w-1 h-1 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
             <span className="w-1 h-1 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
           </div>
        )}
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6 custom-scrollbar">
        {messages.map((msg, idx) => (
          <div key={idx} className="animate-in fade-in slide-in-from-bottom-2 duration-300">
             {/* We only show the AI response here because the User Prompt is a banner in the parent */}
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
    </div>
  );
};

export default ChatPanel;