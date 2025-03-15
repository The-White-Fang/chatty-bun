
declare module 'bun' {
  export type WebSocketHandler = {
    message(ws: WebSocket, message: string | Uint8Array): void;
    open?(ws: WebSocket): void;
    close?(ws: WebSocket, code: number, reason: string): void;
    drain?(ws: WebSocket): void;
    ping?(ws: WebSocket): void;
    pong?(ws: WebSocket): void;
  };

  export interface Server {
    port: number;
    hostname: string;
    development: boolean;
  }

  export function serve(options: {
    port?: number;
    hostname?: string;
    development?: boolean;
    websocket?: WebSocketHandler;
    fetch?: (request: Request) => Response | Promise<Response>;
  }): Server;
}

declare interface ImportMeta {
  main: boolean;
}
