import { useState } from 'react'
import LearnerPage from './pages/LearnerPage'
import api from "./services/api"

const App = () => {
  return (
    <>
      <div className="App">
        <LearnerPage />
      </div>
    </>
  )
}

export default App
