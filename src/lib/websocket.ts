import { getStoredSession } from './api';

type WsMessage = {
	type: string;
	payload: unknown;
};

type EventHandler = (payload: unknown) => void;

const RECONNECT_BASE_MS = 1000;
const RECONNECT_MAX_MS = 30_000;

class WebSocketClient {
	private ws: WebSocket | null = null;
	private handlers = new Map<string, Set<EventHandler>>();
	private reconnectTimer: ReturnType<typeof setTimeout> | null = null;
	private reconnectAttempt = 0;
	private destroyed = false;
	private pendingUrl: string | null = null;

	private getUrl(): string | null {
		const session = getStoredSession();
		if (!session?.access) return null;

		const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
		const base = import.meta.env.VITE_API_URL ?? '/api';
		if (base.startsWith('http')) {
			return base.replace(/^http/, 'ws') + '/ws?token=' + encodeURIComponent(session.access);
		}
		return `${protocol}//${window.location.host}${base}/ws?token=${encodeURIComponent(session.access)}`;
	}

	connect() {
		if (this.destroyed) return;

		const url = this.getUrl();
		if (!url) return;

		this.pendingUrl = url;
		this.doConnect(url);
	}

	private doConnect(url: string) {
		if (this.ws) {
			this.ws.onclose = null;
			this.ws.onerror = null;
			this.ws.onmessage = null;
			this.ws.close();
		}

		try {
			this.ws = new WebSocket(url);
		} catch {
			this.scheduleReconnect();
			return;
		}

		this.ws.onopen = () => {
			this.reconnectAttempt = 0;
		};

		this.ws.onmessage = (event) => {
			try {
				const msg = JSON.parse(event.data) as WsMessage;
				const eventHandlers = this.handlers.get(msg.type);
				if (eventHandlers) {
					for (const handler of eventHandlers) {
						handler(msg.payload);
					}
				}
			} catch {
				// ignore malformed messages
			}
		};

		this.ws.onclose = () => {
			this.ws = null;
			if (!this.destroyed) {
				this.scheduleReconnect();
			}
		};

		this.ws.onerror = () => {
			this.ws?.close();
		};
	}

	private scheduleReconnect() {
		if (this.destroyed || this.reconnectTimer) return;

		const delay = Math.min(
			RECONNECT_BASE_MS * 2 ** this.reconnectAttempt,
			RECONNECT_MAX_MS,
		);
		this.reconnectAttempt++;

		this.reconnectTimer = setTimeout(() => {
			this.reconnectTimer = null;
			if (this.pendingUrl) {
				this.doConnect(this.pendingUrl);
			}
		}, delay);
	}

	on(event: string, handler: EventHandler) {
		if (!this.handlers.has(event)) {
			this.handlers.set(event, new Set());
		}
		this.handlers.get(event)!.add(handler);
	}

	off(event: string, handler: EventHandler) {
		const eventHandlers = this.handlers.get(event);
		if (eventHandlers) {
			eventHandlers.delete(handler);
			if (eventHandlers.size === 0) {
				this.handlers.delete(event);
			}
		}
	}

	disconnect() {
		this.destroyed = true;
		if (this.reconnectTimer) {
			clearTimeout(this.reconnectTimer);
			this.reconnectTimer = null;
		}
		if (this.ws) {
			this.ws.onclose = null;
			this.ws.onerror = null;
			this.ws.onmessage = null;
			this.ws.close();
			this.ws = null;
		}
		this.handlers.clear();
	}

	reconnect() {
		if (this.reconnectTimer) {
			clearTimeout(this.reconnectTimer);
			this.reconnectTimer = null;
		}
		this.reconnectAttempt = 0;
		this.connect();
	}
}

export const wsClient = new WebSocketClient();
