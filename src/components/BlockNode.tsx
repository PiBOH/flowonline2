import React from 'react';
import { Statement, Language } from '../types/flow';
import { useFlow, ColorSchemeType } from '../context/FlowContext';
import { translations } from '../utils/translations';

interface BlockNodeProps {
  statement?: Statement;
  type?: 'main' | 'end';
  isHighlighted?: boolean;
  onDoubleClick?: () => void;
  onDeleteClick?: (e: React.MouseEvent) => void;
  lang: Language;
}

interface SchemeColors {
  mainStartFill: string;
  mainStartStop: string;
  mainStartStroke: string;
  mainStartText: string;
  processFill: string;
  processStop: string;
  processStroke: string;
  inputFill: string;
  inputStop: string;
  inputStroke: string;
  outputFill: string;
  outputStop: string;
  outputStroke: string;
  ifFill: string;
  ifStop: string;
  ifStroke: string;
  loopFill: string;
  loopStop: string;
  loopStroke: string;
  callFill: string;
  callStop: string;
  callStroke: string;
  commentBg: string;
  commentStroke: string;
  commentText: string;
  textColor: string;
  lineColor: string;
}

export const colorSchemes: Record<ColorSchemeType, SchemeColors> = {
  classic: {
    mainStartFill: "#D8C0EC", mainStartStop: "#C0A0DC", mainStartStroke: "#5B2C8B", mainStartText: "#5B2C8B",
    processFill: "#FAF4B5", processStop: "#F2E98A", processStroke: "#A89A1F",
    inputFill: "#D5EAFA", inputStop: "#9FCDEE", inputStroke: "#4A7BA8",
    outputFill: "#D0F2D0", outputStop: "#9FDB9F", outputStroke: "#3F8B3F",
    ifFill: "#FCD2E6", ifStop: "#F4A3C8", ifStroke: "#B03F70",
    loopFill: "#FCE2C4", loopStop: "#F2B36B", loopStroke: "#B57B3F",
    callFill: "#E9DBF5", callStop: "#C9ABE2", callStroke: "#6B3C8C",
    commentBg: "#FFFFFF", commentStroke: "#888888", commentText: "#666666",
    textColor: "#000000", lineColor: "#555"
  },
  pastel: {
    mainStartFill: "#F4EBFD", mainStartStop: "#E1BEE7", mainStartStroke: "#7B1FA2", mainStartText: "#7B1FA2",
    processFill: "#FFFDE7", processStop: "#FFF9C4", processStroke: "#FBC02D",
    inputFill: "#E1F5FE", inputStop: "#B3E5FC", inputStroke: "#0288D1",
    outputFill: "#E8F5E9", outputStop: "#C8E6C9", outputStroke: "#388E3C",
    ifFill: "#FCE4EC", ifStop: "#F8BBD0", ifStroke: "#C2185B",
    loopFill: "#FFF3E0", loopStop: "#FFE0B2", loopStroke: "#F57C00",
    callFill: "#EDE7F6", callStop: "#D1C4E9", callStroke: "#512DA8",
    commentBg: "#FFFFFF", commentStroke: "#CCCCCC", commentText: "#777777",
    textColor: "#1A1A1A", lineColor: "#666"
  },
  vibrant: {
    mainStartFill: "#E040FB", mainStartStop: "#9C27B0", mainStartStroke: "#4A148C", mainStartText: "#FFFFFF",
    processFill: "#FFFF00", processStop: "#FBC02D", processStroke: "#7F6E00",
    inputFill: "#00E5FF", inputStop: "#0288D1", inputStroke: "#004B87",
    outputFill: "#00E676", outputStop: "#388E3C", outputStroke: "#054B00",
    ifFill: "#FF4081", ifStop: "#C2185B", ifStroke: "#5B0027",
    loopFill: "#FF9100", loopStop: "#E65100", loopStroke: "#6D1B00",
    callFill: "#7C4DFF", callStop: "#512DA8", callStroke: "#1B006D",
    commentBg: "#FFFFFF", commentStroke: "#555555", commentText: "#222222",
    textColor: "#000000", lineColor: "#333"
  },
  retro: {
    mainStartFill: "#B0BEC5", mainStartStop: "#90A4AE", mainStartStroke: "#37474F", mainStartText: "#37474F",
    processFill: "#ECEFF1", processStop: "#CFD8DC", processStroke: "#546E7A",
    inputFill: "#CFD8DC", inputStop: "#B0BEC5", inputStroke: "#455A64",
    outputFill: "#E0F2F1", outputStop: "#B2DFDB", outputStroke: "#00695C",
    ifFill: "#FFEBEE", ifStop: "#FFCDD2", ifStroke: "#C62828",
    loopFill: "#FFF8E1", loopStop: "#FFE082", loopStroke: "#F57F17",
    callFill: "#F3E5F5", callStop: "#E1BEE7", callStroke: "#6A1B9A",
    commentBg: "#FFFFFF", commentStroke: "#999999", commentText: "#555555",
    textColor: "#222222", lineColor: "#444"
  },
  twilight: {
    mainStartFill: "#7B1FA2", mainStartStop: "#4A148C", mainStartStroke: "#CE93D8", mainStartText: "#CE93D8",
    processFill: "#FBC02D", processStop: "#F57F17", processStroke: "#FFF59D",
    inputFill: "#0288D1", inputStop: "#01579B", inputStroke: "#81D4FA",
    outputFill: "#388E3C", outputStop: "#1B5E20", outputStroke: "#A5D6A7",
    ifFill: "#C2185B", ifStop: "#880E4F", ifStroke: "#F48FB1",
    loopFill: "#F57C00", loopStop: "#E65100", loopStroke: "#FFCC80",
    callFill: "#512DA8", callStop: "#311B92", callStroke: "#B39DDB",
    commentBg: "#222222", commentStroke: "#444444", commentText: "#AAAAAA",
    textColor: "#FFFFFF", lineColor: "#CCCCCC"
  },
  black_white: {
    mainStartFill: "#FFFFFF", mainStartStop: "#FFFFFF", mainStartStroke: "#000000", mainStartText: "#000000",
    processFill: "#FFFFFF", processStop: "#FFFFFF", processStroke: "#000000",
    inputFill: "#FFFFFF", inputStop: "#FFFFFF", inputStroke: "#000000",
    outputFill: "#FFFFFF", outputStop: "#FFFFFF", outputStroke: "#000000",
    ifFill: "#FFFFFF", ifStop: "#FFFFFF", ifStroke: "#000000",
    loopFill: "#FFFFFF", loopStop: "#FFFFFF", loopStroke: "#000000",
    callFill: "#FFFFFF", callStop: "#FFFFFF", callStroke: "#000000",
    commentBg: "#FFFFFF", commentStroke: "#000000", commentText: "#000000",
    textColor: "#000000", lineColor: "#000"
  }
};

export const BlockNode: React.FC<BlockNodeProps> = ({
  statement,
  type,
  isHighlighted = false,
  onDoubleClick,
  onDeleteClick,
  lang
}) => {
  const { colorScheme } = useFlow();
  const t = translations[lang].blocks;

  const sc = colorSchemes[colorScheme];

  // Active executing or selected highlights
  const highlightClass = isHighlighted 
    ? "stroke-amber-500 stroke-[4px] filter drop-shadow-[0_0_12px_rgba(245,158,11,0.9)] animate-pulse" 
    : `stroke-[2px] hover:stroke-slate-900 transition-colors`;

  // Text helper
  const truncateText = (str: string, max = 22) => {
    if (str.length > max) return str.substring(0, max - 3) + '...';
    return str;
  };

  const getStrokeColor = (baseStroke: string) => {
    return isHighlighted ? "rgba(245,158,11,0.9)" : baseStroke;
  };

  // MAIN BLOCK (Terminal)
  if (type === 'main') {
    return (
      <g className="cursor-pointer" onDoubleClick={onDoubleClick}>
        <defs>
          <linearGradient id={`mainGrad-${colorScheme}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={sc.mainStartFill} />
            <stop offset="100%" stopColor={sc.mainStartStop} />
          </linearGradient>
        </defs>
        {/* Rounded oval terminal shape */}
        <rect
          x="-75"
          y="-19"
          width="150"
          height="38"
          rx="19"
          fill={`url(#mainGrad-${colorScheme})`}
          stroke={getStrokeColor(sc.mainStartStroke)}
          strokeWidth={isHighlighted ? "4" : "2"}
          className={highlightClass}
        />
        <text
          textAnchor="middle"
          dominantBaseline="central"
          fill={sc.mainStartText}
          className="font-sans font-bold text-xs select-none pointer-events-none tracking-wide"
        >
          {t.main.toUpperCase()}
        </text>
      </g>
    );
  }

  // END BLOCK (Terminal)
  if (type === 'end') {
    return (
      <g>
        <defs>
          <linearGradient id={`endGrad-${colorScheme}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={sc.mainStartFill} />
            <stop offset="100%" stopColor={sc.mainStartStop} />
          </linearGradient>
        </defs>
        {/* Rounded oval terminal shape */}
        <rect
          x="-75"
          y="-19"
          width="150"
          height="38"
          rx="19"
          fill={`url(#endGrad-${colorScheme})`}
          stroke={getStrokeColor(sc.mainStartStroke)}
          strokeWidth={isHighlighted ? "4" : "2"}
          className={highlightClass}
        />
        <text
          textAnchor="middle"
          dominantBaseline="central"
          fill={sc.mainStartText}
          className="font-sans font-bold text-xs select-none pointer-events-none tracking-wide"
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
            <linearGradient id={`processGrad-${colorScheme}`} x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor={sc.processFill} />
              <stop offset="100%" stopColor={sc.processStop} />
            </linearGradient>
          </defs>
          {/* Folder Tab Decoration for Declare (Matches Flowgorithm/Flowonline perfectly!) */}
          <path
            d="M -75 -25 L -75 -32 L -35 -32 L -30 -25 Z"
            fill={`url(#processGrad-${colorScheme})`}
            stroke={sc.processStroke}
            strokeWidth="2"
          />
          <line x1="-74" y1="-25" x2="-31" y2="-25" stroke={sc.processFill} strokeWidth="3" />
          
          {/* Main rectangle box */}
          <rect
            x="-90"
            y="-25"
            width="180"
            height="50"
            fill={`url(#processGrad-${colorScheme})`}
            stroke={getStrokeColor(sc.processStroke)}
            strokeWidth={isHighlighted ? "4" : "2"}
            className={highlightClass}
          />
          {/* Inner horizontal decoration line like standard Declare */}
          <line x1="-90" y1="-17" x2="90" y2="-17" stroke={sc.processStroke} strokeWidth="1.5" strokeOpacity="0.4" className="pointer-events-none" />
          
          <text
            y="-6"
            textAnchor="middle"
            fill={sc.textColor}
            fillOpacity="0.6"
            className="font-sans text-[9px] font-extrabold tracking-wider uppercase select-none pointer-events-none"
          >
            {t.declare}
          </text>
          <text
            y="12"
            textAnchor="middle"
            fill={sc.textColor}
            className="font-mono text-[11px] font-bold select-none pointer-events-none"
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
            <linearGradient id={`processGrad-${colorScheme}`} x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor={sc.processFill} />
              <stop offset="100%" stopColor={sc.processStop} />
            </linearGradient>
          </defs>
          <rect
            x="-90"
            y="-25"
            width="180"
            height="50"
            fill={`url(#processGrad-${colorScheme})`}
            stroke={getStrokeColor(sc.processStroke)}
            strokeWidth={isHighlighted ? "4" : "2"}
            className={highlightClass}
          />
          <text
            y="-6"
            textAnchor="middle"
            fill={sc.textColor}
            fillOpacity="0.6"
            className="font-sans text-[9px] font-extrabold tracking-wider uppercase select-none pointer-events-none"
          >
            {t.assign}
          </text>
          <text
            y="12"
            textAnchor="middle"
            fill={sc.textColor}
            className="font-mono text-[11px] font-bold select-none pointer-events-none"
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
            <linearGradient id={`inputGrad-${colorScheme}`} x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor={sc.inputFill} />
              <stop offset="100%" stopColor={sc.inputStop} />
            </linearGradient>
          </defs>
          {/* Parallelogram slanting right */}
          <polygon
            points="-80,-25 100,-25 80,25 -100,25"
            fill={`url(#inputGrad-${colorScheme})`}
            stroke={getStrokeColor(sc.inputStroke)}
            strokeWidth={isHighlighted ? "4" : "2"}
            className={highlightClass}
          />
          <text
            y="-5"
            textAnchor="middle"
            fill={sc.textColor}
            fillOpacity="0.6"
            className="font-sans text-[11px] font-semibold tracking-wide uppercase select-none pointer-events-none"
          >
            {t.input}
          </text>
          <text
            y="12"
            textAnchor="middle"
            fill={sc.textColor}
            className="font-mono text-[12px] font-bold select-none pointer-events-none"
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
            <linearGradient id={`outputGrad-${colorScheme}`} x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor={sc.outputFill} />
              <stop offset="100%" stopColor={sc.outputStop} />
            </linearGradient>
          </defs>
          <polygon
            points="-80,-25 100,-25 80,25 -100,25"
            fill={`url(#outputGrad-${colorScheme})`}
            stroke={getStrokeColor(sc.outputStroke)}
            strokeWidth={isHighlighted ? "4" : "2"}
            className={highlightClass}
          />
          <text
            y="-5"
            textAnchor="middle"
            fill={sc.textColor}
            fillOpacity="0.6"
            className="font-sans text-[11px] font-semibold tracking-wide uppercase select-none pointer-events-none"
          >
            {t.output}
          </text>
          <text
            y="12"
            textAnchor="middle"
            fill={sc.textColor}
            className="font-mono text-[12px] font-bold select-none pointer-events-none"
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
            <linearGradient id={`ifGrad-${colorScheme}`} x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor={sc.ifFill} />
              <stop offset="100%" stopColor={sc.ifStop} />
            </linearGradient>
          </defs>
          {/* Diamond shape */}
          <polygon
            points="0,-32 80,0 0,32 -80,0"
            fill={`url(#ifGrad-${colorScheme})`}
            stroke={getStrokeColor(sc.ifStroke)}
            strokeWidth={isHighlighted ? "4" : "2"}
            className={highlightClass}
          />
          <text
            y="-6"
            textAnchor="middle"
            fill={sc.textColor}
            fillOpacity="0.6"
            className="font-sans text-[9px] font-extrabold tracking-wider uppercase select-none pointer-events-none"
          >
            {t.if}
          </text>
          <text
            y="10"
            textAnchor="middle"
            fill={sc.textColor}
            className="font-mono text-[11px] font-bold select-none pointer-events-none"
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
            <linearGradient id={`loopGrad-${colorScheme}`} x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor={sc.loopFill} />
              <stop offset="100%" stopColor={sc.loopStop} />
            </linearGradient>
          </defs>
          <polygon
            points="-65,-25 65,-25 80,0 65,25 -65,25 -80,0"
            fill={`url(#loopGrad-${colorScheme})`}
            stroke={getStrokeColor(sc.loopStroke)}
            strokeWidth={isHighlighted ? "4" : "2"}
            className={highlightClass}
          />
          <text
            y="-6"
            textAnchor="middle"
            fill={sc.textColor}
            fillOpacity="0.6"
            className="font-sans text-[9px] font-extrabold tracking-wider uppercase select-none pointer-events-none"
          >
            {t.while}
          </text>
          <text
            y="12"
            textAnchor="middle"
            fill={sc.textColor}
            className="font-mono text-[11px] font-bold select-none pointer-events-none"
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
            <linearGradient id={`loopGrad-${colorScheme}`} x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor={sc.loopFill} />
              <stop offset="100%" stopColor={sc.loopStop} />
            </linearGradient>
          </defs>
          <polygon
            points="-80,-25 80,-25 95,0 80,25 -80,25 -95,0"
            fill={`url(#loopGrad-${colorScheme})`}
            stroke={getStrokeColor(sc.loopStroke)}
            strokeWidth={isHighlighted ? "4" : "2"}
            className={highlightClass}
          />
          <text
            y="-6"
            textAnchor="middle"
            fill={sc.textColor}
            fillOpacity="0.6"
            className="font-sans text-[9px] font-extrabold tracking-wider uppercase select-none pointer-events-none"
          >
            {t.for}
          </text>
          <text
            y="12"
            textAnchor="middle"
            fill={sc.textColor}
            className="font-mono text-[11px] font-bold select-none pointer-events-none"
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
            <linearGradient id={`loopGrad-${colorScheme}`} x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor={sc.loopFill} />
              <stop offset="100%" stopColor={sc.loopStop} />
            </linearGradient>
          </defs>
          <polygon
            points="-65,-25 65,-25 80,0 65,25 -65,25 -80,0"
            fill={`url(#loopGrad-${colorScheme})`}
            stroke={getStrokeColor(sc.loopStroke)}
            strokeWidth={isHighlighted ? "4" : "2"}
            className={highlightClass}
          />
          <text
            y="-6"
            textAnchor="middle"
            fill={sc.textColor}
            fillOpacity="0.6"
            className="font-sans text-[9px] font-extrabold tracking-wider uppercase select-none pointer-events-none"
          >
            {t.do}
          </text>
          <text
            y="12"
            textAnchor="middle"
            fill={sc.textColor}
            className="font-mono text-[11px] font-bold select-none pointer-events-none"
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
            <linearGradient id={`callGrad-${colorScheme}`} x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor={sc.callFill} />
              <stop offset="100%" stopColor={sc.callStop} />
            </linearGradient>
          </defs>
          <rect
            x="-90"
            y="-25"
            width="180"
            height="50"
            fill={`url(#callGrad-${colorScheme})`}
            stroke={getStrokeColor(sc.callStroke)}
            strokeWidth={isHighlighted ? "4" : "2"}
            className={highlightClass}
          />
          {/* Double vertical line borders inside */}
          <line x1="-81" y1="-25" x2="-81" y2="25" stroke={sc.callStroke} strokeWidth="1.5" />
          <line x1="81" y1="-25" x2="81" y2="25" stroke={sc.callStroke} strokeWidth="1.5" />

          <text
            y="-6"
            textAnchor="middle"
            fill={sc.textColor}
            fillOpacity="0.6"
            className="font-sans text-[9px] font-extrabold tracking-wider uppercase select-none pointer-events-none"
          >
            {t.call}
          </text>
          <text
            y="12"
            textAnchor="middle"
            fill={sc.textColor}
            className="font-mono text-[11px] font-bold select-none pointer-events-none"
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
            fill={sc.commentBg}
            stroke={sc.commentStroke}
            strokeWidth="1.5"
            strokeDasharray="4 4"
            className={isHighlighted ? "stroke-amber-500 stroke-[3px] filter drop-shadow" : "hover:stroke-slate-900"}
          />
          <text
            y="-6"
            textAnchor="middle"
            fill={sc.commentText}
            fillOpacity="0.6"
            className="font-sans text-[9px] font-extrabold tracking-wider uppercase select-none pointer-events-none"
          >
            {t.comment}
          </text>
          <text
            y="12"
            textAnchor="middle"
            fill={sc.commentText}
            className="font-sans text-[11px] italic select-none pointer-events-none"
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
