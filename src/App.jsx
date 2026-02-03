import { useState } from 'react'
import { Routes, Route } from "react-router-dom"

import ProtectedRoute from './components/ProtectedRoute'
import Login from './pages/Login'
import Register from './pages/Signup'
import LearnerPage from './pages/LearnerPage'

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

          {/* Fallback: Redirect or show a default page which is the login*/}
          <Route path="/" element={<Login />} />
        </Routes>
      </div>
    </>
  )
}

export default App
