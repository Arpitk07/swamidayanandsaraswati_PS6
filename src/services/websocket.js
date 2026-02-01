import { statusFlow } from '../mocks/data';

const WS_URL = import.meta.env.VITE_WS_URL || 'ws://localhost:3000';
const USE_MOCKS = import.meta.env.VITE_USE_MOCKS !== 'false';

class WebSocketService {
    constructor() {
        this.socket = null;
        this.listeners = new Map();
        this.mockSimulator = null;
        this.currentMockStatus = 'assigned';
    }

    connect() {
        if (USE_MOCKS) {
            console.log('WebSocket: Using Mock Mode');
            this.startMockSimulation();
            return;
        }

        // Real WebSocket connection
        this.socket = new WebSocket(WS_URL);

        this.socket.onopen = () => {
            console.log('WebSocket Connected');
        };

        this.socket.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);
                this.notify(data.type, data.payload);
            } catch (e) {
                console.error('Error parsing WebSocket message:', e);
            }
        };

        this.socket.onclose = () => {
            console.log('WebSocket Disconnected');
        };

        this.socket.onerror = (error) => {
            console.error('WebSocket Error:', error);
        };
    }

    /**
     * Mock WebSocket simulation
     * Simulates status updates based on statusFlow
     */
    startMockSimulation() {
        const simulateStatusChange = () => {
            const currentFlow = statusFlow[this.currentMockStatus];

            if (!currentFlow || !currentFlow.next) {
                console.log('WebSocket Mock: Status flow completed');
                return;
            }

            setTimeout(() => {
                this.currentMockStatus = currentFlow.next;

                // Emit status update event
                this.notify('status_update', {
                    status: this.currentMockStatus,
                    distance_meters: Math.max(100, Math.floor(Math.random() * 2000)),
                    eta_minutes: Math.floor(Math.random() * 10) + 2,
                    timestamp: new Date().toISOString()
                });

                // Continue simulation
                simulateStatusChange();
            }, currentFlow.delay);
        };

        // Start simulation after 2 seconds
        setTimeout(() => {
            simulateStatusChange();
        }, 2000);
    }

    send(type, payload) {
        if (USE_MOCKS) {
            console.log('Mock WS Send:', type, payload);
            return;
        }

        if (this.socket && this.socket.readyState === WebSocket.OPEN) {
            this.socket.send(JSON.stringify({ type, payload }));
        } else {
            console.warn('WebSocket not connected. Cannot send message.');
        }
    }

    subscribe(type, callback) {
        if (!this.listeners.has(type)) {
            this.listeners.set(type, new Set());
        }
        this.listeners.get(type).add(callback);

        // Return unsubscribe function
        return () => {
            if (this.listeners.has(type)) {
                this.listeners.get(type).delete(callback);
            }
        };
    }

    notify(type, payload) {
        if (this.listeners.has(type)) {
            this.listeners.get(type).forEach(callback => callback(payload));
        }
    }

    disconnect() {
        if (this.socket) {
            this.socket.close();
            this.socket = null;
        }
        if (this.mockSimulator) {
            clearTimeout(this.mockSimulator);
            this.mockSimulator = null;
        }
    }

    /**
     * Reset mock simulation (for testing)
     */
    resetMockStatus(status = 'assigned') {
        this.currentMockStatus = status;
    }
}

export const socketService = new WebSocketService();
