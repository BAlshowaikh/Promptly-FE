import React, { useEffect, useState, useRef } from 'react';
import * as faceapi from '@vladmandic/face-api';
import CameraStream from './CameraStream';
import aiEngine from '../services/ai-engine';

const VisionController = ({ onEmotionDetected }) => {
  const [videoElement, setVideoElement] = useState(null)
  const canvasRef = useRef(null)

  useEffect(() => {
    let intervalId = null;

    // ----- Method 1: LOad the ai model by calling the engine -----
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

    // ---- Method 2: Handle the face detection 
    const detect = async () => {
      try {
        if (!videoElement || videoElement.videoWidth === 0) return;

        const result = await faceapi
          .detectSingleFace(videoElement, new faceapi.TinyFaceDetectorOptions())
          .withFaceExpressions();

        const canvas = canvasRef.current;
        if (!canvas) return;

        const displaySize = { width: videoElement.videoWidth, height: videoElement.videoHeight }
        faceapi.matchDimensions(canvas, displaySize);

        if (result) {
          const resizedDetections = faceapi.resizeResults(result, displaySize)
          const ctx = canvas.getContext('2d');
          ctx.clearRect(0, 0, canvas.width, canvas.height)

          // --- MIRROR FIX LOGIC ---
          // We manually flip the canvas context so the drawing matches the mirrored video
          ctx.save(); 
          ctx.scale(-1, 1); // Flip horizontally
          ctx.translate(-canvas.width, 0); // Move back into view

          // Draw the Box (it will be flipped correctly now)
          const drawBox = new faceapi.draw.DrawBox(resizedDetections.detection.box, {
            boxColor: '#3b82f6',
            lineWidth: 3
          });
          drawBox.draw(canvas);
          ctx.restore(); // Restore to NORMAL (non-mirrored) for the text

          // --- TEXT FIX ---
          // Now we calculate the position for the text but draw it UN-FLIPPED
          const topEmotion = Object.entries(result.expressions)
            .reduce((a, b) => (a[1] > b[1] ? a : b))[0];

          // Calculate where the top-left of the box is in "mirrored space"
          const xPos = canvas.width - resizedDetections.detection.box.bottomRight.x;
          const yPos = resizedDetections.detection.box.topLeft.y;

          const textField = new faceapi.draw.DrawTextField(
            [topEmotion.toUpperCase()],
            { x: xPos, y: yPos - 30 }, // Offset upward so it's not inside the box
            {
              backgroundColor: '#3b82f6',
              fontColor: 'white',
              fontSize: 20, // Increased size as requested
              padding: 8
            }
          );
          textField.draw(canvas);

          onEmotionDetected(topEmotion);
        }
      } catch (err) {
        console.error("Detection Error:", err);
      }
    }

        // RUN IMMEDIATELY ONCE (For first scan)
        detect()

        // THEN START INTERVAL (for upcoming scans)
        intervalId = setInterval(detect, 5000) 
      }
    }

    startDetection()

    // CLEANUP: If the user toggles AI Vision OFF, stop the loop!
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [videoElement, onEmotionDetected])

  return (
    <>
      <div className="relative w-full h-full">
      <CameraStream onStreamReady={(video) => setVideoElement(video)} />
      {/* The Canvas sits exactly on top of the video */}
      <canvas 
        ref={canvasRef} 
        className="absolute top-0 left-0 w-full h-full pointer-events-none" 
      />
    </div>
    </>
  )
}

export default VisionController