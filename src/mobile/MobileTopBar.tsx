import React from 'react';
import { useFlow } from '../context/FlowContext';
import { IconPlay, IconStep, IconPause, IconStop } from '../components/EmojiIcons';
import { M2IconButton, M2MenuIcon } from './Material2';

export interface MobileTopBarProps { onOpenDrawer: () => void; }

export const MobileTopBar: React.FC<MobileTopBarProps> = ({ onOpenDrawer }) => {
  const { executionStatus, startRun, stepRun, pauseRun, stopRun, programTitle } = useFlow();
  const status = typeof executionStatus === 'string' ? executionStatus : 'idle';
  const active = status === 'running' || status === 'paused' || status === 'input_pause';
  return (
    <header className="m2-topbar" role="banner">
      <M2IconButton aria-label="Open navigation drawer" title="Open menu" onClick={onOpenDrawer}><M2MenuIcon /></M2IconButton>
      <span className="m2-topbar__title">{programTitle || 'Flowonline2'}</span>
      <span className={`m2-status ${status === 'running' ? 'is-running' : ''}`} aria-label={`Execution status: ${status}`} />
      <div className="m2-topbar__actions" role="toolbar" aria-label="Execution controls">
        <M2IconButton aria-label="Run" title="Run" disabled={active} onClick={() => startRun?.()}><IconPlay size={20} /></M2IconButton>
        <M2IconButton aria-label="Step" title="Step" disabled={status === 'running'} onClick={() => stepRun?.()}><IconStep size={20} /></M2IconButton>
        <M2IconButton aria-label="Pause" title="Pause" disabled={status !== 'running'} onClick={() => pauseRun?.()}><IconPause size={20} /></M2IconButton>
        <M2IconButton aria-label="Stop" title="Stop" disabled={!active} onClick={() => stopRun?.()}><IconStop size={20} /></M2IconButton>
      </div>
    </header>
  );
};
