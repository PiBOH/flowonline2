import React, { Suspense, useEffect } from 'react';
import { FlowProvider, useFlow } from './context/FlowContext';
import { Header } from './components/Header';
import { FlowchartCanvas } from './components/FlowchartCanvas';
import { Console } from './components/Console';
import { Sidebar } from './components/Sidebar';
import { Modals } from './components/Modals';
import { useViewport } from './mobile/useViewport';

// Lazily load the mobile bundle so desktop users never pay the cost.
const MobileApp = React.lazy(() => import('./mobile/MobileApp'));

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

        document.title = `CPU ${cpuPct.toFixed(1)}%${ramStr}`;
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
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden p-0.5 md:p-1 bg-[#D4D0C8] gap-0.5 md:gap-1 relative safe-bottom">
        
        {/* 1. FLOWCHART ONLY LAYOUT */}
        {layout === 'flowchart_only' && (
          <div className="flex-1 flex h-full overflow-hidden border border-slate-300 md:border-2 rounded bg-white m-0 md:m-0.5 shadow">
            <FlowchartCanvas />
          </div>
        )}

        {/* 2. FLOWCHART & CONSOLE SPLIT */}
        {layout === 'flow_console' && (
          <div className="flex-1 flex flex-col md:flex-row h-full overflow-hidden gap-0.5 md:gap-1">
            <div className="flex-[3] md:flex-1 h-full overflow-hidden border border-slate-300 md:border-2 rounded bg-white m-0 md:m-0.5 shadow min-h-0">
              <FlowchartCanvas />
            </div>
            <div className="md:w-[360px] h-[40%] md:h-full flex flex-col min-h-0">
              <Console />
            </div>
          </div>
        )}

        {/* 3. FLOWCHART & VARIABLES SPLIT */}
        {layout === 'flow_variables' && (
          <div className="flex-1 flex flex-col md:flex-row h-full overflow-hidden gap-0.5 md:gap-1">
            <div className="flex-[3] md:flex-1 h-full overflow-hidden border border-slate-300 md:border-2 rounded bg-white m-0 md:m-0.5 shadow min-h-0">
              <FlowchartCanvas />
            </div>
            <div className="md:w-[300px] h-[35%] md:h-full flex flex-col min-h-0">
              <Sidebar />
            </div>
          </div>
        )}

        {/* 4. FLOWCHART & SOURCE CODE SPLIT */}
        {layout === 'flow_code' && (
          <div className="flex-1 flex flex-col md:flex-row h-full overflow-hidden gap-0.5 md:gap-1">
            <div className="flex-[3] md:flex-1 h-full overflow-hidden border border-slate-300 md:border-2 rounded bg-white m-0 md:m-0.5 shadow min-h-0">
              <FlowchartCanvas />
            </div>
            <div className="md:w-[320px] h-[40%] md:h-full flex flex-col min-h-0">
              <Sidebar />
            </div>
          </div>
        )}

        {/* 5. FLOWGORITHM TRIPLE DOCK SPLIT — mobile: stacked vertically; desktop: flowchart left, variables+console right */}
        {layout === 'triple_split' && (
          <div className="flex-1 flex flex-col md:flex-row h-full overflow-hidden gap-0.5 md:gap-1">
            {/* Flowchart Canvas Window */}
            <div className="flex-[3] md:flex-1 h-full overflow-hidden border border-slate-300 md:border-2 rounded bg-white m-0 md:m-0.5 shadow min-h-0">
              <FlowchartCanvas />
            </div>
            
            {/* Right-side stack: desktop side-by-side, mobile full-width stacked */}
            <div className="md:w-[320px] h-[45%] md:h-full flex flex-col gap-0.5 md:gap-1.5 p-0 md:p-0.5 min-h-0">
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

// Pure-additive view-router. Picks MobileApp on <=767px, falls back to the
// existing MainLayout on desktop. MainLayout itself is untouched.
const MobileLoading: React.FC = () => (
  // Mobile-shaped splash so users on <=767px never see a flash of the
  // desktop layout while the lazy chunk is downloaded.
  <div
    className="mobile-app-root"
    style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100dvh',
      width: '100vw',
      background: '#f8fafc',
      color: '#475569',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif',
      fontSize: 14,
      fontWeight: 600,
      letterSpacing: '0.02em',
    }}
    aria-label="Loading Flowonline2 mobile interface"
  >
    <span>Loading Flowonline2…</span>
  </div>
);

const AppShell: React.FC = () => {
  const { isMobile } = useViewport();
  if (isMobile) {
    return (
      <Suspense fallback={<MobileLoading />}>
        <MobileApp />
      </Suspense>
    );
  }
  return <MainLayout />;
};

function App() {
  return (
    <FlowProvider>
      <AppShell />
    </FlowProvider>
  );
}

export default App;
