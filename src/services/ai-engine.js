// This file will load AI models once, cache them, and expose a clean API to the rest of the app.
// Things this file answeres
// 1. Have the AI model been dowloaded?
// 2. If not loaded, can we load them safely once only
// 3. Can the rest of the app use the AI models?
import * as faceapi from '@vladmandic/face-api'

class AIEngine {
  constructor() {
    this.modelsLoaded = false
    this.loadingPromise = null // This is a real Promise instance
  }

  // ------ Method 1: The only entry for the whole app to load (or check) the ai models 
  async load() {
    // If already loading, return the existing promise (prevents double-loading)
    if (this.loadingPromise){
        return this.loadingPromise
    }

    this.loadingPromise = (async () => {
      try {
        const MODEL_URL = '/models'
        
        // Load only necessary models for your specific use case
        // Promise.all loads them in parallel (faster) so both models will be fetched at the same time
        // First model is Face detection, second model is emotion classification
        await Promise.all([
          faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
          faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL)
        ])

        this.modelsLoaded = true
        console.log("[AIEngine]: Models cached and ready.")

      } catch (error) {
        this.loadingPromise = null; // Reset on failure so we can try again
        console.error("[AIEngine]: Failed to load models:", error);
        throw error;
      }
    })()

    return this.loadingPromise
  }

  // Method 2: Returns if the AI model is alreday loaded or not
  isReady() {
    return this.modelsLoaded
  }
}

// Export a single instance (The Singleton)
const aiEngine = new AIEngine()
export default aiEngine