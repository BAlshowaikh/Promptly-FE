import React from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';
import { python } from '@codemirror/lang-python';
import { vscodeDark } from '@uiw/codemirror-theme-vscode';

const CodeEditor = ({ code, setCode, language = 'javascript', onRun }) => {
  // Map language strings to CodeMirror extensions
  const extensions = language === 'python' ? [python()] : [javascript()]

  return (
    <div className="flex flex-col flex-1 bg-[#1a1b26] rounded-lg border border-gray-800 overflow-hidden">
      {/* Editor Header / Tab */}
      <div className="h-10 bg-[#11121a] flex items-center justify-between px-4 border-b border-gray-800">
        <span className="text-xs font-mono text-gray-500 uppercase tracking-widest">
          Editor — {language}
        </span>
      </div>

      {/* CodeMirror Instance */}
      <div className="flex-1 text-base overflow-auto">
        <CodeMirror
          value={code}
          height="100%"
          theme={vscodeDark}
          extensions={extensions}
          onChange={(value) => setCode(value)}
          basicSetup={{
            lineNumbers: true,
            foldGutter: true,
            dropCursor: true,
            allowMultipleSelections: false,
            indentOnInput: true,
          }}
        />
      </div>

      {/* Run Action Area */}
      <div className="p-4 bg-[#11121a] border-t border-gray-800 flex justify-end">
        <button
          onClick={onRun}
          className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-2 rounded-md font-semibold text-sm transition-all shadow-lg active:scale-95"
        >
          Run Code
        </button>
      </div>
    </div>
  )
}

export default CodeEditor