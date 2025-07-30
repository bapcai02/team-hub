declare module 'socket.io-client' {
  import { EventEmitter } from 'events';

  export interface Socket extends EventEmitter {
    id: string;
    connected: boolean;
    disconnected: boolean;
    
    connect(): Socket;
    disconnect(): Socket;
    close(): Socket;
    
    emit(event: string, ...args: any[]): Socket;
    on(event: string, listener: (...args: any[]) => void): Socket;
    off(event: string, listener?: (...args: any[]) => void): Socket;
    
    // Additional methods
    join(room: string): Socket;
    leave(room: string): Socket;
  }

  export interface Manager {
    open(): Manager;
    connect(): Manager;
    disconnect(): Manager;
  }

  export interface ManagerOptions {
    autoConnect?: boolean;
    transports?: string[];
    [key: string]: any;
  }

  export function io(uri?: string, opts?: ManagerOptions): Socket;
  export function io(uri?: string, opts?: ManagerOptions): Socket;
} 