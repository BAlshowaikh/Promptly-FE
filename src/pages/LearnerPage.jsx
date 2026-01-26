import React, { useState } from 'react';
import TopNav from '../components/layout/TopNav';
import CourseSideBar from '../components/learner/layout/CourseSideBar';
import ExerciseHeader from '../components/learner/exercise/ExerciseHeader';
import Hint from '../components/learner/exercise/Hint';
import CodeEditor from '../components/learner/editor/CodeEditor';
import Terminal from '../components/learner/editor/Terminal';

const LearnerPage = () => {
  // State Management
  const [mode, setMode] = useState('learner');
  const [aiVision, setAiVision] = useState(false);
  const [code, setCode] = useState('function filterEvens(arr) {\n  return arr.filter(num => num % 2 === 0);\n}');
  const [output, setOutput] = useState('');

  // Mock Data (matches your uploaded image)
  const exerciseData = {
    title: "Array Filtering",
    description: "Write a function to filter out even numbers from an array.",
    hints: [
      "The function should use the filter method",
      "The filter condition should check if a number is odd"
    ]
  };

  const handleRunCode = () => {
    setOutput("Running code... \nResult: [1, 3, 5]");
    // Future: This is where you'll call your Django API
  };

  return (
    <div className="flex flex-col h-screen bg-[#0f111a] overflow-hidden">
      {/* 1. Global Navigation */}
      <TopNav 
        mode={mode} 
        setMode={setMode} 
        aiVision={aiVision} 
        setAiVision={setAiVision} 
      />

      <div className="flex flex-1 overflow-hidden">
        {/* 2. Left Sidebar (Course List) */}
        <CourseSideBar />

        {/* 3. Main Content Area */}
        <main className="flex-1 flex flex-col md:flex-row overflow-hidden">
          
          {/* Left Panel: Instructions & Hints */}
          <div className="w-full md:w-[40%] p-8 overflow-y-auto border-r border-gray-800">
            <ExerciseHeader 
              title={exerciseData.title} 
              description={exerciseData.description} 
            />
            <Hint hints={exerciseData.hints} />
          </div>

          {/* Right Panel: Workspace (Editor & Terminal) */}
          <div className="flex-1 flex flex-col p-4 bg-[#0a0b10] gap-4 overflow-hidden">
            <CodeEditor 
              code={code} 
              setCode={setCode} 
              language="javascript" 
              onRun={handleRunCode}
            />
            <Terminal output={output} />
          </div>
        </main>
      </div>

      {/* 4. AI Vision Camera Overlay */}
      {aiVision && (
        <div className="absolute bottom-6 right-6 w-48 h-36 bg-black rounded-xl border-2 border-blue-500 shadow-2xl overflow-hidden z-50 animate-in slide-in-from-bottom-5">
          <div className="absolute top-2 left-2 flex items-center gap-1.5">
            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
            <span className="text-[10px] text-white font-bold uppercase">AI Vision Live</span>
          </div>
          {/* Placeholder for Video Feed */}
          <div className="w-full h-full bg-gray-900 flex items-center justify-center">
            <span className="text-gray-600 text-xs">Camera Loading...</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default LearnerPage;