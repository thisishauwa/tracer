
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { 
  Camera, 
  Upload, 
  Maximize, 
  RotateCw, 
  Lock, 
  Unlock, 
  Eye, 
  EyeOff, 
  Layers, 
  SlidersHorizontal,
  Eraser,
  RefreshCw,
  Info
} from 'lucide-react';
import CameraView from './components/CameraView';
import TraceOverlay from './components/TraceOverlay';
import ControlPanel from './components/ControlPanel';
import { generateOutlines } from './services/imageProcessor';

const App: React.FC = () => {
  const [image, setImage] = useState<string | null>(null);
  const [outlineImage, setOutlineImage] = useState<string | null>(null);
  const [isOutlineMode, setIsOutlineMode] = useState(false);
  const [opacity, setOpacity] = useState(0.5);
  const [scale, setScale] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isLocked, setIsLocked] = useState(false);
  const [isFlipped, setIsFlipped] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [showTutorial, setShowTutorial] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // Check if this is the first time the user is visiting
  useEffect(() => {
    const hasVisited = localStorage.getItem('tracevision-has-visited');
    if (!hasVisited) {
      setShowTutorial(true);
    }
  }, []);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = async (event) => {
        const dataUrl = event.target?.result as string;
        setImage(dataUrl);
        setIsProcessing(true);
        try {
          const outline = await generateOutlines(dataUrl);
          setOutlineImage(outline);
        } catch (err) {
          console.error("Failed to generate outlines:", err);
        } finally {
          setIsProcessing(false);
        }
        setShowTutorial(false);
        localStorage.setItem('tracevision-has-visited', 'true');
        // Reset transform state for new image
        setPosition({ x: 0, y: 0 });
        setScale(1);
        setRotation(0);
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerUpload = () => {
    fileInputRef.current?.click();
  };

  const resetOverlay = () => {
    setPosition({ x: 0, y: 0 });
    setScale(1);
    setRotation(0);
  };

  return (
    <div className="relative h-screen w-screen overflow-hidden bg-black flex flex-col items-center justify-center">
      {/* Background Camera Layer */}
      <CameraView />

      {/* Trace Overlay Layer */}
      {image && (
        <TraceOverlay 
          src={isOutlineMode ? (outlineImage || image) : image}
          opacity={opacity}
          scale={scale}
          rotation={rotation}
          position={position}
          onPositionChange={setPosition}
          isLocked={isLocked}
          isFlipped={isFlipped}
        />
      )}

      {/* Floating UI Elements */}
      <div className="absolute top-4 left-4 right-4 flex justify-between items-start pointer-events-none">
        <div className="flex flex-col gap-2">
          <button 
            onClick={triggerUpload}
            className="pointer-events-auto flex items-center gap-2 bg-white/10 backdrop-blur-md hover:bg-white/20 text-white px-4 py-2 rounded-full border border-white/20 transition-all shadow-xl"
          >
            <Upload size={18} />
            <span className="text-sm font-medium">{image ? "Change Image" : "Choose Image"}</span>
          </button>
          
          {image && (
            <button 
              onClick={() => setIsLocked(!isLocked)}
              className={`pointer-events-auto flex items-center justify-center w-10 h-10 rounded-full backdrop-blur-md border border-white/20 transition-all shadow-xl ${isLocked ? 'bg-red-500/80' : 'bg-white/10 hover:bg-white/20'}`}
            >
              {isLocked ? <Lock size={20} /> : <Unlock size={20} />}
            </button>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <button 
            onClick={() => setShowControls(!showControls)}
            className="pointer-events-auto flex items-center justify-center w-10 h-10 bg-white/10 backdrop-blur-md hover:bg-white/20 text-white rounded-full border border-white/20 transition-all shadow-xl"
          >
            {showControls ? <Eye size={20} /> : <EyeOff size={20} />}
          </button>
          <button 
            onClick={() => setShowTutorial(true)}
            className="pointer-events-auto flex items-center justify-center w-10 h-10 bg-white/10 backdrop-blur-md hover:bg-white/20 text-white rounded-full border border-white/20 transition-all shadow-xl"
          >
            <Info size={20} />
          </button>
        </div>
      </div>

      {/* Control Panel (Bottom) */}
      {image && showControls && (
        <ControlPanel 
          opacity={opacity}
          setOpacity={setOpacity}
          scale={scale}
          setScale={setScale}
          rotation={rotation}
          setRotation={setRotation}
          isOutlineMode={isOutlineMode}
          setIsOutlineMode={setIsOutlineMode}
          isFlipped={isFlipped}
          setIsFlipped={setIsFlipped}
          onReset={resetOverlay}
          isProcessing={isProcessing}
        />
      )}

      {/* Hidden File Input */}
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileUpload} 
        accept="image/*" 
        className="hidden" 
      />

      {/* Tutorial / Landing State */}
      {!image && showTutorial && (
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-6 z-50">
          <div className="bg-neutral-900 border border-neutral-800 p-8 rounded-3xl max-w-md w-full shadow-2xl">
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 bg-blue-500 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/20 rotate-3">
                <Camera className="text-white" size={32} />
              </div>
            </div>
            <h1 className="text-2xl font-bold text-center mb-2">Welcome to TraceVision</h1>
            <p className="text-neutral-400 text-center mb-8">
              Transform your phone into a professional AR projector. Upload an image, align it on your paper, and start tracing.
            </p>
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="bg-neutral-800 p-2 rounded-lg">
                  <Upload size={20} className="text-blue-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-sm">Upload & Align</h3>
                  <p className="text-xs text-neutral-500">Pick any photo from your gallery and position it.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="bg-neutral-800 p-2 rounded-lg">
                  <Layers size={20} className="text-purple-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-sm">Outline Mode</h3>
                  <p className="text-xs text-neutral-500">Extract contours automatically for easier tracing.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="bg-neutral-800 p-2 rounded-lg">
                  <Lock size={20} className="text-green-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-sm">Lock Transform</h3>
                  <p className="text-xs text-neutral-500">Lock the position so you can draw without distractions.</p>
                </div>
              </div>
            </div>
            <button 
              onClick={() => {
                localStorage.setItem('tracevision-has-visited', 'true');
                triggerUpload();
              }}
              className="w-full mt-8 bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 rounded-xl transition-all"
            >
              Get Started
            </button>
            <button 
              onClick={() => {
                localStorage.setItem('tracevision-has-visited', 'true');
                setShowTutorial(false);
              }}
              className="w-full mt-2 text-neutral-500 text-sm py-2 hover:text-neutral-300"
            >
              Skip
            </button>
          </div>
        </div>
      )}

      {/* On-screen Orientation Indicator for Mobile */}
      <div className="fixed bottom-4 left-4 text-[10px] text-white/30 font-mono pointer-events-none uppercase tracking-widest z-0">
        TraceVision AR Engine v1.0
      </div>
    </div>
  );
};

export default App;
