import React, { useState } from 'react';
import { useFlow } from '../context/FlowContext';
import { M2Button } from './Material2';

export const MobileConsoleView: React.FC = () => {
  const { consoleMessages, submitInput, clearConsole } = useFlow();
  const [value, setValue] = useState('');
  const submit = () => { if (!value.trim()) return; submitInput?.(value); setValue(''); };
  return (
    <section className="m2-view" aria-label="Execution console">
      <div className="m2-console" role="log" aria-live="polite">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}><strong>Console</strong><M2Button variant="text" onClick={() => clearConsole?.()}>Clear</M2Button></div>
        {(consoleMessages || []).map((message: any) => <div className="m2-console__line" key={message.id}>{message.text}</div>)}
        {(!consoleMessages || consoleMessages.length === 0) && <div style={{ color: '#bdbdbd' }}>Run the flowchart to see output here.</div>}
        <div className="m2-console__input"><input value={value} onChange={(event) => setValue(event.target.value)} onKeyDown={(event) => { if (event.key === 'Enter') submit(); }} placeholder="Enter a value" aria-label="Console input" /><button type="button" onClick={submit}>Send</button></div>
      </div>
    </section>
  );
};
