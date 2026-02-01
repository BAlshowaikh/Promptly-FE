import { useState, useEffect } from 'react'
import aiEngine from '../services/aiEngine'

// Initilize the custom hook
const useAILoader = () => {
    const [status, setStatus] = useState(
        // On first render call the isReady funcion (returns either true or false)
        // If true set the status to ready otherwise loading
        aiEngine.isReady() ? "ready" : "idle"
    )

    const [error, setError] = useState(null)

    // Load models once component mount only
    useEffect(() => {
        // If the models are alreday loaded just return
        if (aiEngine.isReady()){
            return
        }

        // Elese, call the function to load the models
        setStatus("loading")
        aiEngine.load() // this will trigger the actual load, return the laodingPromise
        .then(() => setStatus("ready")) // After a sucessful loading, change the status
        .catch((err) => { // Eles catch the errors and change the status to error
            setError(err)
            setStatus("error")
        })
        
    }, [])

    return { 
        isReady: status === "ready",
        status,
        error
    }
}