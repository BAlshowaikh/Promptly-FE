import React, { useState } from 'react';
import { ChevronDownIcon, ChevronRightIcon, PlayIcon } from '@heroicons/react/20/solid';

const CourseSideBar = () => {
  // Mocking the state for now. In the future, this will come from props/Django.
  const [courses, setCourses] = useState([
    {
      id: 'js',
      name: 'JavaScript',
      icon: 'JS', // You can use images here later
      isStarted: true,
      exercises: [
        { id: 1, title: 'Variable Basics' },
        { id: 2, title: 'Array Filtering', active: true },
        { id: 3, title: 'Function Practice' },
        { id: 4, title: 'Object Manipulation' },
      ]
    },
    {
      id: 'py',
      name: 'Python',
      isStarted: false,
    },
    {
      id: 'html',
      name: 'HTML / CSS',
      isStarted: false,
    }
  ]);

  return (
    <div className="w-64 bg-[#1a1b26] border-r border-gray-800 flex flex-col h-full text-gray-400">
      <div className="p-4">
        <h2 className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-4">
          Learning Paths
        </h2>

        <div className="space-y-4">
          {courses.map((course) => (
            <div key={course.id} className="space-y-2">
              {/* Language Header */}
              <div className="flex items-center justify-between group cursor-pointer">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-yellow-400 text-black font-bold text-[10px] flex items-center justify-center rounded">
                    {course.icon || 'PY'}
                  </div>
                  <span className={`font-medium ${course.isStarted ? 'text-white' : 'text-gray-400'}`}>
                    {course.name}
                  </span>
                </div>
                
                {!course.isStarted && (
                  <button className="text-[10px] bg-[#2a2d3e] hover:bg-blue-600 text-white px-2 py-0.5 rounded flex items-center gap-1 transition-colors">
                    <PlayIcon className="w-3 h-3" /> Start
                  </button>
                )}
              </div>

              {/* Exercise List (Only if started) */}
              {course.isStarted && (
                <ul className="ml-4 border-l border-gray-800 space-y-1">
                  {course.exercises?.map((ex) => (
                    <li 
                      key={ex.id}
                      className={`pl-4 py-1.5 text-sm cursor-pointer border-l-2 transition-all ${
                        ex.active 
                        ? 'border-blue-500 text-blue-400 bg-blue-500/5' 
                        : 'border-transparent hover:text-white'
                      }`}
                    >
                      {ex.id}. {ex.title}
                    </li>
                  ))}
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