import { useEffect, useRef } from 'react';
import { Terminal as XTerm } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';
import 'xterm/css/xterm.css';

interface TerminalProps {
  logs: string[];
  className?: string;
}

export function Terminal({ logs, className = '' }: TerminalProps) {
  const terminalRef = useRef<HTMLDivElement>(null);
  const xtermRef = useRef<XTerm | null>(null);
  const fitAddonRef = useRef<FitAddon | null>(null);
  const lastLogIndexRef = useRef(0);

  useEffect(() => {
    if (!terminalRef.current) return;

    const xterm = new XTerm({
      theme: {
        background: '#1f2937',
        foreground: '#e5e7eb',
        cursor: '#0db7ed',
        selectionBackground: '#3b82f680',
      },
      fontFamily: 'Monaco, "Cascadia Code", "Fira Code", monospace',
      fontSize: 13,
      lineHeight: 1.2,
      cursorBlink: false,
      disableStdin: true,
      scrollback: 5000,
    });

    const fitAddon = new FitAddon();
    xterm.loadAddon(fitAddon);

    xterm.open(terminalRef.current);
    fitAddon.fit();

    xtermRef.current = xterm;
    fitAddonRef.current = fitAddon;

    const handleResize = () => {
      fitAddon.fit();
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      xterm.dispose();
    };
  }, []);

  useEffect(() => {
    if (!xtermRef.current) return;

    // Only write new logs
    const newLogs = logs.slice(lastLogIndexRef.current);
    for (const log of newLogs) {
      xtermRef.current.writeln(log.replace(/\r?\n$/, ''));
    }
    lastLogIndexRef.current = logs.length;
  }, [logs]);

  return (
    <div
      ref={terminalRef}
      className={`bg-gray-800 rounded-lg overflow-hidden ${className}`}
      style={{ minHeight: '300px' }}
    />
  );
}
