import React from 'react';
import { CpuChipIcon, SparklesIcon } from '@heroicons/react/20/solid';

const SessionHeader = ({ title, modelConfigs }) => {
  const getModelForRole = (role) => modelConfigs?.find(m => m.role === role);

  return (
    <div className="h-16 bg-[#11121a] border-b border-gray-800 flex items-center justify-between px-6">
      <div className="flex flex-col">
        <h1 className="text-white font-semibold text-lg">{title || "Untitled Session"}</h1>
        <div className="flex items-center gap-4 mt-0.5">
          {/* Coder Badge */}
          <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-tighter text-gray-500">
            <CpuChipIcon className="w-3 h-3 text-blue-500" />
            <span>Coder: <b className="text-gray-300">{getModelForRole('coder')?.ai_model_details?.model_name || 'None'}</b></span>
          </div>
          {/* Explainer Badge */}
          <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-tighter text-gray-500">
            <SparklesIcon className="w-3 h-3 text-purple-500" />
            <span>Explainer: <b className="text-gray-300">{getModelForRole('explainer')?.ai_model_details?.model_name || 'None'}</b></span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SessionHeader;