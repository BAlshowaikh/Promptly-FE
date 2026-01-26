import React, { useState } from 'react';
import { UserCircleIcon, VideoCameraIcon, VideoCameraSlashIcon } from '@heroicons/react/24/solid';

const TopNav = ({ mode, setMode, aiVision, setAiVision }) => {
  return (
    <>
        <nav className="h-14 bg-[#1a1b26] border-b border-gray-800 flex items-center justify-between px-6 text-gray-300">
        {/* Left: Logo Placeholder */}
        <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center font-bold text-white">
            L
            </div>
            <span className="font-semibold hidden md:block">Promptly</span>
        </div>

        {/* Center: Mode Toggles */}
        <div className="flex bg-[#11121a] p-1 rounded-full border border-gray-700">
            <button
            onClick={() => setMode('learner')}
            className={`px-6 py-1 rounded-full text-sm font-medium transition-all ${
                mode === 'learner' ? 'bg-[#2a2d3e] text-white' : 'text-gray-500 hover:text-gray-300'
            }`}
            >
            Learner
            </button>
            <button
            onClick={() => setMode('developer')}
            className={`px-6 py-1 rounded-full text-sm font-medium transition-all ${
                mode === 'developer' ? 'bg-[#2a2d3e] text-white' : 'text-gray-500 hover:text-gray-300'
            }`}
            >
            Developer
            </button>
        </div>

        {/* Right: Actions & Profile */}
        <div className="flex items-center gap-5">
            <button 
            onClick={() => setAiVision(!aiVision)}
            className={`flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-md border transition-all ${
                aiVision 
                ? 'border-green-500 text-green-500 bg-green-500/10' 
                : 'border-gray-600 text-gray-400 hover:border-gray-400'
            }`}
            >
            {aiVision ? <VideoCameraIcon className="w-4 h-4" /> : <VideoCameraSlashIcon className="w-4 h-4" />}
            AI Vision
            </button>
            
            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 p-0.5 cursor-pointer">
            <img 
                src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" 
                alt="Profile" 
                className="w-full h-full rounded-full bg-[#1a1b26]" 
            />
            </div>
        </div>
        </nav>
    </>
  )
}

export default TopNav