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

  // Active highlights
  const highlightClass = isHighlighted 
    ? "stroke-red-600 stroke-[4px] filter drop-shadow-[0_0_8px_rgba(239,68,68,0.7)] animate-pulse" 
    : "stroke-slate-700 stroke-[1.5px] hover:stroke-slate-900";

  // Text helper
  const truncateText = (str: string, max = 22) => {
    if (str.length > max) return str.substring(0, max - 3) + '...';
    return str;
  };

  // MAIN BLOCK
  if (type === 'main') {
    return (
      <g className="cursor-pointer" onDoubleClick={onDoubleClick}>
        <defs>
          <linearGradient id="mainGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#c8e6c9" />
            <stop offset="100%" stopColor="#4caf50" />
          </linearGradient>
        </defs>
        {/* Oval shape */}
        <rect
          x="-50"
          y="-20"
          width="100"
          height="40"
          rx="20"
          fill="url(#mainGrad)"
          className={highlightClass}
        />
        <text
          textAnchor="middle"
          dominantBaseline="central"
          className="fill-slate-950 font-sans font-bold text-sm select-none pointer-events-none"
        >
          {t.main}
        </text>
      </g>
    );
  }

  // END BLOCK
  if (type === 'end') {
    return (
      <g>
        <defs>
          <linearGradient id="endGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#ffcdd2" />
            <stop offset="100%" stopColor="#ef5350" />
          </linearGradient>
        </defs>
        {/* Oval shape */}
        <rect
          x="-50"
          y="-20"
          width="100"
          height="40"
          rx="20"
          fill="url(#endGrad)"
          className={highlightClass}
        />
        <text
          textAnchor="middle"
          dominantBaseline="central"
          className="fill-slate-950 font-sans font-bold text-sm select-none pointer-events-none"
        >
          {t.end}
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
            <linearGradient id="declareGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#fffde7" />
              <stop offset="100%" stopColor="#fdd835" />
            </linearGradient>
          </defs>
          {/* Rectangle with slight indent inside */}
          <rect
            x="-90"
            y="-25"
            width="180"
            height="50"
            rx="4"
            fill="url(#declareGrad)"
            className={highlightClass}
          />
          {/* Inner horizontal decoration line like standard Flowgorithm declare */}
          <line x1="-90" y1="-18" x2="90" y2="-18" className="stroke-yellow-600/50 stroke-1 pointer-events-none" />
          
          <text
            y="-5"
            textAnchor="middle"
            className="fill-slate-800 font-sans text-[11px] font-semibold tracking-wide uppercase select-none pointer-events-none"
          >
            {t.declare}
          </text>
          <text
            y="12"
            textAnchor="middle"
            className="fill-slate-950 font-mono text-[12px] font-bold select-none pointer-events-none"
          >
            {truncateText(displayLabel, 20)}
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
            <linearGradient id="assignGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#fffde7" />
              <stop offset="100%" stopColor="#fdd835" />
            </linearGradient>
          </defs>
          <rect
            x="-90"
            y="-25"
            width="180"
            height="50"
            rx="4"
            fill="url(#assignGrad)"
            className={highlightClass}
          />
          <text
            y="-5"
            textAnchor="middle"
            className="fill-slate-800 font-sans text-[11px] font-semibold tracking-wide uppercase select-none pointer-events-none"
          >
            {t.assign}
          </text>
          <text
            y="12"
            textAnchor="middle"
            className="fill-slate-950 font-mono text-[12px] font-bold select-none pointer-events-none"
          >
            {truncateText(displayLabel, 20)}
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
              <stop offset="0%" stopColor="#e0f7fa" />
              <stop offset="100%" stopColor="#4dd0e1" />
            </linearGradient>
          </defs>
          {/* Parallelogram slanting right */}
          <polygon
            points="-80,-25 100,-25 80,25 -100,25"
            fill="url(#inputGrad)"
            className={highlightClass}
          />
          <text
            y="-5"
            textAnchor="middle"
            className="fill-slate-800 font-sans text-[11px] font-semibold tracking-wide uppercase select-none pointer-events-none"
          >
            {t.input}
          </text>
          <text
            y="12"
            textAnchor="middle"
            className="fill-slate-950 font-mono text-[12px] font-bold select-none pointer-events-none"
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
              <stop offset="0%" stopColor="#e8f5e9" />
              <stop offset="100%" stopColor="#81c784" />
            </linearGradient>
          </defs>
          {/* Parallelogram slanting right (output has slanting in opposite/same depending on preference, Flowgorithm has same cyan layout) */}
          <polygon
            points="-80,-25 100,-25 80,25 -100,25"
            fill="url(#outputGrad)"
            className={highlightClass}
          />
          <text
            y="-5"
            textAnchor="middle"
            className="fill-slate-800 font-sans text-[11px] font-semibold tracking-wide uppercase select-none pointer-events-none"
          >
            {t.output}
          </text>
          <text
            y="12"
            textAnchor="middle"
            className="fill-slate-950 font-mono text-[12px] font-bold select-none pointer-events-none"
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
              <stop offset="0%" stopColor="#ffe0b2" />
              <stop offset="100%" stopColor="#ffb74d" />
            </linearGradient>
          </defs>
          {/* Diamond shape */}
          <polygon
            points="0,-35 75,0 0,35 -75,0"
            fill="url(#ifGrad)"
            className={highlightClass}
          />
          <text
            y="-6"
            textAnchor="middle"
            className="fill-slate-800 font-sans text-[11px] font-semibold tracking-wide uppercase select-none pointer-events-none"
          >
            {t.if}
          </text>
          <text
            y="10"
            textAnchor="middle"
            className="fill-slate-950 font-mono text-[11px] font-bold select-none pointer-events-none"
          >
            {truncateText(displayLabel, 11)}
          </text>
          {renderDeleteBtn(onDeleteClick, 50, -10)}
        </g>
      );
    }

    case 'while': {
      const displayLabel = statement.condition;
      return (
        <g className="group cursor-pointer" onDoubleClick={onDoubleClick}>
          <defs>
            <linearGradient id="whileGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#ffebee" />
              <stop offset="100%" stopColor="#e57373" />
            </linearGradient>
          </defs>
          {/* Hexagon shape */}
          <polygon
            points="-60,-25 60,-25 80,0 60,25 -60,25 -80,0"
            fill="url(#whileGrad)"
            className={highlightClass}
          />
          <text
            y="-5"
            textAnchor="middle"
            className="fill-slate-800 font-sans text-[11px] font-semibold tracking-wide uppercase select-none pointer-events-none"
          >
            {t.while}
          </text>
          <text
            y="12"
            textAnchor="middle"
            className="fill-slate-950 font-mono text-[12px] font-bold select-none pointer-events-none"
          >
            {truncateText(displayLabel, 20)}
          </text>
          {renderDeleteBtn(onDeleteClick, 65, -10)}
        </g>
      );
    }

    case 'for': {
      const displayLabel = `${statement.variableName} = ${statement.startValue} to ${statement.endValue}`;
      return (
        <g className="group cursor-pointer" onDoubleClick={onDoubleClick}>
          <defs>
            <linearGradient id="forGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#ffebee" />
              <stop offset="100%" stopColor="#e57373" />
            </linearGradient>
          </defs>
          {/* Hexagon shape */}
          <polygon
            points="-80,-25 80,-25 95,0 80,25 -80,25 -95,0"
            fill="url(#forGrad)"
            className={highlightClass}
          />
          <text
            y="-5"
            textAnchor="middle"
            className="fill-slate-800 font-sans text-[11px] font-semibold tracking-wide uppercase select-none pointer-events-none"
          >
            {t.for}
          </text>
          <text
            y="12"
            textAnchor="middle"
            className="fill-slate-950 font-mono text-[12px] font-bold select-none pointer-events-none"
          >
            {truncateText(displayLabel, 22)}
          </text>
          {renderDeleteBtn(onDeleteClick, 80, -10)}
        </g>
      );
    }

    case 'do': {
      const displayLabel = statement.condition;
      return (
        <g className="group cursor-pointer" onDoubleClick={onDoubleClick}>
          <defs>
            <linearGradient id="doGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#ffebee" />
              <stop offset="100%" stopColor="#e57373" />
            </linearGradient>
          </defs>
          <polygon
            points="-60,-25 60,-25 80,0 60,25 -60,25 -80,0"
            fill="url(#doGrad)"
            className={highlightClass}
          />
          <text
            y="-5"
            textAnchor="middle"
            className="fill-slate-800 font-sans text-[11px] font-semibold tracking-wide uppercase select-none pointer-events-none"
          >
            {t.do}
          </text>
          <text
            y="12"
            textAnchor="middle"
            className="fill-slate-950 font-mono text-[12px] font-bold select-none pointer-events-none"
          >
            {truncateText(displayLabel, 20)}
          </text>
          {renderDeleteBtn(onDeleteClick, 65, -10)}
        </g>
      );
    }

    case 'call': {
      const displayLabel = `${statement.functionName}(${statement.arguments || ''})`;
      return (
        <g className="group cursor-pointer" onDoubleClick={onDoubleClick}>
          <defs>
            <linearGradient id="callGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#e3f2fd" />
              <stop offset="100%" stopColor="#64b5f6" />
            </linearGradient>
          </defs>
          {/* Double line vertical borders on left and right */}
          <rect
            x="-90"
            y="-25"
            width="180"
            height="50"
            rx="4"
            fill="url(#callGrad)"
            className={highlightClass}
          />
          <line x1="-82" y1="-25" x2="-82" y2="25" className="stroke-blue-700 stroke-[1.5]" />
          <line x1="82" y1="-25" x2="82" y2="25" className="stroke-blue-700 stroke-[1.5]" />

          <text
            y="-5"
            textAnchor="middle"
            className="fill-slate-800 font-sans text-[11px] font-semibold tracking-wide uppercase select-none pointer-events-none"
          >
            {t.call}
          </text>
          <text
            y="12"
            textAnchor="middle"
            className="fill-slate-950 font-mono text-[12px] font-bold select-none pointer-events-none"
          >
            {truncateText(displayLabel, 20)}
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
            rx="4"
            fill="#fafafa"
            stroke="#9e9e9e"
            strokeDasharray="4 4"
            className={isHighlighted ? "stroke-red-500 stroke-[3px] filter drop-shadow" : "hover:stroke-slate-900"}
          />
          <text
            y="-5"
            textAnchor="middle"
            className="fill-slate-500 font-sans text-[11px] font-semibold tracking-wide uppercase select-none pointer-events-none"
          >
            {t.comment}
          </text>
          <text
            y="12"
            textAnchor="middle"
            className="fill-slate-700 font-mono text-[12px] italic select-none pointer-events-none"
          >
            {truncateText(displayLabel, 20)}
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
        className="font-sans font-bold text-[10px] select-none pointer-events-none"
      >
        ×
      </text>
    </g>
  );
};
