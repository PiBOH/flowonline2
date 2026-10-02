import React, { useState, useMemo, useEffect } from 'react';
import { useFlow, findBlockById } from '../context/FlowContext';
import { BlockType } from '../types/flow';
import { BlockNode, colorSchemes } from './BlockNode';
import { translations } from '../utils/translations';
import { IconPencil, IconScissors, IconClipboard, IconInbox, IconError } from './EmojiIcons';
import {
  buildDiagram,
  isLoopType,
  IF_W,
  IF_H,
  LOOP_W,
  LOOP_H,
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

  // RENDERING HELPERS FOR CONNECTOR SVG LINES
  // `startY` is where the incoming flow arrives (start oval, branch line or the
  // previous statement) while `endY` is where this list must deliver the flow
  // (top of the next shape, merge line of the parent branch, or the END oval).
  const renderLinesAndArrows = (
    layout: ListLayout,
    centerX: number,
    startY: number,
    endY: number,
    parentContext?: { id: string; branch: 'then' | 'else' | 'body' }
  ): ConnectorLayer => {
    const lines: JSX.Element[] = [];
    const inserters: JSX.Element[] = [];

    // Connectors are pushed on the "lines" layer (painted under the blocks) while
    // every "+" is pushed on its own "inserters" layer (painted ON TOP of the
    // blocks). This is what makes the inserter dots impossible to hide.
    const pushInserter = (x: number, y: number, targetId: string, index?: number) => {
      inserters.push(
        <React.Fragment key={`ins-${targetId}-${index ?? 'end'}-${Math.round(x)}-${Math.round(y)}`}>
          {renderInserterButton(x, y, targetId, index)}
        </React.Fragment>
      );
    };

    // Vertical connector carrying an arrowhead at its end, plus its inserter dot
    const pushConnector = (x: number, from: number, to: number, targetId: string, index?: number) => {
      lines.push(
        <line
          key={`conn-${targetId}-${index ?? 'end'}-${Math.round(from)}`}
          x1={x}
          y1={from}
          x2={x}
          y2={to}
          stroke={sc.lineColor}
          strokeWidth="2"
          markerEnd="url(#arrow)"
        />
      );
      pushInserter(x, (from + to) / 2, targetId, index);
    };

    let currentY = startY;

    for (let i = 0; i < layout.nodes.length; i++) {
      const node = layout.nodes[i];

      // Connector entering this statement (arrowhead touching the shape top)
      pushConnector(centerX, currentY, node.top, node.id, i);

      if (node.type === 'if' && node.thenLayout && node.elseLayout) {
        const leftX = node.leftX as number;
        const rightX = node.rightX as number;
        const mergeY = node.mergeY as number;
        const diamondLeft = centerX - IF_W / 2;
        const diamondRight = centerX + IF_W / 2;

        // FALSE branch, going out on the left (elseBranch)
        lines.push(<line key={`false-edge-${node.id}`} x1={diamondLeft} y1={node.y} x2={leftX} y2={node.y} stroke={sc.lineColor} strokeWidth="2" />);
        lines.push(
          <text key={`false-label-${node.id}`} x={diamondLeft - 4} y={node.y - 5} textAnchor="end" fill={sc.textColor} fillOpacity="0.75" className="font-sans text-[10px] font-bold select-none pointer-events-none">
            {t.canvas.falseBranch}
          </text>
        );
        const leftBranch = renderLinesAndArrows(node.elseLayout, leftX, node.y, mergeY, { id: node.id, branch: 'else' });
        lines.push(...leftBranch.lines);
        inserters.push(...leftBranch.inserters);
        // Elbow bringing the FALSE column back onto the main spine
        lines.push(<line key={`false-merge-${node.id}`} x1={leftX} y1={mergeY} x2={centerX} y2={mergeY} stroke={sc.lineColor} strokeWidth="2" />);

        // TRUE branch, going out on the right (thenBranch)
        lines.push(<line key={`true-edge-${node.id}`} x1={diamondRight} y1={node.y} x2={rightX} y2={node.y} stroke={sc.lineColor} strokeWidth="2" />);
        lines.push(
          <text key={`true-label-${node.id}`} x={diamondRight + 4} y={node.y - 5} textAnchor="start" fill="#15803D" className="font-sans text-[10px] font-bold select-none pointer-events-none">
            {t.canvas.trueBranch}
          </text>
        );
        const rightBranch = renderLinesAndArrows(node.thenLayout, rightX, node.y, mergeY, { id: node.id, branch: 'then' });
        lines.push(...rightBranch.lines);
        inserters.push(...rightBranch.inserters);
        // Elbow bringing the TRUE column back onto the main spine
        lines.push(<line key={`true-merge-${node.id}`} x1={rightX} y1={mergeY} x2={centerX} y2={mergeY} stroke={sc.lineColor} strokeWidth="2" />);

        // The flow also leaves the diamond from its bottom vertex, joining the
        // two elbows exactly on the merge line.
        lines.push(<line key={`if-spine-${node.id}`} x1={centerX} y1={node.y + IF_H / 2} x2={centerX} y2={mergeY} stroke={sc.lineColor} strokeWidth="2" />);

      } else if (isLoopType(node.type) && node.bodyLayout) {
        const bodyX = node.bodyX as number;
        const returnX = node.returnX as number;
        const mergeY = node.mergeY as number;

        // Loop body column hangs from the right vertex of the header hexagon
        lines.push(<line key={`loop-edge-${node.id}`} x1={centerX + LOOP_W / 2} y1={node.y} x2={bodyX} y2={node.y} stroke={sc.lineColor} strokeWidth="2" />);
        const bodyBranch = renderLinesAndArrows(node.bodyLayout, bodyX, node.y, mergeY, { id: node.id, branch: 'body' });
        lines.push(...bodyBranch.lines);
        inserters.push(...bodyBranch.inserters);

        // Loop-back wire: end of the body -> left -> up -> arrow into the header
        lines.push(<line key={`loop-back-1-${node.id}`} x1={bodyX} y1={mergeY} x2={returnX} y2={mergeY} stroke={sc.lineColor} strokeWidth="2" />);
        lines.push(<line key={`loop-back-2-${node.id}`} x1={returnX} y1={mergeY} x2={returnX} y2={node.y} stroke={sc.lineColor} strokeWidth="2" />);
        lines.push(<line key={`loop-back-3-${node.id}`} x1={returnX} y1={node.y} x2={centerX - LOOP_W / 2 - 1} y2={node.y} stroke={sc.lineColor} strokeWidth="2" markerEnd="url(#arrow)" />);

        // The loop exit leaves the header from its bottom edge
        lines.push(<line key={`loop-exit-${node.id}`} x1={centerX} y1={node.y + LOOP_H / 2} x2={centerX} y2={mergeY} stroke={sc.lineColor} strokeWidth="2" />);
      }

      // The flow leaves this statement from its bottom (its merge line for IF/loops)
      currentY = node.bottom;
    }

    // Deliver the flow to the end of this list
    const tailTarget = parentContext
      ? `branch_end:${parentContext.id}:${parentContext.branch}`
      : 'main_end';

    if (parentContext) {
      // Inside a branch/body: plain wire, the caller closes the elbow back to the
      // spine, so no arrowhead is drawn here.
      lines.push(
        <line
          key={`tail-${tailTarget}`}
          x1={centerX}
          y1={currentY}
          x2={centerX}
          y2={endY}
          stroke={sc.lineColor}
          strokeWidth="2"
        />
      );
      pushInserter(centerX, (currentY + endY) / 2, tailTarget);
    } else {
      // Main flow: arrow into the next statement or into the END oval
      pushConnector(centerX, currentY, endY, tailTarget);
    }

    return { lines, inserters };
  };

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
            if (e.ctrlKey || e.metaKey || e.shiftKey) {
              // Toggle selection on held modifier keys!
              if (selectedBlockIds.includes(node.id)) {
                setSelectedBlockIds(selectedBlockIds.filter(id => id !== node.id));
              } else {
                setSelectedBlockIds([...selectedBlockIds, node.id]);
              }
            } else {
              // Click strictly selects only one block
              setSelectedBlockIds([node.id]);
            }
          }}
          // RIGHT-CLICK / LONG-PRESS TO OPEN CONTEXT MENU (SUPPORT MULTI-SELECTIONS!)
          // Note: onContextMenu also fires on mobile long-press, no separate onTouchEnd needed
          onContextMenu={(e) => {
            e.preventDefault();
            e.stopPropagation();
            
            const isAlreadySelected = selectedBlockIds.includes(node.id);
            if (!isAlreadySelected) {
              setSelectedBlockIds([node.id]); // Click right select on unselected
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

  // CONTEXT MENUS SELECTING BLOCK TYPE TO INSERT
  const handleInsertBlockType = (type: BlockType) => {
    if (activeInserter) {
      addBlock(activeInserter.parentId, type);
      setActiveInserter(null);
    }
  };

  // Connectors are built once per statements/theme change: lines go under the
  // blocks, the "+" inserters go above them.
  const connectors = useMemo(
    () => renderLinesAndArrows(diagramLayout.listLayout, 0, diagramLayout.flowStartY, diagramLayout.flowEndY),
    [diagramLayout, sc, t]
  );

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
            setActiveInserter(null);
          }}
        >
          {/* SVG definitions */}
          <defs>
            {/* Arrowhead: the refX puts the TIP exactly on the end of the line,
                so the arrow lands on the shape border instead of inside it. */}
            <marker
              id="arrow"
              viewBox="0 0 10 10"
              refX="10"
              refY="5"
              markerWidth="4.5"
              markerHeight="4.5"
              markerUnits="strokeWidth"
              orient="auto-start-reverse"
            >
              <path d="M 0 0 L 10 5 L 0 10 z" fill={sc.lineColor} />
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

          {/* 3. Render Visual Nodes Recursively */}
          {renderNodeBlocks(diagramLayout.listLayout)}

          {/* 4. Inserter "+" dots — always painted ON TOP of every block */}
          {connectors.inserters}

          {/* 5. Draw End Oval */}
          <g transform={`translate(0, ${diagramLayout.endOvalY})`}>
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
            className="fixed bg-white rounded-lg shadow-xl border border-slate-200 p-2 grid grid-cols-2 gap-1 w-64 z-50 animate-in fade-in zoom-in-95 duration-100"
            style={{
              left: `${activeInserter.x - 128}px`,
              top: `${activeInserter.y + 10}px`
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="col-span-2 text-[11px] font-bold text-slate-400 uppercase tracking-wider px-2 py-1 flex items-center justify-between">
              <span>{t.canvas.selectBlock}</span>
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
              className="col-span-2 flex items-center justify-between w-full p-1.5 mb-1 rounded border border-transparent hover:border-indigo-300 hover:bg-indigo-50 disabled:opacity-30 disabled:pointer-events-none disabled:cursor-not-allowed transition"
            >
              <span className="flex items-center space-x-2">
                <IconClipboard size={14} className="text-indigo-600" />
                <span className="text-xs font-bold text-slate-700">
                  {language === 'it' ? 'Incolla' : 'Paste'} {copiedBlocks.length > 0 ? `(${copiedBlocks.length})` : ''}
                </span>
              </span>
              <span className="text-[9px] text-slate-400 font-mono font-bold">Ctrl+V</span>
            </button>

            {/* Visual separator between Paste row and the new-block grid. */}
            <div className="col-span-2 h-[1px] bg-slate-200 my-1 mx-1" />

            {/* "New block" subheader so the user knows the following grid is */}
            {/* exclusively for creating new blocks (vs. pasting copies).      */}
            <div className="col-span-2 px-2 pt-1 pb-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
              {language === 'it' ? 'Nuovo blocco' : 'New block'}
            </div>

            <button
              onClick={() => handleInsertBlockType('declare')}
              className="flex items-center space-x-2 p-1.5 rounded hover:bg-yellow-50 text-left border border-transparent hover:border-yellow-200 transition"
            >
              <span className="w-2.5 h-2.5 bg-yellow-300 rounded-sm"></span>
              <span className="text-xs font-semibold text-slate-700">{t.blocks.declare}</span>
            </button>
            
            <button
              onClick={() => handleInsertBlockType('assign')}
              className="flex items-center space-x-2 p-1.5 rounded hover:bg-yellow-50 text-left border border-transparent hover:border-yellow-200 transition"
            >
              <span className="w-2.5 h-2.5 bg-yellow-400 rounded-sm"></span>
              <span className="text-xs font-semibold text-slate-700">{t.blocks.assign}</span>
            </button>
            
            <button
              onClick={() => handleInsertBlockType('input')}
              className="flex items-center space-x-2 p-1.5 rounded hover:bg-cyan-50 text-left border border-transparent hover:border-cyan-200 transition"
            >
              <span className="w-2.5 h-2.5 bg-cyan-300 rounded-sm"></span>
              <span className="text-xs font-semibold text-slate-700">{t.blocks.input}</span>
            </button>
            
            <button
              onClick={() => handleInsertBlockType('output')}
              className="flex items-center space-x-2 p-1.5 rounded hover:bg-green-50 text-left border border-transparent hover:border-green-200 transition"
            >
              <span className="w-2.5 h-2.5 bg-green-400 rounded-sm"></span>
              <span className="text-xs font-semibold text-slate-700">{t.blocks.output}</span>
            </button>
            
            <button
              onClick={() => handleInsertBlockType('if')}
              className="flex items-center space-x-2 p-1.5 rounded hover:bg-orange-50 text-left border border-transparent hover:border-orange-200 transition"
            >
              <span className="w-2.5 h-2.5 bg-rose-400 rounded-sm"></span>
              <span className="text-xs font-semibold text-slate-700">{t.blocks.if}</span>
            </button>
            
            <button
              onClick={() => handleInsertBlockType('while')}
              className="flex items-center space-x-2 p-1.5 rounded hover:bg-rose-50 text-left border border-transparent hover:border-rose-200 transition"
            >
              <span className="w-2.5 h-2.5 bg-orange-300 rounded-sm"></span>
              <span className="text-xs font-semibold text-slate-700">{t.blocks.while}</span>
            </button>
            
            <button
              onClick={() => handleInsertBlockType('for')}
              className="flex items-center space-x-2 p-1.5 rounded hover:bg-rose-50 text-left border border-transparent hover:border-rose-200 transition"
            >
              <span className="w-2.5 h-2.5 bg-orange-400 rounded-sm"></span>
              <span className="text-xs font-semibold text-slate-700">{t.blocks.for}</span>
            </button>
            
            <button
              onClick={() => handleInsertBlockType('do')}
              className="flex items-center space-x-2 p-1.5 rounded hover:bg-rose-50 text-left border border-transparent hover:border-rose-200 transition"
            >
              <span className="w-2.5 h-2.5 bg-orange-500 rounded-sm"></span>
              <span className="text-xs font-semibold text-slate-700">{t.blocks.do}</span>
            </button>
            
            <button
              onClick={() => handleInsertBlockType('call')}
              className="flex items-center space-x-2 p-1.5 rounded hover:bg-blue-50 text-left border border-transparent hover:border-blue-200 transition"
            >
              <span className="w-2.5 h-2.5 bg-purple-400 rounded-sm"></span>
              <span className="text-xs font-semibold text-slate-700">{t.blocks.call}</span>
            </button>
            
            <button
              onClick={() => handleInsertBlockType('comment')}
              className="flex items-center space-x-2 p-1.5 rounded hover:bg-slate-50 text-left border border-transparent hover:border-slate-200 transition"
            >
              <span className="w-2.5 h-2.5 bg-slate-400 rounded-sm"></span>
              <span className="text-xs font-semibold text-slate-700">{t.blocks.comment}</span>
            </button>
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
