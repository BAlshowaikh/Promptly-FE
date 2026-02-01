import React, { useEffect, useState } from 'react';
import * as faceapi from '@vladmandic/face-api';
import CameraStream from './CameraStream';
import aiEngine from '../services/ai-engine';

const VisionController = ({ onEmotionDetected }) => {
  const [videoElement, setVideoElement] = useState(null);

  useEffect(() => {
    let intervalId = null;

    // ----- Method 1: The Heartbeat Loop -----
    const startDetection = async () => {
      // 1. Ensure the video is actually streaming and models are ready
      if (videoElement && aiEngine.isReady()) {
        
        // 2. Run a repeated loop every 600ms (balanced for speed & battery)
        intervalId = setInterval(async () => {
          try {
            // 3. Ask the AI: "Find the face and tell me the emotion"
            // We use TinyFaceDetectorOptions for maximum speed
            const result = await faceapi
              .detectSingleFace(videoElement, new faceapi.TinyFaceDetectorOptions())
              .withFaceExpressions();

            if (result && result.expressions) {
              // 4. Sort expressions to find the one with the highest confidence
              const topEmotion = Object.entries(result.expressions)
                .reduce((a, b) => (a[1] > b[1] ? a : b))[0];

              // 5. Send the result back to the Parent (TopNav or App)
              onEmotionDetected(topEmotion);
            }
          } catch (err) {
            console.error("Detection Error:", err);
          }
        }, 600); 
      }
    };

    startDetection();

    // CLEANUP: If the user toggles AI Vision OFF, stop the loop!
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [videoElement, onEmotionDetected]);

  return (
    <div className="bottom-4 right-4 z-50">
      {/* Step 2's component provides the "Eye" */}
      <CameraStream onStreamReady={(video) => setVideoElement(video)} />
    </div>
  );
};

export default VisionController;