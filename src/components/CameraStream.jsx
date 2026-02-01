// This component will use browser API (camera and turn it into react video element

import React, { useEffect, useRef, useState } from 'react'

const CameraStream = ({onStreamReady}) => {
    const videoRef = useRef(null) // This acts like object {current:null}
    const [streamError, setStreamError] = useState(null)

    // Run when onStreamReady change its status
    useEffect(() => {
        let currentStream = null

        // ----- Mthod 1: Start the camera using the browser api 
        const startCamera = async () => {
            try {
                // 1. Request for a permission and get video stream (This is browser API)
                const stream = await navigator.mediaDevices.getUserMedia({
                    video: {width: 640, height: 480}
                })

                // 2. Attach the stream to the video element
                // On first render → videoRef.current might still be null
                // After React finishes rendering → it becomes the video element
                if (videoRef.current) {
                    // Display the media stream receieved when user clicks okay on webacm instead of a video file
                    videoRef.current.srcObject = stream
                    currentStream = stream
                    // IMPORTANT: small delay 
                    // the video is actually playing before telling the parent.
                    videoRef.current.onloadedmetadata = () => {
                        onStreamReady(videoRef.current)
                    }
                }

                // 3. Tell the parent component that the "pixels" are ready for the AI 
                onStreamReady(videoRef.current) 

            }catch (err) {
                console.error("Webcam access denied:", err)
                setStreamError("Please allow camera access to use this feature.")
            }
        }
        startCamera()

        // CLEANUP: If the user leaves the page, turn off the camera light
        return () => {
            if (currentStream) {
                currentStream.getTracks().forEach(track => track.stop())
                console.log("Camera hardware turned off.")
            }
        }

    }, [onStreamReady])

    if (streamError) return <div className="error-msg">{streamError}</div>;

    return (
        <div className="relative w-full h-full flex items-center justify-center bg-black">
            <video
            ref={videoRef}
            autoPlay
            muted
            playsInline
            className="w-full h-full object-cover" // object-cover fills the box nicely
            style={{ 
                transform: 'scaleX(-1)', // Keeps the mirror effect
            }}
            />
        </div>
    )

}

export default CameraStream