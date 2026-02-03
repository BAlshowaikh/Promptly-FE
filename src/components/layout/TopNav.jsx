import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import AuthContext from '../../context/AuthContext'

import { UserCircleIcon, VideoCameraIcon, VideoCameraSlashIcon } from '@heroicons/react/24/solid'
import ArrowRightOnRectangleIcon from '@heroicons/react/24/solid/ArrowRightOnRectangleIcon'

const TopNav = ({ mode, setMode, aiVision, setAiVision }) => {
    // Access user and logout function
    const { user, logoutUser } = useContext(AuthContext)
    console.log("Current User Object:", user)

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

        {/* Center: Mode Toggles + Check if there is a user */}
        {user && (
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
        )}

            {/* Right: Actions & Profile */}
            <div className="flex items-center gap-5">
                {user ? (
                    <>
                        {/* AI Vision Toggle */}
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
                        
                        {/* User Display Name */}
                        <div className="hidden lg:flex flex-col items-end leading-none">
                            <span className="text-sm text-white font-medium">{user.username || 'User'}</span>
                            <span className="text-[10px] text-gray-500 uppercase tracking-wider">{mode}</span>
                        </div>

                        {/* Profile Image & Logout wrapper */}
                        <div className="flex items-center gap-3 border-l border-gray-700 pl-5">
                            <button 
                                onClick={logoutUser}
                                className="text-gray-500 hover:text-red-400 transition-colors"
                                title="Logout"
                            >
                                <ArrowRightOnRectangleIcon className="w-6 h-6" />
                            </button>
                        </div>
                    </>
                ) : (
                    <div className="flex gap-4">
                        <Link to="/login" className="text-sm hover:text-white">Login</Link>
                        <Link to="/register" className="text-sm bg-blue-600 px-4 py-1.5 rounded-md text-white hover:bg-blue-700">
                            Get Started
                        </Link>
                    </div>
                )}
            </div>
        </nav>
    </>
  )
}

export default TopNav