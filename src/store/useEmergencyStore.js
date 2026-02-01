import { create } from 'zustand';
import { socketService } from '../services/websocket';

/**
 * Global state store for emergency requests
 */
export const useEmergencyStore = create((set, get) => ({
    // User role
    role: null, // 'citizen' | 'mechanic' | null
    setRole: (role) => set({ role }),

    // Current request state
    currentRequest: null,
    requestStatus: null,

    // Mechanic info
    assignedMechanic: null,

    // Real-time data
    liveLocation: null,
    distance: null,
    eta: null,

    // WebSocket connection
    isConnected: false,

    /**
     * Submit emergency assistance request
     */
    submitRequest: (requestData) => {
        set({
            currentRequest: requestData,
            requestStatus: 'assigned',
            assignedMechanic: requestData.mechanic,
            eta: requestData.eta_minutes,
            distance: requestData.distance_meters
        });

        // Subscribe to live updates
        socketService.subscribe('status_update', (payload) => {
            get().updateLiveStatus(payload);
        });
    },

    /**
     * Update live status from WebSocket
     */
    updateLiveStatus: (payload) => {
        set({
            requestStatus: payload.status,
            distance: payload.distance_meters,
            eta: payload.eta_minutes
        });
    },

    /**
     * Update mechanic location
     */
    updateMechanicLocation: (location) => {
        set({ liveLocation: location });
    },

    /**
     * Reset all state
     */
    reset: () => {
        set({
            currentRequest: null,
            requestStatus: null,
            assignedMechanic: null,
            liveLocation: null,
            distance: null,
            eta: null
        });
    },

    /**
     * Set connection status
     */
    setConnected: (isConnected) => set({ isConnected }),
}));
