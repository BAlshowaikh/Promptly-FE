import React, { useEffect, useState } from 'react';
import * as faceapi from '@vladmandic/face-api';
import CameraStream from './CameraStream';
import aiEngine from '../services/ai-engine';

const VisionController = ({ onEmotionDetected }) => {
  const [videoElement, setVideoElement] = useState(null);

  useEffect(() => {
    let intervalId = null;

    // ----- Method 1: The Loop -----
    const startDetection = async () => {
    // 1. If models aren't ready, wait for the engine to finish loading
      if (!aiEngine.isReady()) {
        console.log("[VisionController]: Brain is sleeping, waiting for models...");
        try {
          await aiEngine.load() //  waits for the Promise to resolve
        } catch (err) {
          console.error("Models failed to load", err)
          return
        }
      }
      // 1. Ensure the video is actually streaming and models are ready
      if (videoElement && aiEngine.isReady()) {

        const detect = async () => {
            try {
            const result = await faceapi
                .detectSingleFace(videoElement, new faceapi.TinyFaceDetectorOptions())
                .withFaceExpressions()

                if (result && result.expressions) {
                  console.log("✅ Face found!", result.expressions);
                    const topEmotion = Object.entries(result.expressions)
                    .reduce((a, b) => (a[1] > b[1] ? a : b))[0]
                    onEmotionDetected(topEmotion)
                } else {
                  console.log("❓ No face detected in this frame."); // <--- Add this
                }
            } catch (err) {
                console.error("Detection Error:", err)
            }
        }

        // RUN IMMEDIATELY ONCE (For first scan)
        detect()

        // THEN START INTERVAL (for upcoming scans)
        intervalId = setInterval(detect, 15000) 
      }
    }

    startDetection();

    // CLEANUP: If the user toggles AI Vision OFF, stop the loop!
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [videoElement, onEmotionDetected]);

  return (
    <>
      <CameraStream onStreamReady={(video) => setVideoElement(video)} />
    </>
  )
}

export default VisionController