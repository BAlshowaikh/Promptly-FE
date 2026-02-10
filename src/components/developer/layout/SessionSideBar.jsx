import React, {useState} from 'react'
import { PlusIcon, ChatBubbleLeftRightIcon, TrashIcon } from '@heroicons/react/20/solid'

import api from '../../../services/api'
import DevSessionModal from '../../modal/DevSessionModal';

const SessionSidebar = ({ sessions, activeSessionId, onSelectSession, onNewSession, onDeleteSession }) => {
  const [showDevSessionModal, setshowDevSessionModal] = useState(false)

  return (
    <div className="w-64 bg-[#1a1b26] border-r border-gray-800 flex flex-col h-full text-gray-400">
      {/* Action Header */}
      <div className="p-4">
        <button 
          onClick={() => setshowDevSessionModal(true)}
          className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white py-2 px-4 rounded-md text-sm font-semibold transition-all active:scale-95"
        >
          <PlusIcon className="w-5 h-5" />
          New Session
        </button>
        <DevSessionModal
            open={showDevSessionModal}
            onClose={() => setshowDevSessionModal(false)}
        />
      </div>

      <div className="flex-1 overflow-y-auto px-2 space-y-1">
        <h2 className="px-3 text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-2">
          Your Sessions
        </h2>
        
        {sessions.map((session) => (
          <div 
            key={session.id}
            onClick={() => onSelectSession(session.id)}
            className={`group flex items-center justify-between p-3 rounded-md cursor-pointer transition-colors ${
              activeSessionId === session.id ? 'bg-[#2a2d3e] text-white' : 'hover:bg-[#2a2d3e]/50 hover:text-gray-200'
            }`}
          >
            <div className="flex items-center gap-3 truncate">
              <ChatBubbleLeftRightIcon className={`w-4 h-4 ${activeSessionId === session.id ? 'text-blue-400' : 'text-gray-500'}`} />
              <span className="text-sm truncate font-medium">{session.title}</span>
            </div>
            
            <button 
              onClick={(e) => { e.stopPropagation(); onDeleteSession(session.id); }}

              className="opacity-0 group-hover:opacity-100 p-1 hover:text-red-400 transition-opacity"
            >
              <TrashIcon className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SessionSidebar;  