import React, { useEffect, useState } from 'react'
import api from '../../../services/api'
import { ChevronDownIcon, ChevronRightIcon, PlayIcon } from '@heroicons/react/20/solid'


const CourseSideBar = ({onSelectExercise, activeExerciseId}) => {
  const [languages, setLanguages] = useState([])
  // Track which language is open
  const [expandedLang, setExpandedLang] = useState(null)
  // Stores exercises by language slug ({ javascript: [...], python: [...] })
  const [exercises, setExercises] = useState({})
  const [loading, setLoading] = useState(true)

  // ------ Function 1: Fetch the initail list of languages
  // Run only once, immediatly after mounting
  useEffect(() => {
    const fetchLanguages = async () => {
      try{
        // Call the BE endpoint
        const response = await api.get("/learn/languages")
        // Access the .data property from JSON structure
        setLanguages(response.data.data || [])
      } catch (error){
        console.error("Error when fetching the langauges:", error)
      } finally {
        setLoading(false) // In all cases the loading spinner should dissapear
      }
    }
    fetchLanguages()
  }, [])

  // ------ Function 2: Fetch exercises for a specific language
  const toggleLanguage = async (slug) => {
    // If lang already expanded, close it
    if (expandedLang === slug) {
      setExpandedLang(null)
      return
    }

    // ALWAYS set the expanded language to the one clicked
    setExpandedLang(slug)

    // Fetch from the BE only if there is no object in exercise with the requird language
    if (!exercises[slug]){
      try{
        const response = await api.get(`/learn/languages/${slug}/exercises`)
        // Update the list of chached exercise wihout losing prev data
        setExercises(prev => ({...prev, [slug]: response.data.data || []}))
      } catch (error) {
        console.error("Error when fetching exercises:", error);
      }
    }
  }

  // ------ Function 3: When user clicks start button
  const handleStartPath = async (e, slug) => {
    e.stopPropagation() // Stop the accordion from toggling when we click Start
    
    try {
      // Tell Django to create the LearningProgress record
      const response = await api.post('/learn/progress/', { 
        language_slug: slug 
      })

      if (response.data.success) {
        // Update the local state to "Unlock" the UI
        setLanguages(prev => prev.map(lang => 
          lang.slug === slug ? { ...lang, is_started: true } : lang
        ))
        // Open the language accordion immediately
        await toggleLanguage(slug)
      }
    } catch (error) {
      console.error("Error starting path:", error);
      alert("Make sure you are logged into Django Admin or check your console!");
    }
}

  if (loading) return <div className="p-4 text-gray-500">Loading...</div>

  return (
      <div className="w-64 bg-[#1a1b26] border-r border-gray-800 flex flex-col h-full text-gray-400 overflow-y-auto">
        <div className="p-4">
          <h2 className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-4">Learning Paths</h2>

          <div className="space-y-4">
            {languages.map((lang) => (
              <div key={lang.slug} className="space-y-2">
                {/* Language Item Header */}
                <div 
                  onClick={() => toggleLanguage(lang.slug)}
                  className="flex items-center justify-between group cursor-pointer hover:text-white transition-colors"
                >
                  <div className="flex items-center gap-2">
                    {expandedLang === lang.slug ? 
                      <ChevronDownIcon className="w-4 h-4" /> : 
                      <ChevronRightIcon className="w-4 h-4" />
                    }
                    <span className={`font-medium ${expandedLang === lang.slug ? 'text-white' : ''}`}>
                      {lang.name}
                    </span>
                  </div>
                  
                  {!lang.is_started && (
                    <button 
                      className="text-[10px] bg-[#2a2d3e] text-white px-2 py-0.5 rounded"
                      onClick={(e) => handleStartPath(e, lang.slug)}
                      >
                        Start
                    </button>
                  )}
                  
                </div>

                {/* Exercises List (Rendered if expanded) */}
                {expandedLang === lang.slug && (
                  <ul className="ml-4 border-l border-gray-800 space-y-1 animate-in slide-in-from-top-1 duration-200">
                    {exercises[lang.slug]?.map((ex, index) => (
                      <li 
                        key={ex.id}
                        onClick={() => onSelectExercise(lang.slug, ex.id)} // Call the parent function to handle exercise selection
                        className={`pl-4 py-1.5 text-sm cursor-pointer transition-all ${
                                  activeExerciseId === ex.id ? 'text-blue-400 border-l-2 border-blue-500 bg-[#2a2d3e]' : 'hover:text-blue-400'
                                  }`}
                      >
                        {/* Display numbered list */}
                        {index + 1}. {ex.title} 
                      </li>
                    ))}
                    {!exercises[lang.slug] && <li className="pl-4 text-xs italic text-gray-600">Loading exercises...</li>}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    )
}

export default CourseSideBar