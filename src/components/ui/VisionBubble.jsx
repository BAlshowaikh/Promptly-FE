import React from 'react'

const VisionBubble = ({ message }) => {
  if (!message) return null

  return (
    <div className="absolute bottom-full right-0 mb-4 w-56 p-3 bg-blue-600 text-white text-xs rounded-2xl rounded-br-none shadow-xl animate-in fade-in slide-in-from-bottom-2 duration-300">
      <p className="font-medium leading-relaxed">{message}</p>
      
      {/* The little tail of the speech bubble */}
      <div 
        className="absolute -bottom-2 right-0 w-0 h-0 
        border-l-[10px] border-l-transparent 
        border-t-[10px] border-t-blue-600 
        border-r-[0px] border-r-transparent" 
      />
    </div>
  )
}

export default VisionBubble