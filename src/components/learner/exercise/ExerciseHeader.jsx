import React from 'react';

const ExerciseHeader = ({ title, prompt }) => {
  return (
    /* Rendering the data from the JSON/API */
    <div className="mb-6">
      <h1 className="text-3xl font-bold text-white mb-4 tracking-tight">
        {title}
      </h1>
      <p className="text-gray-400 text-lg leading-relaxed">
        {prompt}
      </p>
    </div>
  );
};

export default ExerciseHeader;