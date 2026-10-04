import React, { useState, useMemo, useEffect } from 'react';
import { useFlow, findBlockById } from '../context/FlowContext';
import { BlockType } from '../types/flow';
import { BlockNode, colorSchemes } from './BlockNode';
import { translations } from '../utils/translations';
import { IconPencil, IconScissors, IconClipboard, IconInbox, IconError } from './EmojiIcons';
import {
  buildDiagram,
  computeConnectorPlan,
  shapeEdgeX,
  shapeHalfW,
  shapeHalfH,
  isLoopType,
  ARROW_LEN,
  MAIN_H,
  type ListLayout
} from '../utils/flowchartLayout';

// Connector lines and inserters are produced together but painted on two
// different SVG layers (inserters always go on top of the blocks).
interface ConnectorLayer {
  lines: JSX.Element[];
  inserters: JSX.Element[];
}

export const FlowchartCanvas: React.FC = () => {
  const {
    statements,
    currentBlockId,
    addBlock,
    deleteBlock,
    openEditor,
    language,
    colorScheme,
    zoom,
    // MULTIPLE BLOCKS SELECTION, COPY & PASTE (Version 2.0.13 Premium!)
    selectedBlockIds,
    setSelectedBlockIds,
    copiedBlocks,
    copyBlocks,
    cutBlocks,
    pasteBlocks,
    deleteBlocks
  } = useFlow();

  // Robust contextual menu coordinate state
  const [showSelectionVeil, setShowSelectionVeil] = useState(false);
  const [activeInserter, setActiveInserter] = useState<{ parentId: string | 'main_start' | 'main_end'; index?: number; x: number; y: number } | null>(null);

  // Custom Right-Click Context Menu State
  const [contextMenu, setContextMenu] = useState<{
    type: 'block' | 'inserter';
    blockId?: string;
    parentId?: string | 'main_start' | 'main_end';
    index?: number;
    x: number;
    y: number;
  } | null>(null);

  // Close context menu on any outside click
  useEffect(() => {
    const handleOutsideClick = () => {
      setContextMenu(null);
    };
    document.addEventListener('click', handleOutsideClick);
    return () => {
      document.removeEventListener('click', handleOutsideClick);
    };
  }, []);

  const t = translations[language];
  const sc = colorSchemes[colorScheme];

  // Inserter dots keep a readable size even when the canvas is zoomed out
  const inserterScale = zoom < 1 ? 1 / zoom : 1;

  // GENERATE LAYOUT & DIMENSIONS (pure geometry engine, see utils/flowchartLayout.ts)
  const diagramLayout = useMemo(() => buildDiagram(statements), [statements]);

  // DRAW INTERACTIVE INSERTER CIRCULAR BUTTON (Faithful 18px circle, glowing blue, expanding on hover!)
  const renderInserterButton = (
    x: number,
    y: number,
    parentId: string | 'main_start' | 'main_end',
    index?: number
  ): JSX.Element => {
    // The dot is re-scaled around its own centre, so it keeps a readable size
    // even when the canvas is zoomed out (e.g. 70%).
    return (
      <g
        transform={`translate(${x} ${y}) scale(${inserterScale}) translate(${-x} ${-y})`}
        data-export-remove=""
        className="cursor-pointer group/insert"
        onClick={(e) => {
          e.stopPropagation();
          // Capture exact click coordinates to show insert menu!
          setActiveInserter({ 
            parentId, 
            index, 
            x: e.clientX, 
            y: e.clientY 
          });
        }}
        // RIGHT-CLICK ON INSERTER PIN (Paste or Insert context choices!)
        // Also supports long-press on mobile for context menu
        onContextMenu={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setContextMenu({
            type: 'inserter',
            parentId,
            index,
            x: e.clientX,
            y: e.clientY
          });
        }}
        onTouchEnd={(e) => {
          // Long-press detection for mobile context menu (touch devices)
          const touch = e.changedTouches[0];
          e.preventDefault();
          e.stopPropagation();
          setContextMenu({
            type: 'inserter',
            parentId,
            index,
            x: touch.clientX,
            y: touch.clientY
          });
        }}
      >
        {/* Invisible wider mouse-capture cylinder for a highly responsive UX */}
        <circle
          cx={x}
          cy={y}
          r="16"
          fill="transparent"
          className="pointer-events-all"
        />
        
        {/* Visual inserter circle dot */}
        <circle
          cx={x}
          cy={y}
          r="9"
          fill="url(#blueDotGrad)"
          stroke="#1F3354"
          strokeWidth="2"
          className="group-hover/insert:scale-[1.25] group-hover/insert:stroke-amber-400 group-hover/insert:filter group-hover/insert:drop-shadow-[0_0_6px_rgba(245,158,11,0.8)] transition-all duration-150 origin-center"
          style={{ transformOrigin: `${x}px ${y}px` }}
        />
        <text
          x={x}
          y={y - 0.5}
          textAnchor="middle"
          dominantBaseline="central"
          fill="white"
          className="font-sans font-black text-[12px] pointer-events-none select-none"
        >
          +
        </text>
      </g>
    );
  };

  const collectLayoutIds = (layout: ListLayout): string[] => {
    const ids: string[] = [];
    for (const node of layout.nodes) {
      ids.push(node.id);
      if (node.type === 'if') {
        if (node.thenLayout) ids.push(...collectLayoutIds(node.thenLayout));
        if (node.elseLayout) ids.push(...collectLayoutIds(node.elseLayout));
      } else if (isLoopType(node.type) && node.bodyLayout) {
        ids.push(...collectLayoutIds(node.bodyLayout));
      }
    }
    return ids;
  };

  const selectionVeil = (node: ListLayout['nodes'][number], order: number): JSX.Element => {
    const halfW = shapeHalfW(node.type);
    const halfH = shapeHalfH(node.type);
    const shape = node.type === 'if'
      ? <polygon points={`0,${-halfH} ${halfW},0 0,${halfH} ${-halfW},0`} />
      : isLoopType(node.type)
      ? <polygon points={`${-halfW + 15},${-halfH} ${halfW - 15},${-halfH} ${halfW},0 ${halfW - 15},${halfH} ${-halfW + 15},${halfH} ${-halfW},0`} />
      : node.type === 'input' || node.type === 'output'
      ? <polygon points={`-80,${-halfH} 100,${-halfH} 80,${halfH} -100,${halfH}`} />
      : node.type === 'declare'
      ? <g><path d="M -75 -25 L -75 -32 L -35 -32 L -30 -25 Z" /><line x1="-74" y1="-25" x2="-31" y2="-25" /><rect x="-90" y="-25" width="180" height="50" /></g>
      : <rect x={-halfW} y={-halfH} width={halfW * 2} height={halfH * 2} rx="2" />;
    return (
      <g pointerEvents="none">
        {React.cloneElement(shape, { fill: '#60A5FA', fillOpacity: 0.38, stroke: '#2563EB', strokeOpacity: 0.8, strokeWidth: 2 })}
        <circle cx="0" cy="0" r="11" fill="#1D4ED8" fillOpacity="0.95" stroke="white" strokeWidth="2" />
        <text x="0" y="3.5" textAnchor="middle" fill="white" fontSize="11" fontWeight="700">{order}</text>
      </g>
    );
  };

  // RECURSIVE SVG RENDER NODES
  const renderNodeBlocks = (layout: ListLayout): JSX.Element[] => {
    const list: JSX.Element[] = [];

    for (const node of layout.nodes) {
      const isHighlighted = currentBlockId === node.id;
      const isSelected = selectedBlockIds.includes(node.id);

      list.push(
        <g 
          key={`node-${node.id}`} 
          transform={`translate(${node.x}, ${node.y})`}
          // MULTI-BLOCK CLICK TO SELECT STATE (Flowgorithm Original Style!)
          onClick={(e) => {
            e.stopPropagation(); // Avoid deselecting by clicking empty SVG space
            const additiveSelection = e.ctrlKey || e.metaKey || e.shiftKey;
            setShowSelectionVeil(additiveSelection);
            const subtreeIds = collectLayoutIds({ nodes: [node], width: node.width, height: node.height });
            if (additiveSelection) {
              const allSelected = subtreeIds.every((id) => selectedBlockIds.includes(id));
              setSelectedBlockIds(allSelected
                ? selectedBlockIds.filter((id) => !subtreeIds.includes(id))
                : [...selectedBlockIds, ...subtreeIds.filter((id) => !selectedBlockIds.includes(id))]);
            } else {
              // Selecting a container selects its whole subtree in paste order.
              setSelectedBlockIds(subtreeIds);
            }
          }}
          // RIGHT-CLICK / LONG-PRESS TO OPEN CONTEXT MENU (SUPPORT MULTI-SELECTIONS!)
          // Note: onContextMenu also fires on mobile long-press, no separate onTouchEnd needed
          onContextMenu={(e) => {
            e.preventDefault();
            e.stopPropagation();
            
            const isAlreadySelected = selectedBlockIds.includes(node.id);
            if (!isAlreadySelected) {
              setSelectedBlockIds([node.id]); // Long-press/right-click selects without overlay
              setShowSelectionVeil(false);
            }

            setContextMenu({
              type: 'block',
              blockId: node.id,
              x: e.clientX,
              y: e.clientY
            });
          }}
        >
          <BlockNode
            statement={node.statement}
            isHighlighted={isHighlighted}
            isSelected={isSelected}
            lang={language}
            onDoubleClick={() => node.statement && openEditor(node.statement)}
            onDeleteClick={() => deleteBlock(node.id)}
          />
          {isSelected && showSelectionVeil && selectionVeil(node, selectedBlockIds.indexOf(node.id) + 1)}
        </g>
      );

      // Render inner children blocks recursively
      if (node.type === 'if' && node.thenLayout && node.elseLayout) {
        list.push(...renderNodeBlocks(node.thenLayout));
        list.push(...renderNodeBlocks(node.elseLayout));
      } else if ((node.type === 'while' || node.type === 'for' || node.type === 'do') && node.bodyLayout) {
        list.push(...renderNodeBlocks(node.bodyLayout));
      }
    }

    return list;
  };

  // Branch labels are part of the connector presentation, not the block.
  // Keep them tied to the exact outline vertices used by ConnectorPlan so they
  // never disappear when the geometry is recomputed.
  const renderBranchLabels = (layout: ListLayout): JSX.Element[] => {
    const labels: JSX.Element[] = [];
    for (const node of layout.nodes) {
      if (node.type === 'if') {
        labels.push(
          <React.Fragment key={`labels-${node.id}`}>
            <text x={shapeEdgeX(node, 'left') - 4} y={node.y - 5} textAnchor="end" fill={sc.textColor} fillOpacity="0.8" className="font-sans text-[10px] font-bold select-none pointer-events-none">
              {t.canvas.falseBranch}
            </text>
            <text x={shapeEdgeX(node, 'right') + 4} y={node.y - 5} textAnchor="start" fill="#15803D" fillOpacity="0.9" className="font-sans text-[10px] font-bold select-none pointer-events-none">
              {t.canvas.trueBranch}
            </text>
          </React.Fragment>
        );
        if (node.thenLayout && node.elseLayout) {
          labels.push(...renderBranchLabels(node.thenLayout));
          labels.push(...renderBranchLabels(node.elseLayout));
        }
      } else if (isLoopType(node.type)) {
        const loopText = (key: 'true' | 'false' | 'next' | 'done') => {
          const labels: Record<string, Record<string, string>> = {
            it: { true: 'VERO', false: 'FALSO', next: 'SUCCESSIVO', done: 'FATTO' },
            en: { true: 'TRUE', false: 'FALSE', next: 'NEXT', done: 'DONE' },
            de: { true: 'WAHR', false: 'FALSCH', next: 'WEITER', done: 'FERTIG' },
            fr: { true: 'VRAI', false: 'FAUX', next: 'SUIVANT', done: 'TERMINÉ' },
            es: { true: 'VERDADERO', false: 'FALSO', next: 'SIGUIENTE', done: 'HECHO' }
          };
          return labels[language]?.[key] ?? labels.en[key];
        };
        const isFor = node.type === 'for';
        const isDo = node.type === 'do';
        labels.push(
          <React.Fragment key={`labels-${node.id}`}>
            {isDo ? (
              <>
                <text x={shapeEdgeX(node, 'left') - 4} y={node.y - 25} textAnchor="end" fill={sc.textColor} fillOpacity="0.8" className="font-sans text-[10px] font-bold select-none pointer-events-none">{loopText('true')}</text>
                <text x={shapeEdgeX(node, 'left') - 4} y={node.y + 35} textAnchor="end" fill={sc.textColor} fillOpacity="0.8" className="font-sans text-[10px] font-bold select-none pointer-events-none">{loopText('false')}</text>
              </>
            ) : (
              <>
                <text x={shapeEdgeX(node, 'left') - 4} y={node.y - 5} textAnchor="end" fill={sc.textColor} fillOpacity="0.8" className="font-sans text-[10px] font-bold select-none pointer-events-none">{isFor ? loopText('done') : loopText('false')}</text>
                <text x={shapeEdgeX(node, 'right') + 4} y={node.y - 5} textAnchor="start" fill="#15803D" fillOpacity="0.9" className="font-sans text-[10px] font-bold select-none pointer-events-none">{isFor ? loopText('next') : loopText('true')}</text>
              </>
            )}
          </React.Fragment>
        );
        if (node.bodyLayout) labels.push(...renderBranchLabels(node.bodyLayout));
      }
    }
    return labels;
  };

  // CONTEXT MENUS SELECTING BLOCK TYPE TO INSERT
  const handleInsertBlockType = (type: BlockType) => {
    if (activeInserter) {
      addBlock(activeInserter.parentId, type);
      setActiveInserter(null);
    }
  };

  // The layout module owns connector geometry. The canvas is deliberately a
  // dumb painter: this prevents SVG and the geometry oracle from drifting apart.
  const connectorPlan = useMemo(() => computeConnectorPlan(diagramLayout), [diagramLayout]);
  const connectors = useMemo<ConnectorLayer>(() => ({
    lines: connectorPlan.segments.map((segment) => (
      <line
        key={segment.id}
        x1={segment.x1}
        y1={segment.y1}
        x2={segment.x2}
        y2={segment.y2}
        stroke={sc.lineColor}
        strokeWidth="2"
        markerEnd={segment.arrow ? 'url(#arrow)' : undefined}
      />
    )),
    inserters: connectorPlan.inserters.map((spot) => (
      <React.Fragment key={spot.id}>
        {renderInserterButton(spot.x, spot.y, spot.parentId, spot.index)}
      </React.Fragment>
    ))
  }), [connectorPlan, sc, zoom]);

  const isDark = colorScheme === 'twilight';

  return (
    <div className={`flex-1 flex flex-col h-full relative overflow-hidden select-none border-r border-slate-200 ${isDark ? 'bg-zinc-900' : 'bg-white'}`}>
      
      {/* SVG Canvas Workspace with Engineering Graph-Paper Grid Background */}
      <div 
        className="flex-1 overflow-auto p-2 md:p-8 flex items-start justify-center relative flowchart-canvas-container"
        style={{
          background: isDark
            ? 'linear-gradient(to right, rgba(255, 255, 255, 0.04) 1px, transparent 1px), linear-gradient(to bottom, rgba(255, 255, 255, 0.04) 1px, transparent 1px), #1e1e1e'
            : 'linear-gradient(to right, rgba(200, 200, 210, 0.15) 1px, transparent 1px), linear-gradient(to bottom, rgba(200, 200, 210, 0.15) 1px, transparent 1px), #FFFFFF',
          backgroundSize: '20px 20px'
        }}
      >
        <svg
          id="flowchart-svg-export-target"
          width={(diagramLayout.maxX - diagramLayout.minX) * zoom}
          height={diagramLayout.height * zoom}
          viewBox={`${diagramLayout.minX} 0 ${diagramLayout.maxX - diagramLayout.minX} ${diagramLayout.height}`}
          className="bg-transparent transition-transform duration-75 origin-top"
          style={{ transform: `scale(${zoom})` }}
          // CLICKING EMPTY SPACE ON CANVAS DESELECTS EVERYTHING!
          onClick={() => {
            setSelectedBlockIds([]);
            setShowSelectionVeil(false);
            setActiveInserter(null);
          }}
        >
          {/* SVG definitions */}
          <defs>
            {/* Arrowhead.

                Two details used to make the arrows look crooked:
                  - `markerUnits="strokeWidth"` scaled the head by the 2px stroke,
                    so its size depended on the pen rather than on the drawing;
                  - the old viewBox pushed the tip past the end of the segment.

                The head is now drawn in USER SPACE, `refX` is the very tip, and
                the engine ends every arrow segment exactly on a block outline.
                The result is a tip that touches the shape and never hides in it. */}
            <marker
              id="arrow"
              viewBox={`0 0 ${ARROW_LEN} ${ARROW_LEN}`}
              refX={ARROW_LEN}
              refY={ARROW_LEN / 2}
              markerWidth={ARROW_LEN}
              markerHeight={ARROW_LEN}
              markerUnits="userSpaceOnUse"
              orient="auto-start-reverse"
            >
              <path
                d={`M 0 0 L ${ARROW_LEN} ${ARROW_LEN / 2} L 0 ${ARROW_LEN} z`}
                fill={sc.lineColor}
              />
            </marker>

            {/* Glowing Blue Dot gradient */}
            <linearGradient id="blueDotGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#6BB0E0" />
              <stop offset="100%" stopColor="#3380C0" />
            </linearGradient>
          </defs>

          {/* 1. Draw Start Oval */}
          <g transform={`translate(0, ${MAIN_H / 2})`}>
            <BlockNode
              type="main"
              isHighlighted={currentBlockId === 'main_start'}
              lang={language}
            />
          </g>

          {/* 2. Connector lines & arrows (painted UNDER the blocks) */}
          {connectors.lines}

          {/* Branch labels stay above wires but below inserter hit targets. */}
          {renderBranchLabels(diagramLayout.listLayout)}

          {/* 3. Render Visual Nodes Recursively */}
          {renderNodeBlocks(diagramLayout.listLayout)}

          {/* 4. Inserter "+" dots — always painted ON TOP of every block */}
          {connectors.inserters}

          {/* 5. Draw End Oval */}
          <g transform={`translate(${diagramLayout.endX}, ${diagramLayout.endOvalY})`}>
            <BlockNode
              type="end"
              isHighlighted={currentBlockId === 'main_end'}
              lang={language}
            />
          </g>
        </svg>

        {/* Floating Context Block Selector Popup Menu (USING FIXED POSITIONING EXACTLY AT CLICK COORDINATES!) */}
        {activeInserter && (
          <div
            className="fixed bg-white rounded-lg shadow-xl border border-slate-200 p-2 grid grid-cols-4 gap-1 w-[420px] z-50 animate-in fade-in zoom-in-95 duration-100 overflow-y-auto overscroll-contain"
            style={{
              left: `${Math.max(8, Math.min(activeInserter.x - 128, (typeof window !== 'undefined' ? window.innerWidth : 1024) - 272))}px`,
              top: `${Math.max(8, Math.min(activeInserter.y + 10, (typeof window !== 'undefined' ? window.innerHeight : 768) - 600))}px`,
              width: 'min(420px, calc(100vw - 16px))',
              maxWidth: 'calc(100vw - 16px)',
              height: 'min(600px, calc(100dvh - 16px))',
              maxHeight: 'calc(100dvh - 16px)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="col-span-4 bg-[#B9DDF5] border border-[#75A9C8] text-[11px] font-semibold text-slate-700 px-2 py-1 flex items-center justify-between">
              <span>{language === 'it' ? 'Clipboard' : 'Clipboard'}</span>
              <button
                className="text-slate-400 hover:text-slate-600 font-bold"
                onClick={() => setActiveInserter(null)}
              >
                ×
              </button>
            </div>

            {/* === PHASE 5.2: SINGLE-STEP PASTE ROW =========================== */}
            {/* Click the inserter arrow → ONE menu shows BOTH Paste AND      */}
            {/* new block types. The previous 2-step flow (paste? or new?) is */}
            {/* gone. Disabled when clipboard is empty.                        */}
            <button
              onClick={() => {
                pasteBlocks(activeInserter.parentId);
                setActiveInserter(null);
              }}
              disabled={copiedBlocks.length === 0}
              title={language === 'it' ? 'Incolla i blocchi copiati' : 'Paste copied blocks here'}
              className="col-span-4 flex items-center justify-between w-full p-1.5 mb-1 rounded border border-transparent hover:border-indigo-300 hover:bg-indigo-50 disabled:opacity-30 disabled:pointer-events-none disabled:cursor-not-allowed transition"
            >
              <span className="flex items-center space-x-2">
                <IconClipboard size={14} className="text-indigo-600" />
                <span className="text-xs font-bold text-slate-700">
                  {language === 'it' ? 'Incolla' : 'Paste'} {copiedBlocks.length > 0 ? `(${copiedBlocks.length})` : ''}
                </span>
              </span>
              <span className="text-[9px] text-slate-400 font-mono font-bold">Ctrl+V</span>
            </button>

            <div className="col-span-4 grid grid-cols-4 gap-2 text-[11px]">
              <div className="col-span-1 flex flex-col gap-1">
                <div className="bg-[#B9DDF5] border border-[#75A9C8] px-2 py-1 text-slate-700">Clipboard</div>
                <button
                  onClick={() => { pasteBlocks(activeInserter.parentId); setActiveInserter(null); }}
                  disabled={copiedBlocks.length === 0}
                  className="h-12 flex flex-col items-center justify-center gap-1 bg-white text-slate-500 hover:bg-[#EEF7FC] disabled:opacity-35 disabled:pointer-events-none border border-transparent"
                  title={language === 'it' ? 'Incolla blocchi copiati' : 'Paste copied blocks'}
                >
                  <IconClipboard size={22} className="text-slate-400" />
                  <span>{language === 'it' ? 'Incolla' : 'Paste'}</span>
                </button>
              </div>
              <div className="col-span-1 flex flex-col gap-1">
                <div className="bg-[#B9DDF5] border border-[#75A9C8] px-2 py-1 text-slate-700">Miscellaneous</div>
                <button onClick={() => handleInsertBlockType('comment')} className="h-12 bg-white border border-dashed border-slate-500 text-slate-700 hover:bg-slate-50">{t.blocks.comment}</button>
                <button disabled className="h-8 flex items-center justify-center gap-1 bg-white text-slate-400 opacity-70 cursor-not-allowed"><span className="w-5 h-5 bg-[#F08080] rounded-[35%]" />Breakpoint</button>
              </div>
              <div className="col-span-2" />

              <div className="col-span-4 bg-[#A9D3F0] border border-[#75A9C8] px-2 py-1 text-slate-700 font-semibold">Statement</div>

              <div className="flex flex-col gap-1">
                <div className="text-center text-[10px] text-slate-600">Input / Output</div>
                <button onClick={() => handleInsertBlockType('input')} className="p-2 text-left bg-[#D8EEFC] hover:bg-cyan-100"><span className="inline-block w-2.5 h-2.5 bg-cyan-300 mr-2" />{t.blocks.input}</button>
                <button onClick={() => handleInsertBlockType('output')} className="p-2 text-left bg-[#DDF5DD] hover:bg-green-100"><span className="inline-block w-2.5 h-2.5 bg-green-400 mr-2" />{t.blocks.output}</button>
              </div>
              <div className="flex flex-col gap-1">
                <div className="text-center text-[10px] text-slate-600">{language === 'it' ? 'Variabili' : 'Variables'}</div>
                <button onClick={() => handleInsertBlockType('declare')} className="p-2 text-left bg-[#FFFBD5] hover:bg-yellow-100"><span className="inline-block w-2.5 h-2.5 bg-yellow-300 mr-2" />{t.blocks.declare}</button>
                <button onClick={() => handleInsertBlockType('assign')} className="p-2 text-left bg-[#FFFBD5] hover:bg-yellow-100"><span className="inline-block w-2.5 h-2.5 bg-yellow-400 mr-2" />{t.blocks.assign}</button>
              </div>
              <div className="flex flex-col gap-1">
                <div className="text-center text-[10px] text-slate-600">{language === 'it' ? 'Controllo' : 'Control'}</div>
                <button onClick={() => handleInsertBlockType('if')} className="p-2 text-left bg-[#FDE2EA] hover:bg-rose-100"><span className="inline-block w-2.5 h-2.5 bg-rose-400 mr-2" />{t.blocks.if}</button>
                <button onClick={() => handleInsertBlockType('call')} className="p-2 text-left bg-[#EAD9F8] hover:bg-purple-100"><span className="inline-block w-2.5 h-2.5 bg-purple-400 mr-2" />{t.blocks.call}</button>
              </div>
              <div className="flex flex-col gap-1">
                <div className="text-center text-[10px] text-slate-600">{language === 'it' ? 'Cicli' : 'Looping'}</div>
                <button onClick={() => handleInsertBlockType('while')} className="p-2 text-left bg-[#FFE0AD] hover:bg-orange-100"><span className="inline-block w-2.5 h-2.5 bg-orange-300 mr-2" />{t.blocks.while}</button>
                <button onClick={() => handleInsertBlockType('for')} className="p-2 text-left bg-[#FFE0AD] hover:bg-orange-100"><span className="inline-block w-2.5 h-2.5 bg-orange-400 mr-2" />{t.blocks.for}</button>
                <button onClick={() => handleInsertBlockType('do')} className="p-2 text-left bg-[#FFE0AD] hover:bg-orange-100"><span className="inline-block w-2.5 h-2.5 bg-orange-500 mr-2" />{t.blocks.do}</button>
              </div>
            </div>
          </div>
        )}

        {/* Win32 Classic Contextual Menu (EMULATES ORIGINAL WINDOWS RIGHT-CLICK POPUPS!) */}
        {contextMenu && (
          <div
            className="fixed bg-[#F5F5F5] border border-[#999] shadow-2xl py-[2px] z-50 rounded-[1px] min-w-[150px] font-sans text-xs select-none text-slate-800 animate-in fade-in zoom-in-95 duration-75"
            style={{
              left: `${contextMenu.x}px`,
              top: `${contextMenu.y}px`
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {contextMenu.type === 'block' ? (
              <>
                <button
                  onClick={() => {
                    const stmt = findBlockById(statements, contextMenu.blockId!);
                    if (stmt) openEditor(stmt);
                    setContextMenu(null);
                  }}
                  className="w-full text-left px-3.5 py-1.5 hover:bg-[#C9DEF5] hover:text-slate-900 flex items-center justify-between transition-colors"
                >
                  <span><IconPencil size={13} /> {language === 'it' ? 'Modifica...' : 'Edit...'}</span>
                </button>
                <div className="h-[1px] bg-slate-300 my-1"></div>
                <button
                  onClick={() => {
                    cutBlocks(selectedBlockIds);
                    setContextMenu(null);
                  }}
                  className="w-full text-left px-3.5 py-1.5 hover:bg-[#C9DEF5] hover:text-slate-900 flex items-center justify-between transition-colors"
                >
                  <span><IconScissors size={13} /> {language === 'it' ? 'Taglia' : 'Cut'} ({selectedBlockIds.length})</span>
                  <span className="text-[9px] text-slate-400 font-mono font-bold">Ctrl+X</span>
                </button>
                <button
                  onClick={() => {
                    copyBlocks(selectedBlockIds);
                    setContextMenu(null);
                  }}
                  className="w-full text-left px-3.5 py-1.5 hover:bg-[#C9DEF5] hover:text-slate-900 flex items-center justify-between transition-colors"
                >
                  <span><IconClipboard size={13} /> {language === 'it' ? 'Copia' : 'Copy'} ({selectedBlockIds.length})</span>
                  <span className="text-[9px] text-slate-400 font-mono font-bold">Ctrl+C</span>
                </button>
                <button
                  onClick={() => {
                    pasteBlocks(contextMenu.blockId!);
                    setContextMenu(null);
                  }}
                  disabled={copiedBlocks.length === 0}
                  className="w-full text-left px-3.5 py-1.5 hover:bg-[#C9DEF5] hover:text-slate-900 flex items-center justify-between disabled:opacity-30 disabled:pointer-events-none transition-colors"
                >
                  <span><IconInbox size={13} /> {language === 'it' ? 'Incolla dopo' : 'Paste After'}</span>
                  <span className="text-[9px] text-slate-400 font-mono font-bold">Ctrl+V</span>
                </button>
                <div className="h-[1px] bg-slate-300 my-1"></div>
                <button
                  onClick={() => {
                    deleteBlocks(selectedBlockIds);
                    setContextMenu(null);
                  }}
                  className="w-full text-left px-3.5 py-1.5 hover:bg-[#C9DEF5] text-red-600 font-bold flex items-center justify-between transition-colors"
                >
                  <span><IconError size={13} /> {language === 'it' ? 'Elimina' : 'Delete'} ({selectedBlockIds.length})</span>
                  <span className="text-[9px] text-slate-400 font-mono font-bold">Del</span>
                </button>
              </>
            ) : (
              <>
                {/* === PHASE 5.2: SHORTCUT — single-step right-click paste ====== */}
                {/* Removed the previous 2-step "Insert Block..." sub-trigger  */}
                {/* because left-click on the inserter arrow already opens   */}
                {/* the unified menu (with Paste at the top + block grid).   */}
                <button
                  onClick={() => {
                    pasteBlocks(contextMenu.parentId!);
                    setContextMenu(null);
                  }}
                  disabled={copiedBlocks.length === 0}
                  title={language === 'it' ? 'Incolla i blocchi copiati qui' : 'Paste copied blocks here'}
                  className="w-full text-left px-3.5 py-1.5 hover:bg-[#C9DEF5] hover:text-slate-900 flex items-center justify-between disabled:opacity-30 disabled:pointer-events-none transition-colors"
                >
                  <span><IconClipboard size={13} /> {language === 'it' ? 'Incolla Blocco' : 'Paste Block'}{copiedBlocks.length > 0 ? ` (${copiedBlocks.length})` : ''}</span>
                  <span className="text-[9px] text-slate-400 font-mono font-bold">Ctrl+V</span>
                </button>
              </>
            )}
          </div>
        )}

      </div>
    </div>
  );
};
export default FlowchartCanvas;
