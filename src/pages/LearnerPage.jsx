import React, { useState } from 'react'
import TopNav from '../components/layout/TopNav'
import CourseSideBar from '../components/learner/layout/CourseSideBar'
import ExerciseHeader from '../components/learner/exercise/ExerciseHeader'
import Hint from '../components/learner/exercise/Hint'
import CodeEditor from '../components/learner/editor/CodeEditor'
import Terminal from '../components/learner/editor/Terminal'
import VisionController from '../components/VisionController'
import VisionBubble from '../components/ui/VisionBubble'

import api from '../services/api'

const LearnerPage = () => {
  // State Management
  const [mode, setMode] = useState('learner')
  const [aiVision, setAiVision] = useState(false)
  const [bubbleMessage, setBubbleMessage] = useState("")
  const [currentEmotion, setCurrentEmotion] = useState("neutral")

  const [code, setCode] = useState("")
  const [output, setOutput] = useState("")

  // States to hold the detailed exercise data
  const [activeExercise, setActiveExercise] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  // ---- HANDLERS -----

  // ---- Handle 1: 
  const handleRunCode = () => {
    setOutput("Running code... \nResult: [1, 3, 5]");
  }

  // --- Handler 2: Bridge the exercise selection from CourseSidebar to Workspace (Editor and terminal)
  const handleSelectExercise = async (languageSlug, exerciseId) => {
    setIsLoading(true) // Start the loading state for the UI
    try {
      // Fetch details from the backend: prompt, starter_code, hints
      const response = await api.get(`/learn/languages/${languageSlug}/exercises/${exerciseId}`)
      const data = response.data.data

      // Update the main workspace state
      setActiveExercise({
        ...data,
        languageSlug,
        exerciseId
      })

      // Load the exercise's starter code into the editor
      setCode(data.starter_code || "")
      setOutput("") // Reset terminal for a fresh start
    } catch (error) {
      console.error("Failed to load exercise details:", error)
    } finally {
      setIsLoading(false) // Stop loading regardless of success/fail
    }
  }

  // --- Handler 3: Handle the emotion expression for the AI mode
  const handleEmotion = (emotion) => {
    // (For development only) Each emotion has a corresponding message
    const messages = {
      happy: "You're doing great! Keep it up! 🚀",
      sad: "Don't give up, every bug is a lesson. 💡",
      neutral: "Stay focused, you're in the zone. 🧠"
    }

    // Which text to show or just show the emotion name if the const messages  doesn't handle it
    const textToShow = messages[emotion] || `Feeling: ${emotion}`

    // Change the bubble states
    setBubbleMessage(textToShow)

    // Clears the bubble after 6 s
    setTimeout(() => {
        setBubbleMessage("")
      }, 6000)
    }

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
        <CourseSideBar 
          onSelectExercise={handleSelectExercise} 
          activeExerciseId={activeExercise?.exerciseId}
        />

        {/* 3. Main Content Area */}
        <main className="flex-1 flex flex-col md:flex-row overflow-hidden">
          
          {/* Left Panel: Instructions & Hints */}
          <div className="w-full md:w-1/3 p-6 overflow-y-auto border-r border-gray-800">
            {isLoading ? (
              <div className="flex items-center justify-center h-full text-gray-500">Loading exercise...</div>
            ) : activeExercise ? (
              <>
                <ExerciseHeader title={activeExercise.title} prompt={activeExercise.prompt} />
                <Hint hints={activeExercise.hints} />
              </>
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500">Select an exercise to begin</div>
            )}
          </div>

          {/* Right Panel: Workspace (Editor & Terminal) */}
          <div className="flex-1 flex flex-col p-4 bg-[#0a0b10] gap-4 overflow-hidden">
            <CodeEditor 
              code={code} 
              setCode={setCode} 
              language={activeExercise?.languageSlug || "javascript"}
              onRun={handleRunCode}
            />

            <Terminal output={output} />

          </div>
        </main>
      </div>

      {/* 4. AI Vision Camera Overlay */}
      {aiVision && (
        <div className="absolute bottom-6 right-6 w-48 h-auto bg-black rounded-xl border-2 border-blue-500 shadow-2xl overflow-hidden z-50 animate-in slide-in-from-bottom-5">
          <VisionBubble message={bubbleMessage} />

          {/* Header Label */}
          <div className="absolute top-2 left-2 flex items-center gap-1.5 z-10 bg-black/40 px-2 py-0.5 rounded-full">
            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
            <span className="text-[10px] text-white font-bold uppercase tracking-wider">
              AI Vision Live
            </span>
          </div>

          {/* The Logic & Video Feed */}
          <div className="w-full h-full bg-gray-900">
            <VisionController onEmotionDetected={handleEmotion}/>
          </div>

        </div>
      )}
    </div>
  )
}

export default LearnerPage