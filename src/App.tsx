import { FlowProvider } from './context/FlowContext';
import { Header } from './components/Header';
import { FlowchartCanvas } from './components/FlowchartCanvas';
import { Console } from './components/Console';
import { Sidebar } from './components/Sidebar';
import { Modals } from './components/Modals';

function App() {
  return (
    <FlowProvider>
      <div className="flex flex-col h-screen w-screen overflow-hidden bg-slate-50 font-sans antialiased text-slate-800">
        {/* Top bar with execution tools, speed slider, file io, and i18n switcher */}
        <Header />

        {/* Content workspace area */}
        <div className="flex-1 flex flex-row overflow-hidden">
          
          {/* Main viewport: Flowchart canvas on top, Console on bottom */}
          <div className="flex-1 flex flex-col h-full overflow-hidden">
            {/* Visual Flowgorithm diagram canvas */}
            <FlowchartCanvas />
            
            {/* IO Terminal console simulation */}
            <Console />
          </div>

          {/* Right sidebar: Watch Variables & Multi-language Code Generator */}
          <Sidebar />

        </div>

        {/* Dynamic Modals for editing flowchart nodes on double-click */}
        <Modals />
      </div>
    </FlowProvider>
  );
}

export default App;
