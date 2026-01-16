
import React, { useEffect, useRef, useState } from 'react';

const CameraView: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let stream: MediaStream | null = null;

    const startCamera = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: 'environment', // Prefer back camera
            width: { ideal: 1920 },
            height: { ideal: 1080 }
          },
          audio: false
        });
        
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.error("Camera access denied:", err);
        setError("Please allow camera access to use this app.");
      }
    };

    startCamera();

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  if (error) {
    return (
      <div className="absolute inset-0 bg-neutral-900 flex flex-col items-center justify-center p-8 text-center">
        <p className="text-red-400 mb-4">{error}</p>
        <p className="text-sm text-neutral-500 max-w-xs">
          This app requires camera permission to work as an AR tracing tool.
        </p>
      </div>
    );
  }

  return (
    <div className="absolute inset-0 z-0">
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className="h-full w-full object-cover"
      />
      {/* Vignette Overlay for Depth */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle,transparent_50%,rgba(0,0,0,0.4)_100%)]"></div>
    </div>
  );
};

export default CameraView;
