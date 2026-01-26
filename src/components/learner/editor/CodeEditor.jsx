import React from 'react';
import { ChevronRightIcon } from '@heroicons/react/20/solid';

const Terminal = ({ output }) => {
  return (
    <div className="mt-4 bg-[#11121a] border border-gray-800 rounded-lg overflow-hidden flex flex-col min-h-[160px]">
      {/* Terminal Header */}
      <div className="flex items-center px-4 py-2 bg-[#1a1b26] border-b border-gray-800 gap-2">
        <ChevronRightIcon className="w-4 h-4 text-gray-500" />
        <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">
          Output
        </span>
      </div>

      {/* Output Content */}
      <div className="p-4 font-mono text-sm overflow-y-auto max-h-60">
        {output ? (
          <div className="text-gray-300 animate-in fade-in duration-300">
            {output}
          </div>
        ) : (
          <span className="text-gray-600 italic">Output will be shown here...</span>
        )}
      </div>
    </div>
  );
};

export default Terminal;