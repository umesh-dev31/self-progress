import React, { useRef, useState, useEffect } from 'react';
import { 
  PenTool, 
  Square, 
  Circle, 
  ArrowRight, 
  Eraser, 
  Download, 
  Trash2, 
  Save, 
  FileText 
} from 'lucide-react';

const COLORS = [
  { name: 'Terracotta', hex: '#E85D35' },
  { name: 'Black', hex: '#0A0A0A' },
  { name: 'Yellow', hex: '#FFDF00' },
  { name: 'Mint', hex: '#5AE4A8' },
  { name: 'Cyan', hex: '#48CAE4' },
  { name: 'Purple', hex: '#BDB2FF' },
  { name: 'Pink', hex: '#FF70A6' }
];

export default function CanvasPage({ data, setData }) {
  const canvasRef = useRef(null);
  const [tool, setTool] = useState('pen');
  const [color, setColor] = useState('#E85D35');
  const [lineWidth, setLineWidth] = useState(4);
  const [isDrawing, setIsDrawing] = useState(false);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const [canvasHistory, setCanvasHistory] = useState([]);
  
  const [canvasNotes, setCanvasNotes] = useState(data.canvasData?.notes || '');
  const [notesSaved, setNotesSaved] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * 2;
    canvas.height = rect.height * 2;
    ctx.scale(2, 2);
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    ctx.fillStyle = '#FFFDF9';
    ctx.fillRect(0, 0, rect.width, rect.height);

    setCanvasHistory([canvas.toDataURL()]);
  }, []);

  const getCanvasCoords = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };
  };

  const startDrawing = (e) => {
    const coords = getCanvasCoords(e);
    setIsDrawing(true);
    setStartPos(coords);

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.beginPath();
    ctx.moveTo(coords.x, coords.y);
  };

  const draw = (e) => {
    if (!isDrawing) return;
    const coords = getCanvasCoords(e);
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    if (tool === 'pen') {
      ctx.strokeStyle = color;
      ctx.lineWidth = lineWidth;
      ctx.lineTo(coords.x, coords.y);
      ctx.stroke();
    } else if (tool === 'eraser') {
      ctx.strokeStyle = '#FFFDF9';
      ctx.lineWidth = lineWidth * 5;
      ctx.lineTo(coords.x, coords.y);
      ctx.stroke();
    }
  };

  const stopDrawing = (e) => {
    if (!isDrawing) return;
    const coords = getCanvasCoords(e);
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    if (tool === 'rect') {
      ctx.strokeStyle = color;
      ctx.lineWidth = lineWidth;
      ctx.strokeRect(startPos.x, startPos.y, coords.x - startPos.x, coords.y - startPos.y);
    } else if (tool === 'circle') {
      ctx.strokeStyle = color;
      ctx.lineWidth = lineWidth;
      ctx.beginPath();
      const radius = Math.sqrt(Math.pow(coords.x - startPos.x, 2) + Math.pow(coords.y - startPos.y, 2));
      ctx.arc(startPos.x, startPos.y, radius, 0, 2 * Math.PI);
      ctx.stroke();
    } else if (tool === 'arrow') {
      ctx.strokeStyle = color;
      ctx.lineWidth = lineWidth;
      ctx.beginPath();
      ctx.moveTo(startPos.x, startPos.y);
      ctx.lineTo(coords.x, coords.y);
      ctx.stroke();

      const angle = Math.atan2(coords.y - startPos.y, coords.x - startPos.x);
      ctx.beginPath();
      ctx.moveTo(coords.x, coords.y);
      ctx.lineTo(coords.x - 14 * Math.cos(angle - Math.PI / 6), coords.y - 14 * Math.sin(angle - Math.PI / 6));
      ctx.moveTo(coords.x, coords.y);
      ctx.lineTo(coords.x - 14 * Math.cos(angle + Math.PI / 6), coords.y - 14 * Math.sin(angle + Math.PI / 6));
      ctx.stroke();
    }

    setIsDrawing(false);
    setCanvasHistory(prev => [...prev.slice(-10), canvas.toDataURL()]);
  };

  const handleClearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    ctx.fillStyle = '#FFFDF9';
    ctx.fillRect(0, 0, rect.width, rect.height);
    setCanvasHistory([canvas.toDataURL()]);
  };

  const handleExportImage = () => {
    const canvas = canvasRef.current;
    const link = document.createElement('a');
    link.download = `progress_pulse_canvas_${Date.now()}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  const handleSaveNotes = () => {
    setData({
      ...data,
      canvasData: {
        ...data.canvasData,
        notes: canvasNotes
      }
    });
    setNotesSaved(true);
    setTimeout(() => setNotesSaved(false), 2500);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="neo-box p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-neo-pink/40 dark:bg-neo-darkCard">
        <div>
          <h2 className="text-xl md:text-3xl font-black text-neo-black dark:text-white uppercase tracking-tight flex items-center gap-2">
            <PenTool className="w-7 h-7 stroke-[3]" />
            <span>IDEA CANVAS & WHITEBOARD</span>
          </h2>
          <p className="text-xs md:text-sm font-bold text-neo-black/80 dark:text-sand-300 mt-1">
            Draw algorithm logic trees, sketch video storyboard cuts, and brainstorm system architectures.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start md:self-auto">
          <button
            onClick={handleClearCanvas}
            className="neo-btn-secondary px-3 py-1.5 text-xs flex items-center gap-1.5"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>CLEAR</span>
          </button>

          <button
            onClick={handleExportImage}
            className="neo-btn-primary px-3.5 py-1.5 text-xs flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5 stroke-[3]" />
            <span>EXPORT PNG</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Excalidraw Canvas & Structured Notes */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 7 Cols: Interactive Drawing Whiteboard */}
        <div className="lg:col-span-7 neo-box p-4 space-y-3 flex flex-col">
          {/* Canvas Arcade Toolbar */}
          <div className="flex flex-wrap items-center justify-between gap-2 p-2 rounded-xl bg-neo-yellow border-2 border-neo-black shadow-neo-sm">
            {/* Tool Selection */}
            <div className="flex items-center gap-1">
              <button
                onClick={() => setTool('pen')}
                title="Pen"
                className={`p-1.5 rounded-lg border-2 border-neo-black text-xs font-black ${
                  tool === 'pen' ? 'bg-neo-black text-white' : 'bg-white text-neo-black'
                }`}
              >
                <PenTool className="w-4 h-4 stroke-[3]" />
              </button>

              <button
                onClick={() => setTool('rect')}
                title="Rectangle"
                className={`p-1.5 rounded-lg border-2 border-neo-black text-xs font-black ${
                  tool === 'rect' ? 'bg-neo-black text-white' : 'bg-white text-neo-black'
                }`}
              >
                <Square className="w-4 h-4 stroke-[3]" />
              </button>

              <button
                onClick={() => setTool('circle')}
                title="Circle"
                className={`p-1.5 rounded-lg border-2 border-neo-black text-xs font-black ${
                  tool === 'circle' ? 'bg-neo-black text-white' : 'bg-white text-neo-black'
                }`}
              >
                <Circle className="w-4 h-4 stroke-[3]" />
              </button>

              <button
                onClick={() => setTool('arrow')}
                title="Arrow"
                className={`p-1.5 rounded-lg border-2 border-neo-black text-xs font-black ${
                  tool === 'arrow' ? 'bg-neo-black text-white' : 'bg-white text-neo-black'
                }`}
              >
                <ArrowRight className="w-4 h-4 stroke-[3]" />
              </button>

              <button
                onClick={() => setTool('eraser')}
                title="Eraser"
                className={`p-1.5 rounded-lg border-2 border-neo-black text-xs font-black ${
                  tool === 'eraser' ? 'bg-neo-black text-white' : 'bg-white text-neo-black'
                }`}
              >
                <Eraser className="w-4 h-4 stroke-[3]" />
              </button>
            </div>

            {/* Color Swatches */}
            <div className="flex items-center gap-1.5">
              {COLORS.map(c => (
                <button
                  key={c.hex}
                  onClick={() => setColor(c.hex)}
                  title={c.name}
                  style={{ backgroundColor: c.hex }}
                  className={`w-6 h-6 rounded-full border-2 border-neo-black transition-transform ${
                    color === c.hex ? 'scale-125 shadow-neo-sm ring-2 ring-white' : ''
                  }`}
                />
              ))}
            </div>

            {/* Line Width */}
            <div className="flex items-center gap-1 text-[11px] font-black text-neo-black">
              <span>SIZE:</span>
              <button
                onClick={() => setLineWidth(2)}
                className={`px-2 py-0.5 rounded border border-neo-black ${lineWidth === 2 ? 'bg-neo-black text-white' : 'bg-white'}`}
              >
                S
              </button>
              <button
                onClick={() => setLineWidth(5)}
                className={`px-2 py-0.5 rounded border border-neo-black ${lineWidth === 5 ? 'bg-neo-black text-white' : 'bg-white'}`}
              >
                M
              </button>
              <button
                onClick={() => setLineWidth(10)}
                className={`px-2 py-0.5 rounded border border-neo-black ${lineWidth === 10 ? 'bg-neo-black text-white' : 'bg-white'}`}
              >
                L
              </button>
            </div>
          </div>

          {/* Interactive Canvas Board */}
          <div className="flex-1 w-full min-h-[460px] rounded-xl border-2 border-neo-black dark:border-white/80 overflow-hidden bg-[#FFFDF9] shadow-neo-sm relative">
            <canvas
              ref={canvasRef}
              onMouseDown={startDrawing}
              onMouseMove={draw}
              onMouseUp={stopDrawing}
              onMouseLeave={stopDrawing}
              className="w-full h-full cursor-crosshair block"
            />
          </div>
        </div>

        {/* Right 5 Cols: Scratchpad & Storyboard Notes */}
        <div className="lg:col-span-5 neo-box p-5 space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between pb-2 border-b-2 border-neo-black dark:border-white/20">
              <h3 className="text-sm font-black text-neo-black dark:text-white uppercase flex items-center gap-2">
                <FileText className="w-4 h-4 text-neo-terracotta" />
                <span>STORYBOARD & SYSTEM NOTES</span>
              </h3>
              {notesSaved && (
                <span className="neo-badge bg-neo-mint text-neo-black text-[10px]">SAVED!</span>
              )}
            </div>

            <textarea
              value={canvasNotes}
              onChange={(e) => setCanvasNotes(e.target.value)}
              placeholder="Draft video scripts, pacing timing, LeetCode intuition notes, or project milestones..."
              rows={14}
              className="w-full text-xs font-mono font-bold px-3.5 py-3 rounded-xl bg-white dark:bg-dusk-800 border-2 border-neo-black dark:border-white text-neo-black dark:text-white focus:outline-none shadow-neo-sm leading-relaxed resize-none"
            />
          </div>

          <div className="pt-2 border-t-2 border-neo-black/20 dark:border-white/20 flex items-center justify-between">
            <span className="text-[11px] font-bold text-clay-600 dark:text-sand-300 uppercase">
              Auto-persisted
            </span>
            <button
              onClick={handleSaveNotes}
              className="neo-btn-primary px-4 py-2 text-xs flex items-center gap-1.5"
            >
              <Save className="w-3.5 h-3.5 stroke-[3]" />
              <span>SAVE NOTES 💾</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
