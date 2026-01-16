
import React from 'react';
import { 
  RotateCw, 
  Maximize, 
  Layers, 
  RefreshCw, 
  FlipHorizontal,
  Minus,
  Plus
} from 'lucide-react';

interface ControlPanelProps {
  opacity: number;
  setOpacity: (v: number) => void;
  scale: number;
  setScale: (v: number) => void;
  rotation: number;
  setRotation: (v: number) => void;
  isOutlineMode: boolean;
  setIsOutlineMode: (v: boolean) => void;
  isFlipped: boolean;
  setIsFlipped: (v: boolean) => void;
  onReset: () => void;
  isProcessing: boolean;
}

const ControlPanel: React.FC<ControlPanelProps> = ({
  opacity, setOpacity,
  scale, setScale,
  rotation, setRotation,
  isOutlineMode, setIsOutlineMode,
  isFlipped, setIsFlipped,
  onReset,
  isProcessing
}) => {
  return (
    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-lg bg-neutral-900/90 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-2xl z-20 animate-in slide-in-from-bottom-10">
      <div className="space-y-6">
        
        {/* Primary Controls Group */}
        <div className="flex items-center justify-between gap-4">
          <button 
            onClick={() => setIsOutlineMode(!isOutlineMode)}
            className={`flex-1 flex flex-col items-center gap-1 py-3 rounded-2xl border transition-all ${isOutlineMode ? 'bg-blue-600 border-blue-400' : 'bg-white/5 border-white/10 hover:bg-white/10'}`}
          >
            <Layers size={18} />
            <span className="text-[10px] font-bold uppercase tracking-wider">Outlines</span>
          </button>
          
          <button 
            onClick={() => setIsFlipped(!isFlipped)}
            className={`flex-1 flex flex-col items-center gap-1 py-3 rounded-2xl border transition-all ${isFlipped ? 'bg-purple-600 border-purple-400' : 'bg-white/5 border-white/10 hover:bg-white/10'}`}
          >
            <FlipHorizontal size={18} />
            <span className="text-[10px] font-bold uppercase tracking-wider">Flip</span>
          </button>

          <button 
            onClick={onReset}
            className="flex-1 flex flex-col items-center gap-1 py-3 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-all"
          >
            <RefreshCw size={18} />
            <span className="text-[10px] font-bold uppercase tracking-wider">Reset</span>
          </button>
        </div>

        {/* Sliders Group */}
        <div className="space-y-4">
          {/* Opacity Slider */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-[10px] font-bold text-neutral-400 uppercase tracking-widest">
              <span>Opacity</span>
              <span>{Math.round(opacity * 100)}%</span>
            </div>
            <div className="flex items-center gap-3">
              <Minus size={14} className="text-neutral-500" />
              <input 
                type="range" min="0" max="1" step="0.01" 
                value={opacity} 
                onChange={(e) => setOpacity(parseFloat(e.target.value))}
                className="flex-1 h-1.5 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
              />
              <Plus size={14} className="text-neutral-500" />
            </div>
          </div>

          {/* Scale Slider */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-[10px] font-bold text-neutral-400 uppercase tracking-widest">
              <span>Zoom</span>
              <span>{scale.toFixed(2)}x</span>
            </div>
            <div className="flex items-center gap-3">
              <Maximize size={14} className="text-neutral-500" />
              <input 
                type="range" min="0.1" max="5" step="0.01" 
                value={scale} 
                onChange={(e) => setScale(parseFloat(e.target.value))}
                className="flex-1 h-1.5 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-purple-500"
              />
              <Plus size={14} className="text-neutral-500" />
            </div>
          </div>

          {/* Rotation Slider */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-[10px] font-bold text-neutral-400 uppercase tracking-widest">
              <span>Rotation</span>
              <span>{rotation}°</span>
            </div>
            <div className="flex items-center gap-3">
              <RotateCw size={14} className="text-neutral-500" />
              <input 
                type="range" min="-180" max="180" step="1" 
                value={rotation} 
                onChange={(e) => setRotation(parseFloat(e.target.value))}
                className="flex-1 h-1.5 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-green-500"
              />
              <Plus size={14} className="text-neutral-500" />
            </div>
          </div>
        </div>

        {isProcessing && (
          <div className="absolute inset-0 bg-neutral-900/50 backdrop-blur-sm rounded-3xl flex items-center justify-center">
            <div className="flex items-center gap-3 bg-neutral-800 px-6 py-3 rounded-full border border-white/10 animate-pulse">
              <RefreshCw className="animate-spin" size={18} />
              <span className="text-sm font-medium">Processing Outlines...</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ControlPanel;
