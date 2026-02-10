import { useState } from 'react'
import { Routes, Route } from "react-router-dom"

import ProtectedRoute from './components/ProtectedRoute'
import Login from './pages/Login'
import Register from './pages/Signup'
import LearnerPage from './pages/LearnerPage'
import DeveloperPage from './pages/DeveloperPage'

const App = () => {
  return (
    <>
      <div className="App">
        <Routes>

        <Route path="/signup" element={<Register />} />
        
          <Route 
            path="/login" 
            element={<Login />}
          />

          <Route 
            path="/learning/languages" 
            element={<ProtectedRoute>
                      <LearnerPage />
                     </ProtectedRoute>}
          />

          {/* 2. Developer Mode Route */}
          <Route 
            path="/developing/sessions" 
            element={
              <ProtectedRoute>
                <DeveloperPage />
              </ProtectedRoute>
            }
          />

          {/* Fallback: Redirect or show a default page which is the login*/}
          <Route path="/" element={<Login />} />
        </Routes>
      </div>
    </>
  )
}

export default App
