import React from 'react';
import { Statement, Language } from '../types/flow';
import { translations } from '../utils/translations';

interface BlockNodeProps {
  statement?: Statement;
  type?: 'main' | 'end';
  isHighlighted?: boolean;
  onDoubleClick?: () => void;
  onDeleteClick?: (e: React.MouseEvent) => void;
  lang: Language;
}

export const BlockNode: React.FC<BlockNodeProps> = ({
  statement,
  type,
  isHighlighted = false,
  onDoubleClick,
  onDeleteClick,
  lang
}) => {
  const t = translations[lang].blocks;

  // Active executing or selected highlights
  const highlightClass = isHighlighted 
    ? "stroke-amber-500 stroke-[4px] filter drop-shadow-[0_0_12px_rgba(245,158,11,0.9)] animate-pulse" 
    : "stroke-[#555] stroke-[2px] hover:stroke-slate-900 transition-colors";

  // Text helper
  const truncateText = (str: string, max = 22) => {
    if (str.length > max) return str.substring(0, max - 3) + '...';
    return str;
  };

  // MAIN BLOCK (Terminal - Purple/Lavender in Flowgorithm/Flowonline)
  if (type === 'main') {
    return (
      <g className="cursor-pointer" onDoubleClick={onDoubleClick}>
        <defs>
          <linearGradient id="mainGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#D8C0EC" />
            <stop offset="100%" stopColor="#C0A0DC" />
          </linearGradient>
        </defs>
        {/* Rounded oval terminal shape */}
        <rect
          x="-75"
          y="-19"
          width="150"
          height="38"
          rx="19"
          fill="url(#mainGrad)"
          stroke="#5B2C8B"
          strokeWidth="2"
          className={isHighlighted ? "stroke-amber-500 stroke-[4px] filter drop-shadow-[0_0_12px_rgba(245,158,11,0.9)] animate-pulse" : "hover:stroke-slate-900"}
        />
        <text
          textAnchor="middle"
          dominantBaseline="central"
          className="fill-[#5B2C8B] font-sans font-bold text-xs select-none pointer-events-none tracking-wide"
        >
          {t.main.toUpperCase()}
        </text>
      </g>
    );
  }

  // END BLOCK (Terminal - Purple/Lavender)
  if (type === 'end') {
    return (
      <g>
        <defs>
          <linearGradient id="endGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#D8C0EC" />
            <stop offset="100%" stopColor="#C0A0DC" />
          </linearGradient>
        </defs>
        {/* Rounded oval terminal shape */}
        <rect
          x="-75"
          y="-19"
          width="150"
          height="38"
          rx="19"
          fill="url(#endGrad)"
          stroke="#5B2C8B"
          strokeWidth="2"
          className={isHighlighted ? "stroke-amber-500 stroke-[4px] filter drop-shadow-[0_0_12px_rgba(245,158,11,0.9)] animate-pulse" : "hover:stroke-slate-900"}
        />
        <text
          textAnchor="middle"
          dominantBaseline="central"
          className="fill-[#5B2C8B] font-sans font-bold text-xs select-none pointer-events-none tracking-wide"
        >
          {t.end.toUpperCase()}
        </text>
      </g>
    );
  }

  if (!statement) return null;

  // Render individual flowchart blocks
  switch (statement.type) {
    case 'declare': {
      const isArrayText = statement.isArray ? `[${statement.arraySize}]` : '';
      const displayLabel = `${statement.variableName}${isArrayText} : ${statement.variableType}`;
      return (
        <g className="group cursor-pointer" onDoubleClick={onDoubleClick}>
          <defs>
            <linearGradient id="processGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#FAF4B5" />
              <stop offset="100%" stopColor="#F2E98A" />
            </linearGradient>
          </defs>
          {/* Folder Tab Decoration for Declare (Matches Flowgorithm/Flowonline perfectly!) */}
          <path
            d="M -75 -25 L -75 -32 L -35 -32 L -30 -25 Z"
            fill="url(#processGrad)"
            stroke="#A89A1F"
            strokeWidth="2"
          />
          <line x1="-74" y1="-25" x2="-31" y2="-25" stroke="#FAF4B5" strokeWidth="3" />
          
          {/* Main rectangle box */}
          <rect
            x="-90"
            y="-25"
            width="180"
            height="50"
            fill="url(#processGrad)"
            stroke="#A89A1F"
            strokeWidth="2"
            className={highlightClass}
          />
          {/* Inner horizontal decoration line like standard Declare */}
          <line x1="-90" y1="-17" x2="90" y2="-17" className="stroke-[#A89A1F]/40 stroke-[1.5px] pointer-events-none" />
          
          <text
            y="-6"
            textAnchor="middle"
            className="fill-amber-900/60 font-sans text-[9px] font-extrabold tracking-wider uppercase select-none pointer-events-none"
          >
            {t.declare}
          </text>
          <text
            y="12"
            textAnchor="middle"
            className="fill-slate-950 font-mono text-[11px] font-bold select-none pointer-events-none"
          >
            {truncateText(displayLabel, 22)}
          </text>
          {renderDeleteBtn(onDeleteClick)}
        </g>
      );
    }

    case 'assign': {
      const displayLabel = `${statement.variableName} = ${statement.expression}`;
      return (
        <g className="group cursor-pointer" onDoubleClick={onDoubleClick}>
          <defs>
            <linearGradient id="processGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#FAF4B5" />
              <stop offset="100%" stopColor="#F2E98A" />
            </linearGradient>
          </defs>
          <rect
            x="-90"
            y="-25"
            width="180"
            height="50"
            fill="url(#processGrad)"
            stroke="#A89A1F"
            strokeWidth="2"
            className={highlightClass}
          />
          <text
            y="-6"
            textAnchor="middle"
            className="fill-amber-900/60 font-sans text-[9px] font-extrabold tracking-wider uppercase select-none pointer-events-none"
          >
            {t.assign}
          </text>
          <text
            y="12"
            textAnchor="middle"
            className="fill-slate-950 font-mono text-[11px] font-bold select-none pointer-events-none"
          >
            {truncateText(displayLabel, 22)}
          </text>
          {renderDeleteBtn(onDeleteClick)}
        </g>
      );
    }

    case 'input': {
      const displayLabel = statement.variableName;
      return (
        <g className="group cursor-pointer" onDoubleClick={onDoubleClick}>
          <defs>
            <linearGradient id="inputGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#D5EAFA" />
              <stop offset="100%" stopColor="#9FCDEE" />
            </linearGradient>
          </defs>
          {/* Parallelogram skewed 18deg leftwards (Flowgorithm standard input) */}
          <polygon
            points="-80,-25 100,-25 80,25 -100,25"
            fill="url(#inputGrad)"
            stroke="#4A7BA8"
            strokeWidth="2"
            className={highlightClass}
          />
          <text
            y="-6"
            textAnchor="middle"
            className="fill-blue-900/60 font-sans text-[9px] font-extrabold tracking-wider uppercase select-none pointer-events-none"
          >
            {t.input}
          </text>
          <text
            y="12"
            textAnchor="middle"
            className="fill-slate-950 font-mono text-[11px] font-bold select-none pointer-events-none"
          >
            {truncateText(displayLabel, 20)}
          </text>
          {renderDeleteBtn(onDeleteClick)}
        </g>
      );
    }

    case 'output': {
      const displayLabel = statement.expression;
      return (
        <g className="group cursor-pointer" onDoubleClick={onDoubleClick}>
          <defs>
            <linearGradient id="outputGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#D0F2D0" />
              <stop offset="100%" stopColor="#9FDB9F" />
            </linearGradient>
          </defs>
          <polygon
            points="-80,-25 100,-25 80,25 -100,25"
            fill="url(#outputGrad)"
            stroke="#3F8B3F"
            strokeWidth="2"
            className={highlightClass}
          />
          <text
            y="-6"
            textAnchor="middle"
            className="fill-green-900/60 font-sans text-[9px] font-extrabold tracking-wider uppercase select-none pointer-events-none"
          >
            {t.output}
          </text>
          <text
            y="12"
            textAnchor="middle"
            className="fill-slate-950 font-mono text-[11px] font-bold select-none pointer-events-none"
          >
            {truncateText(displayLabel, 20)}
          </text>
          {renderDeleteBtn(onDeleteClick)}
        </g>
      );
    }

    case 'if': {
      const displayLabel = statement.condition;
      return (
        <g className="group cursor-pointer" onDoubleClick={onDoubleClick}>
          <defs>
            <linearGradient id="ifGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#FCD2E6" />
              <stop offset="100%" stopColor="#F4A3C8" />
            </linearGradient>
          </defs>
          {/* Diamond shape (If is Rose/Pink in Flowgorithm/Flowonline!) */}
          <polygon
            points="0,-32 80,0 0,32 -80,0"
            fill="url(#ifGrad)"
            stroke="#B03F70"
            strokeWidth="2"
            className={highlightClass}
          />
          <text
            y="-6"
            textAnchor="middle"
            className="fill-rose-900/60 font-sans text-[9px] font-extrabold tracking-wider uppercase select-none pointer-events-none"
          >
            {t.if}
          </text>
          <text
            y="10"
            textAnchor="middle"
            className="fill-slate-950 font-mono text-[11px] font-bold select-none pointer-events-none"
          >
            {truncateText(displayLabel, 12)}
          </text>
          {renderDeleteBtn(onDeleteClick, 55, -12)}
        </g>
      );
    }

    case 'while': {
      const displayLabel = statement.condition;
      return (
        <g className="group cursor-pointer" onDoubleClick={onDoubleClick}>
          <defs>
            <linearGradient id="loopGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#FCE2C4" />
              <stop offset="100%" stopColor="#F2B36B" />
            </linearGradient>
          </defs>
          {/* Hexagon shape (Loops are soft orange in Flowgorithm/Flowonline) */}
          <polygon
            points="-65,-25 65,-25 80,0 65,25 -65,25 -80,0"
            fill="url(#loopGrad)"
            stroke="#B57B3F"
            strokeWidth="2"
            className={highlightClass}
          />
          <text
            y="-6"
            textAnchor="middle"
            className="fill-orange-900/60 font-sans text-[9px] font-extrabold tracking-wider uppercase select-none pointer-events-none"
          >
            {t.while}
          </text>
          <text
            y="12"
            textAnchor="middle"
            className="fill-slate-950 font-mono text-[11px] font-bold select-none pointer-events-none"
          >
            {truncateText(displayLabel, 22)}
          </text>
          {renderDeleteBtn(onDeleteClick, 65, -12)}
        </g>
      );
    }

    case 'for': {
      const displayLabel = `${statement.variableName} = ${statement.startValue} to ${statement.endValue}`;
      return (
        <g className="group cursor-pointer" onDoubleClick={onDoubleClick}>
          <defs>
            <linearGradient id="loopGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#FCE2C4" />
              <stop offset="100%" stopColor="#F2B36B" />
            </linearGradient>
          </defs>
          <polygon
            points="-80,-25 80,-25 95,0 80,25 -80,25 -95,0"
            fill="url(#loopGrad)"
            stroke="#B57B3F"
            strokeWidth="2"
            className={highlightClass}
          />
          <text
            y="-6"
            textAnchor="middle"
            className="fill-orange-900/60 font-sans text-[9px] font-extrabold tracking-wider uppercase select-none pointer-events-none"
          >
            {t.for}
          </text>
          <text
            y="12"
            textAnchor="middle"
            className="fill-slate-950 font-mono text-[11px] font-bold select-none pointer-events-none"
          >
            {truncateText(displayLabel, 24)}
          </text>
          {renderDeleteBtn(onDeleteClick, 80, -12)}
        </g>
      );
    }

    case 'do': {
      const displayLabel = statement.condition;
      return (
        <g className="group cursor-pointer" onDoubleClick={onDoubleClick}>
          <defs>
            <linearGradient id="loopGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#FCE2C4" />
              <stop offset="100%" stopColor="#F2B36B" />
            </linearGradient>
          </defs>
          <polygon
            points="-65,-25 65,-25 80,0 65,25 -65,25 -80,0"
            fill="url(#loopGrad)"
            stroke="#B57B3F"
            strokeWidth="2"
            className={highlightClass}
          />
          <text
            y="-6"
            textAnchor="middle"
            className="fill-orange-900/60 font-sans text-[9px] font-extrabold tracking-wider uppercase select-none pointer-events-none"
          >
            {t.do}
          </text>
          <text
            y="12"
            textAnchor="middle"
            className="fill-slate-950 font-mono text-[11px] font-bold select-none pointer-events-none"
          >
            {truncateText(displayLabel, 22)}
          </text>
          {renderDeleteBtn(onDeleteClick, 65, -12)}
        </g>
      );
    }

    case 'call': {
      const displayLabel = `${statement.functionName}(${statement.arguments || ''})`;
      return (
        <g className="group cursor-pointer" onDoubleClick={onDoubleClick}>
          <defs>
            <linearGradient id="callGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#E9DBF5" />
              <stop offset="100%" stopColor="#C9ABE2" />
            </linearGradient>
          </defs>
          <rect
            x="-90"
            y="-25"
            width="180"
            height="50"
            fill="url(#callGrad)"
            stroke="#6B3C8C"
            strokeWidth="2"
            className={highlightClass}
          />
          {/* Double vertical line borders inside */}
          <line x1="-81" y1="-25" x2="-81" y2="25" className="stroke-[#6B3C8C] stroke-[1.5px]" />
          <line x1="81" y1="-25" x2="81" y2="25" className="stroke-[#6B3C8C] stroke-[1.5px]" />

          <text
            y="-6"
            textAnchor="middle"
            className="fill-purple-900/60 font-sans text-[9px] font-extrabold tracking-wider uppercase select-none pointer-events-none"
          >
            {t.call}
          </text>
          <text
            y="12"
            textAnchor="middle"
            className="fill-slate-950 font-mono text-[11px] font-bold select-none pointer-events-none"
          >
            {truncateText(displayLabel, 22)}
          </text>
          {renderDeleteBtn(onDeleteClick)}
        </g>
      );
    }

    case 'comment': {
      const displayLabel = statement.text;
      return (
        <g className="group cursor-pointer" onDoubleClick={onDoubleClick}>
          <rect
            x="-90"
            y="-25"
            width="180"
            height="50"
            rx="2"
            fill="#FFFFFF"
            stroke="#888"
            strokeWidth="1.5"
            strokeDasharray="4 4"
            className={isHighlighted ? "stroke-amber-500 stroke-[3px] filter drop-shadow" : "hover:stroke-slate-900"}
          />
          <text
            y="-6"
            textAnchor="middle"
            className="fill-slate-400 font-sans text-[9px] font-extrabold tracking-wider uppercase select-none pointer-events-none"
          >
            {t.comment}
          </text>
          <text
            y="12"
            textAnchor="middle"
            className="fill-slate-600 font-sans text-[11px] italic select-none pointer-events-none"
          >
            {truncateText(displayLabel, 22)}
          </text>
          {renderDeleteBtn(onDeleteClick)}
        </g>
      );
    }

    default:
      return null;
  }
};

const renderDeleteBtn = (onDeleteClick?: (e: React.MouseEvent) => void, xOffset = 75, yOffset = -20) => {
  if (!onDeleteClick) return null;
  return (
    <g
      className="opacity-0 group-hover:opacity-100 transition-opacity duration-150 cursor-pointer"
      onClick={(e) => {
        e.stopPropagation();
        onDeleteClick(e);
      }}
      transform={`translate(${xOffset}, ${yOffset})`}
    >
      <circle r="9" fill="#ef4444" className="stroke-white stroke-1 hover:fill-red-700 shadow-md" />
      <text
        textAnchor="middle"
        dominantBaseline="central"
        fill="white"
        className="font-sans font-bold text-[10px] select-none pointer-events-none animate-in fade-in duration-100"
      >
        ×
      </text>
    </g>
  );
};
