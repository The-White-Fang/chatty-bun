
declare module 'bun' {
  export interface ServerWebSocket<T = unknown> {
    data: T;
    readyState: number;
    send(data: string | ArrayBuffer | Uint8Array): boolean;
    close(code?: number, reason?: string): void;
    ping(data?: string | ArrayBuffer | Uint8Array): void;
    subscribe(topic: string): void;
    unsubscribe(topic: string): void;
    publish(topic: string, data: string | ArrayBuffer | Uint8Array): void;
    isSubscribed(topic: string): boolean;
    
    // Add event handlers
    onopen?: (event: Event) => void;
    onclose?: (event: CloseEvent) => void;
    onmessage?: (event: MessageEvent) => void;
    onerror?: (event: Event) => void;
  }

  export type WebSocketHandler<T = unknown> = {
    message(ws: ServerWebSocket<T>, message: string | Uint8Array): void;
    open?(ws: ServerWebSocket<T>): void | Promise<void>;
    close?(ws: ServerWebSocket<T>, code: number, reason: string): void | Promise<void>;
    drain?(ws: ServerWebSocket<T>): void | Promise<void>;
    ping?(ws: ServerWebSocket<T>): void | Promise<void>;
    pong?(ws: ServerWebSocket<T>): void | Promise<void>;
  };

  export interface Server {
    port: number;
    hostname: string;
    development: boolean;
    upgrade(request: Request): boolean;
  }

  export function serve(options: {
    port?: number;
    hostname?: string;
    development?: boolean;
    websocket?: WebSocketHandler;
    fetch?: (request: Request, server: Server) => Response | Promise<Response>;
  }): Server;
}

declare interface ImportMeta {
  main: boolean;
}

// WebSocket global constants
declare namespace WebSocket {
  const CONNECTING: 0;
  const OPEN: 1;
  const CLOSING: 2;
  const CLOSED: 3;
}
