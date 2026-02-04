// src/components/ui/ProgressBar.jsx
import React from 'react'

const ProgressBar = ({ percentage, showLabel = true, size = "sm" }) => {
  // Ensure percentage stays between 0 and 100
  const validPercentage = Math.min(Math.max(percentage || 0, 0), 100);
  
  const heightClass = size === "sm" ? "h-1" : "h-2.5";

  return (
    <div className="w-full">
      <div className={`w-full ${heightClass} bg-gray-800 rounded-full overflow-hidden flex`}>
        <div 
          className="h-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)] transition-all duration-700 ease-out"
          style={{ width: `${validPercentage}%` }}
        />
      </div>
      
      {showLabel && (
        <div className="flex justify-between mt-1 px-0.5">
          <span className="text-[10px] text-gray-500 font-medium">Progress</span>
          <span className="text-[10px] text-blue-400 font-bold">{Math.round(validPercentage)}%</span>
        </div>
      )}
    </div>
  )
}

export default ProgressBar