import { useEffect, useRef, useState, useCallback } from 'react';

interface WebSocketMessage {
  type: string;
  data?: unknown;
  message?: string;
}

export function useWebSocket(url: string | null) {
  const wsRef = useRef<WebSocket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [lastMessage, setLastMessage] = useState<WebSocketMessage | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!url) return;

    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = `${protocol}//${window.location.host}${url}`;

    const ws = new WebSocket(wsUrl);
    wsRef.current = ws;

    ws.onopen = () => {
      setIsConnected(true);
      setError(null);
    };

    ws.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);
        setLastMessage(message);
      } catch {
        // Ignore parse errors
      }
    };

    ws.onerror = () => {
      setError('WebSocket connection error');
    };

    ws.onclose = () => {
      setIsConnected(false);
    };

    return () => {
      ws.close();
    };
  }, [url]);

  const send = useCallback((data: unknown) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(data));
    }
  }, []);

  return { isConnected, lastMessage, error, send };
}

export function useContainerLogs(containerId: string | null) {
  const [logs, setLogs] = useState<string[]>([]);
  const url = containerId ? `/ws/containers/${containerId}/logs` : null;
  const { isConnected, lastMessage, error } = useWebSocket(url);

  useEffect(() => {
    if (lastMessage?.type === 'log' && lastMessage.data) {
      setLogs((prev) => [...prev, lastMessage.data as string].slice(-1000));
    }
  }, [lastMessage]);

  const clearLogs = useCallback(() => {
    setLogs([]);
  }, []);

  return { logs, isConnected, error, clearLogs };
}

export function useContainerStats(containerId: string | null) {
  const [stats, setStats] = useState<unknown | null>(null);
  const url = containerId ? `/ws/containers/${containerId}/stats` : null;
  const { isConnected, lastMessage, error } = useWebSocket(url);

  useEffect(() => {
    if (lastMessage?.type === 'stats') {
      setStats(lastMessage.data);
    }
  }, [lastMessage]);

  return { stats, isConnected, error };
}
