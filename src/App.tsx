import React, { useEffect } from 'react';
import { FlowProvider, useFlow } from './context/FlowContext';
import { Header } from './components/Header';
import { FlowchartCanvas } from './components/FlowchartCanvas';
import { Console } from './components/Console';
import { Sidebar } from './components/Sidebar';
import { Modals } from './components/Modals';

const MainLayout: React.FC = () => {
  const { layout } = useFlow();

  // Dynamic tab title: show estimated CPU usage & JS heap RAM
  useEffect(() => {
    let lastFrame = performance.now();
    let frameDeltas: number[] = [];
    let lastTitleUpdate = 0;
    const TARGET_FRAME = 1000 / 60;
    let running = true;

    const measureCPU = () => {
      if (!running) return;
      const now = performance.now();
      const delta = now - lastFrame;
      lastFrame = now;

      frameDeltas.push(Math.min(delta, 100));
      if (frameDeltas.length > 30) frameDeltas.shift();

      // Throttle title update to once per second
      if (now - lastTitleUpdate > 1000) {
        lastTitleUpdate = now;
        const avgDelta = frameDeltas.reduce((a, b) => a + b, 0) / frameDeltas.length;
        const cpuPct = Math.min(100, Math.max(0, ((avgDelta - TARGET_FRAME) / TARGET_FRAME) * 100));

        let ramStr = '';
        const mem = (performance as any).memory;
        if (mem) {
          const ramMB = Math.round(mem.usedJSHeapSize / 1048576);
          ramStr = ` | RAM ${ramMB}MB`;
        }

        document.title = `Flowonline2 | CPU ${cpuPct.toFixed(1)}%${ramStr}`;
      }

      requestAnimationFrame(measureCPU);
    };

    requestAnimationFrame(measureCPU);
    return () => { running = false; };
  }, []);

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-[#F0F0F0] font-sans antialiased text-slate-800">
      
      {/* Top bar with Windows desktop Title Bar, Menu, and Toolbar */}
      <Header />

      {/* Content workspace area (Classic Gray Win32 System Workspace Background) */}
      <div className="flex-1 flex flex-row overflow-hidden p-1 bg-[#D4D0C8] gap-1 relative">
        
        {/* 1. FLOWCHART ONLY LAYOUT */}
        {layout === 'flowchart_only' && (
          <div className="flex-1 flex h-full overflow-hidden border-2 border-slate-300 rounded bg-white m-0.5 shadow">
            <FlowchartCanvas />
          </div>
        )}

        {/* 2. FLOWCHART & CONSOLE SPLIT */}
        {layout === 'flow_console' && (
          <div className="flex-1 flex flex-row h-full overflow-hidden gap-1">
            <div className="flex-1 h-full overflow-hidden border-2 border-slate-300 rounded bg-white m-0.5 shadow">
              <FlowchartCanvas />
            </div>
            <div className="w-[360px] h-full flex flex-col">
              <Console />
            </div>
          </div>
        )}

        {/* 3. FLOWCHART & VARIABLES SPLIT */}
        {layout === 'flow_variables' && (
          <div className="flex-1 flex flex-row h-full overflow-hidden gap-1">
            <div className="flex-1 h-full overflow-hidden border-2 border-slate-300 rounded bg-white m-0.5 shadow">
              <FlowchartCanvas />
            </div>
            <div className="w-[300px] h-full flex flex-col">
              <Sidebar />
            </div>
          </div>
        )}

        {/* 4. FLOWCHART & SOURCE CODE SPLIT */}
        {layout === 'flow_code' && (
          <div className="flex-1 flex flex-row h-full overflow-hidden gap-1">
            <div className="flex-1 h-full overflow-hidden border-2 border-slate-300 rounded bg-white m-0.5 shadow">
              <FlowchartCanvas />
            </div>
            <div className="w-[320px] h-full flex flex-col">
              <Sidebar />
            </div>
          </div>
        )}

        {/* 5. FLOWGORITHM TRIPLE DOCK SPLIT (Flowchart Left, Variables top-right, Console bottom-right) */}
        {layout === 'triple_split' && (
          <div className="flex-1 flex flex-row h-full overflow-hidden gap-1">
            {/* Flowchart Canvas Window */}
            <div className="flex-1 h-full overflow-hidden border-2 border-slate-300 rounded bg-white m-0.5 shadow">
              <FlowchartCanvas />
            </div>
            
            {/* Split stack on the right */}
            <div className="w-[320px] h-full flex flex-col gap-1.5 p-0.5">
              <div className="flex-1 min-h-[45%] flex flex-col">
                <Sidebar />
              </div>
              <div className="flex-1 min-h-[45%] flex flex-col">
                <Console />
              </div>
            </div>
          </div>
        )}

      </div>

      {/* Dynamic Modals for editing flowchart nodes on double-click */}
      <Modals />
    </div>
  );
};

function App() {
  return (
    <FlowProvider>
      <MainLayout />
    </FlowProvider>
  );
}

export default App;
