import { EventEmitter } from '@libp2p/interfaces/events';
import type { Connection } from '@libp2p/interface-connection';
import type { Upgrader, Listener, ListenerEvents } from '@libp2p/interface-transport';
import type { Multiaddr } from '@multiformats/multiaddr';
import type { TCPCreateListenerOptions } from './index.js';
import type { CounterGroup, MetricGroup, Metrics } from '@libp2p/interface-metrics';
export interface CloseServerOnMaxConnectionsOpts {
    /** Server listens once connection count is less than `listenBelow` */
    listenBelow: number;
    /** Close server once connection count is greater than or equal to `closeAbove` */
    closeAbove: number;
    onListenError?: (err: Error) => void;
}
interface Context extends TCPCreateListenerOptions {
    handler?: (conn: Connection) => void;
    upgrader: Upgrader;
    socketInactivityTimeout?: number;
    socketCloseTimeout?: number;
    maxConnections?: number;
    metrics?: Metrics;
    closeServerOnMaxConnections?: CloseServerOnMaxConnectionsOpts;
}
export interface TCPListenerMetrics {
    status: MetricGroup;
    errors: CounterGroup;
    events: CounterGroup;
}
export declare class TCPListener extends EventEmitter<ListenerEvents> implements Listener {
    private readonly context;
    private readonly server;
    /** Keep track of open connections to destroy in case of timeout */
    private readonly connections;
    private status;
    private metrics?;
    private addr;
    constructor(context: Context);
    private onSocket;
    getAddrs(): Multiaddr[];
    listen(ma: Multiaddr): Promise<void>;
    close(): Promise<void>;
    private netListen;
    private netClose;
}
export {};
//# sourceMappingURL=listener.d.ts.map