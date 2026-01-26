import React, { useState } from 'react';
import { ChevronDownIcon, LightBulbIcon } from '@heroicons/react/20/solid';

const Hint = ({ hints = [] }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="mt-6 border border-gray-800 rounded-lg bg-[#1a1b26]/50 overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 hover:bg-[#2a2d3e] transition-colors"
      >
        <div className="flex items-center gap-2 text-sm font-semibold text-gray-300">
          <LightBulbIcon className="w-5 h-5 text-yellow-500" />
          <span>Hints {hints.length > 0 && <span className="text-gray-500 ml-1">1/{hints.length}</span>}</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-xs text-gray-500 uppercase tracking-widest">
            {isOpen ? 'Hide Hints' : 'Show Hints'}
          </span>
          <ChevronDownIcon 
            className={`w-5 h-5 text-gray-500 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} 
          />
        </div>
      </button>

      {isOpen && (
        <div className="p-4 border-t border-gray-800 bg-[#11121a]">
          <ul className="space-y-3">
            {hints.map((hint, index) => (
              <li key={index} className="flex gap-3 text-sm text-gray-400">
                <span className="text-blue-500 font-bold">{index + 1}</span>
                {hint}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

export default Hint;