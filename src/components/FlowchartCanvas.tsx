import React, { useState, useMemo, useEffect } from 'react';
import { useFlow, findBlockById } from '../context/FlowContext';
import { Statement, BlockType } from '../types/flow';
import { BlockNode, colorSchemes } from './BlockNode';
import { translations } from '../utils/translations';

interface LayoutNode {
  id: string;
  type: string;
  statement?: Statement;
  width: number;
  height: number;
  x: number;
  y: number;
  
  // Children
  thenLayout?: ListLayout;
  elseLayout?: ListLayout;
  bodyLayout?: ListLayout;
}

interface ListLayout {
  nodes: LayoutNode[];
  width: number;
  height: number;
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

  // CONSTANTS FOR VISUALS
  const NODE_W = 180;
  const NODE_H = 50;
  const MAIN_H = 40;
  const IF_W = 150;
  const IF_H = 70;
  const LOOP_W = 160;
  const LOOP_H = 50;
  const V_GAP = 40; // distance between statements
  const H_GAP = 50; // horizontal branch distance

  // RECURSIVE LAYOUT ENGINE (pure client-side, calculates dimensions in single-pass)
  const computeListLayout = (list: Statement[]): ListLayout => {
    const nodes: LayoutNode[] = [];
    let currentY = 0;
    let maxWidth = NODE_W;

    for (let i = 0; i < list.length; i++) {
      const stmt = list[i];
      let width = NODE_W;
      let height = NODE_H;
      let thenLayout: ListLayout | undefined;
      let elseLayout: ListLayout | undefined;
      let bodyLayout: ListLayout | undefined;

      if (stmt.type === 'if') {
        thenLayout = computeListLayout(stmt.thenBranch);
        elseLayout = computeListLayout(stmt.elseBranch);
        width = Math.max(IF_W, thenLayout.width + elseLayout.width + H_GAP);
        height = IF_H + Math.max(thenLayout.height, elseLayout.height) + V_GAP;
      } else if (stmt.type === 'while' || stmt.type === 'for' || stmt.type === 'do') {
        bodyLayout = computeListLayout(stmt.body);
        width = Math.max(LOOP_W, bodyLayout.width + H_GAP * 1.5);
        height = LOOP_H + bodyLayout.height + V_GAP;
      }

      nodes.push({
        id: stmt.id,
        type: stmt.type,
        statement: stmt,
        width,
        height,
        x: 0, // patched later
        y: currentY,
        thenLayout,
        elseLayout,
        bodyLayout
      });

      maxWidth = Math.max(maxWidth, width);
      currentY += height + V_GAP;
    }

    return {
      nodes,
      width: maxWidth,
      height: currentY > 0 ? currentY - V_GAP : 0
    };
  };

  // RECURSIVE COORDINATE PATH ALIGNMENT
  const alignCoordinates = (
    layout: ListLayout, 
    centerX: number, 
    startY: number
  ): void => {
    let currentY = startY;

    for (const node of layout.nodes) {
      node.x = centerX;
      node.y = currentY + (node.type === 'if' ? IF_H / 2 : node.type === 'while' || node.type === 'for' || node.type === 'do' ? LOOP_H / 2 : NODE_H / 2);

      if (node.type === 'if' && node.thenLayout && node.elseLayout) {
        // center then on left, else on right
        const totalW = node.thenLayout.width + node.elseLayout.width + H_GAP;
        const leftX = centerX - totalW / 2 + node.thenLayout.width / 2;
        const rightX = centerX + totalW / 2 - node.elseLayout.width / 2;
        
        const branchStartY = currentY + IF_H + V_GAP / 2;
        alignCoordinates(node.thenLayout, leftX, branchStartY);
        alignCoordinates(node.elseLayout, rightX, branchStartY);
      } else if ((node.type === 'while' || node.type === 'for' || node.type === 'do') && node.bodyLayout) {
        const bodyX = centerX + H_GAP / 2;
        const branchStartY = currentY + LOOP_H + V_GAP / 2;
        alignCoordinates(node.bodyLayout, bodyX, branchStartY);
      }

      currentY += node.height + V_GAP;
    }
  };

  // GENERATE LAYOUT & DIMENSIONS
  const diagramLayout = useMemo(() => {
    const listLayout = computeListLayout(statements);
    const startY = MAIN_H + V_GAP;
    alignCoordinates(listLayout, 0, startY);
    
    const endY = startY + listLayout.height + (statements.length > 0 ? V_GAP : 0) + MAIN_H / 2;
    const totalHeight = endY + MAIN_H / 2 + 50;
    const totalWidth = Math.max(600, listLayout.width * 1.5 + 200);

    return {
      listLayout,
      startY,
      endY,
      width: totalWidth,
      height: totalHeight
    };
  }, [statements]);

  // RENDERING HELPERS FOR CONNECTOR SVG LINES
  const renderLinesAndArrows = (
    layout: ListLayout, 
    centerX: number, 
    startY: number, 
    endY: number,
    parentContext?: { id: string; branch: 'then' | 'else' | 'body' } // DOCK PARENT CONTEXT PARAMS!
  ): JSX.Element[] => {
    const elements: JSX.Element[] = [];
    let currentY = startY;

    // Draw lines between nodes
    for (let i = 0; i < layout.nodes.length; i++) {
      const node = layout.nodes[i];

      // Draw top arrow/line to this node
      const nodeTopY = node.y - (node.type === 'if' ? IF_H / 2 : node.type === 'while' || node.type === 'for' || node.type === 'do' ? LOOP_H / 2 : NODE_H / 2);
      
      elements.push(
        <g key={`arrow-to-${node.id}`}>
          <line
            x1={centerX}
            y1={currentY}
            x2={centerX}
            y2={nodeTopY}
            stroke={sc.lineColor}
            strokeWidth="2"
            markerEnd="url(#arrow)"
          />
          {renderInserterButton(centerX, currentY + (nodeTopY - currentY) / 2, node.id, i)}
        </g>
      );

      // Draw children connectors
      if (node.type === 'if' && node.thenLayout && node.elseLayout) {
        const diamondCenterY = node.y;
        const branchEndY = diamondCenterY - IF_H / 2 + node.height;

        const leftX = node.thenLayout.nodes.length > 0 ? node.thenLayout.nodes[0].x : centerX - (node.thenLayout.width + node.elseLayout.width + H_GAP) / 2 + node.thenLayout.width / 2;
        const rightX = node.elseLayout.nodes.length > 0 ? node.elseLayout.nodes[0].x : centerX + (node.thenLayout.width + node.elseLayout.width + H_GAP) / 2 - node.elseLayout.width / 2;

        // FALSE branch on the left (elseBranch is FALSE in original Flowgorithm desktop!)
        elements.push(
          <g key={`if-else-${node.id}`}>
            {/* Horizontal line out to left (False) */}
            <line x1={centerX} y1={diamondCenterY} x2={leftX} y2={diamondCenterY} stroke={sc.lineColor} strokeWidth="2" />
            <text x={(centerX + leftX) / 2} y={diamondCenterY - 6} textAnchor="middle" fill={sc.textColor} fillOpacity="0.7" className="font-sans text-[10px] font-bold select-none">FALSO (False)</text>
            
            {/* Draw child else branch statements recursively on the LEFT side passing the parent context! */}
            {renderLinesAndArrows(node.elseLayout, leftX, diamondCenterY, branchEndY, { id: node.id, branch: 'else' })}
            
            {/* Return from left branch back to main path */}
            <line x1={leftX} y1={branchEndY} x2={leftX} y2={branchEndY + V_GAP / 2} stroke={sc.lineColor} strokeWidth="2" />
            <line x1={leftX} y1={branchEndY + V_GAP / 2} x2={centerX} y2={branchEndY + V_GAP / 2} stroke={sc.lineColor} strokeWidth="2" />
          </g>
        );

        // TRUE branch on the right (thenBranch is TRUE in original Flowgorithm desktop!)
        elements.push(
          <g key={`if-then-${node.id}`}>
            {/* Horizontal line out to right (True) */}
            <line x1={centerX} y1={diamondCenterY} x2={rightX} y2={diamondCenterY} stroke={sc.lineColor} strokeWidth="2" />
            <text x={(centerX + rightX) / 2} y={diamondCenterY - 6} textAnchor="middle" fill="green" className="font-sans text-[10px] font-bold select-none">VERO (True)</text>
            
            {/* Draw child then branch statements recursively on the RIGHT side passing the parent context! */}
            {renderLinesAndArrows(node.thenLayout, rightX, diamondCenterY, branchEndY, { id: node.id, branch: 'then' })}
            
            {/* Return from right branch back to main path */}
            <line x1={rightX} y1={branchEndY} x2={rightX} y2={branchEndY + V_GAP / 2} stroke={sc.lineColor} strokeWidth="2" />
            <line x1={rightX} y1={branchEndY + V_GAP / 2} x2={centerX} y2={branchEndY + V_GAP / 2} stroke={sc.lineColor} strokeWidth="2" />
          </g>
        );

      } else if ((node.type === 'while' || node.type === 'for' || node.type === 'do') && node.bodyLayout) {
        const loopCenterY = node.y;
        const bodyX = centerX + H_GAP / 2;
        const bodyEndY = loopCenterY - LOOP_H / 2 + node.height;

        // Loop feed-in vertical line
        elements.push(
          <g key={`loop-body-${node.id}`}>
            {/* Horizontal branch out of loop */}
            <line x1={centerX} y1={loopCenterY} x2={bodyX} y2={loopCenterY} stroke={sc.lineColor} strokeWidth="2" />
            
            {/* Recurse body recursively passing the parent context! */}
            {renderLinesAndArrows(node.bodyLayout, bodyX, loopCenterY, bodyEndY, { id: node.id, branch: 'body' })}
            
            {/* Return wire lines representing Flowgorithm's loop back loops */}
            <line x1={bodyX} y1={bodyEndY} x2={bodyX} y2={bodyEndY + V_GAP / 2} stroke={sc.lineColor} strokeWidth="2" />
            {/* Left wire returning back up and left to loop header */}
            <line x1={bodyX} y1={bodyEndY + V_GAP / 2} x2={centerX - H_GAP / 2} y2={bodyEndY + V_GAP / 2} stroke={sc.lineColor} strokeWidth="2" />
            <line x1={centerX - H_GAP / 2} y1={bodyEndY + V_GAP / 2} x2={centerX - H_GAP / 2} y2={loopCenterY} stroke={sc.lineColor} strokeWidth="2" />
            <line x1={centerX - H_GAP / 2} y1={loopCenterY} x2={centerX} y2={loopCenterY} stroke={sc.lineColor} strokeWidth="2" markerEnd="url(#arrow)" />
          </g>
        );
      }

      currentY = node.y + (node.type === 'if' ? IF_H / 2 + V_GAP : node.type === 'while' || node.type === 'for' || node.type === 'do' ? LOOP_H / 2 + V_GAP : NODE_H / 2 + V_GAP);
      if (node.type === 'if') currentY -= V_GAP / 2; // IF bottom junction adjustment
    }

    // Connect last node to end of list
    const endTargetId = parentContext 
      ? `branch_end:${parentContext.id}:${parentContext.branch}`
      : 'main_end';

    elements.push(
      <g key={`arrow-to-list-end`}>
        <line
          x1={centerX}
          y1={currentY}
          x2={centerX}
          y2={endY}
          stroke={sc.lineColor}
          strokeWidth="2"
          markerEnd="url(#arrow)"
        />
        {renderInserterButton(centerX, currentY + (endY - currentY) / 2, endTargetId)}
      </g>
    );

    return elements;
  };

  // DRAW INTERACTIVE INSERTER CIRCULAR BUTTON (Faithful 18px circle, glowing blue, expanding on hover!)
  const renderInserterButton = (
    x: number, 
    y: number, 
    parentId: string | 'main_start' | 'main_end',
    index?: number
  ) => {
    return (
      <g
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
          // RIGHT-CLICK TO OPEN CUSTOM WINDOWS CONTEXT MENU! (SUPPORT MULTI-SELECTIONS!)
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

  const isDark = colorScheme === 'twilight';

  return (
    <div className={`flex-1 flex flex-col h-full relative overflow-hidden select-none border-r border-slate-200 ${isDark ? 'bg-zinc-900' : 'bg-white'}`}>
      
      {/* SVG Canvas Workspace with Engineering Graph-Paper Grid Background */}
      <div 
        className="flex-1 overflow-auto p-8 flex items-start justify-center relative"
        style={{
          background: isDark
            ? 'linear-gradient(to right, rgba(255, 255, 255, 0.04) 1px, transparent 1px), linear-gradient(to bottom, rgba(255, 255, 255, 0.04) 1px, transparent 1px), #1e1e1e'
            : 'linear-gradient(to right, rgba(200, 200, 210, 0.15) 1px, transparent 1px), linear-gradient(to bottom, rgba(200, 200, 210, 0.15) 1px, transparent 1px), #FFFFFF',
          backgroundSize: '20px 20px'
        }}
      >
        <svg
          id="flowchart-svg-export-target"
          width={diagramLayout.width * zoom}
          height={diagramLayout.height * zoom}
          viewBox={`${-diagramLayout.width / 2} 0 ${diagramLayout.width} ${diagramLayout.height}`}
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
            <marker
              id="arrow"
              viewBox="0 0 10 10"
              refX="6"
              refY="5"
              markerWidth="6"
              markerHeight="6"
              orient="auto-start-reverse"
            >
              <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill={sc.lineColor} />
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

          {/* 2. Draw Connector Lines & Add Arrows */}
          {renderLinesAndArrows(
            diagramLayout.listLayout,
            0,
            MAIN_H,
            diagramLayout.endY - MAIN_H / 2
          )}

          {/* 3. Render Visual Nodes Recursively */}
          {renderNodeBlocks(diagramLayout.listLayout)}

          {/* 4. Draw End Oval */}
          <g transform={`translate(0, ${diagramLayout.endY})`}>
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
              <span>Seleziona Blocco</span>
              <button
                className="text-slate-400 hover:text-slate-600 font-bold"
                onClick={() => setActiveInserter(null)}
              >
                ×
              </button>
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
                  <span>📝 {language === 'it' ? 'Modifica...' : 'Edit...'}</span>
                </button>
                <div className="h-[1px] bg-slate-300 my-1"></div>
                <button
                  onClick={() => {
                    cutBlocks(selectedBlockIds);
                    setContextMenu(null);
                  }}
                  className="w-full text-left px-3.5 py-1.5 hover:bg-[#C9DEF5] hover:text-slate-900 flex items-center justify-between transition-colors"
                >
                  <span>✂️ {language === 'it' ? 'Taglia' : 'Cut'} ({selectedBlockIds.length})</span>
                  <span className="text-[9px] text-slate-400 font-mono font-bold">Ctrl+X</span>
                </button>
                <button
                  onClick={() => {
                    copyBlocks(selectedBlockIds);
                    setContextMenu(null);
                  }}
                  className="w-full text-left px-3.5 py-1.5 hover:bg-[#C9DEF5] hover:text-slate-900 flex items-center justify-between transition-colors"
                >
                  <span>📋 {language === 'it' ? 'Copia' : 'Copy'} ({selectedBlockIds.length})</span>
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
                  <span>📥 {language === 'it' ? 'Incolla dopo' : 'Paste After'}</span>
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
                  <span>❌ {language === 'it' ? 'Elimina' : 'Delete'} ({selectedBlockIds.length})</span>
                  <span className="text-[9px] text-slate-400 font-mono font-bold">Del</span>
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => {
                    pasteBlocks(contextMenu.parentId!);
                    setContextMenu(null);
                  }}
                  disabled={copiedBlocks.length === 0}
                  className="w-full text-left px-3.5 py-1.5 hover:bg-[#C9DEF5] hover:text-slate-900 flex items-center justify-between disabled:opacity-30 disabled:pointer-events-none transition-colors"
                >
                  <span>📋 {language === 'it' ? 'Incolla Blocco' : 'Paste Block'}</span>
                </button>
                <div className="h-[1px] bg-slate-300 my-1"></div>
                <button
                  onClick={() => {
                    setActiveInserter({
                      parentId: contextMenu.parentId!,
                      index: contextMenu.index,
                      x: contextMenu.x,
                      y: contextMenu.y
                    });
                    setContextMenu(null);
                  }}
                  className="w-full text-left px-3.5 py-1.5 hover:bg-[#C9DEF5] hover:text-slate-900 flex items-center justify-between font-bold transition-colors"
                >
                  <span>➕ {language === 'it' ? 'Inserisci Blocco...' : 'Insert Block...'}</span>
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
