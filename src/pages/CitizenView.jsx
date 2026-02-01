import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useEmergencyStore } from '../store/useEmergencyStore';
import { api } from '../services/api';
import { socketService } from '../services/websocket';
import { getCurrentLocation } from '../services/geolocation';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { StatusBadge } from '../components/StatusBadge';
import { LocationTracker } from '../components/LocationTracker';

export function CitizenView() {
    const [requestText, setRequestText] = useState('');
    const [loading, setLoading] = useState(false);
    const [location, setLocation] = useState(null);

    const {
        currentRequest,
        requestStatus,
        assignedMechanic,
        distance,
        eta,
        submitRequest,
    } = useEmergencyStore();

    // Get user location on mount
    useEffect(() => {
        getCurrentLocation().then(setLocation);
    }, []);

    // Connect WebSocket
    useEffect(() => {
        if (currentRequest) {
            socketService.connect();
            return () => socketService.disconnect();
        }
    }, [currentRequest]);

    const handleSubmitRequest = async (e) => {
        e.preventDefault();
        if (!requestText.trim()) return;

        setLoading(true);
        try {
            const userLocation = location || { lat: 21.1458, lon: 79.0882 };

            const response = await api.requestAssistance({
                text: requestText,
                lat: userLocation.lat,
                lon: userLocation.lon,
            });

            submitRequest({
                ...response,
                text: requestText,
                location: userLocation,
            });
        } catch (error) {
            console.error('Failed to submit request:', error);
            alert('Failed to submit request. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    // Requesting help view
    if (!currentRequest) {
        return (
            <div className="min-h-screen flex items-center justify-center px-4">
                <motion.div
                    className="w-full max-w-md"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ type: 'spring' }}
                >
                    {/* Hero section */}
                    <div className="text-center mb-8">
                        <motion.h1
                            className="font-display text-6xl font-bold text-danger mb-4"
                            initial={{ y: -50, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.2 }}
                        >
                            Emergency
                        </motion.h1>
                        <motion.p
                            className="text-lg text-muted"
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.3 }}
                        >
                            We'll get help to you fast
                        </motion.p>
                    </div>

                    {/* Request form */}
                    <Card>
                        <form onSubmit={handleSubmitRequest} className="space-y-6">
                            <div>
                                <label
                                    htmlFor="problem"
                                    className="block text-sm font-display font-semibold text-light mb-2"
                                >
                                    What's the problem?
                                </label>
                                <textarea
                                    id="problem"
                                    className="w-full bg-void border-xs border-light/30 text-light px-4 py-3 focus:border-danger focus:outline-none transition-colors resize-none"
                                    rows="4"
                                    placeholder="e.g., Car broke down near flyover, flat tire..."
                                    value={requestText}
                                    onChange={(e) => setRequestText(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="flex items-center gap-3 text-sm text-muted">
                                <span className="text-xl">📍</span>
                                <span>
                                    {location
                                        ? 'Location detected'
                                        : 'Using default location...'}
                                </span>
                            </div>

                            <Button
                                type="submit"
                                variant="primary"
                                loading={loading}
                                className="w-full"
                            >
                                {loading ? 'Requesting Help...' : 'Get Help Now'}
                            </Button>
                        </form>
                    </Card>
                </motion.div>
            </div>
        );
    }

    // Tracking view
    return (
        <div className="min-h-screen px-4 py-8">
            <div className="max-w-2xl mx-auto">
                {/* Header */}
                <motion.div
                    className="text-center mb-8"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <h1 className="font-display text-4xl font-bold text-light mb-2">
                        Help is on the way
                    </h1>
                    <p className="text-muted">Request ID: {currentRequest.request_id}</p>
                </motion.div>

                {/* Status badge */}
                <div className="flex justify-center mb-8">
                    <StatusBadge status={requestStatus} />
                </div>

                {/* Location tracker */}
                <div className="flex justify-center mb-12">
                    <LocationTracker
                        distance={distance}
                        eta={eta}
                        mechanicName={assignedMechanic?.name}
                    />
                </div>

                {/* Mechanic details */}
                {assignedMechanic && (
                    <Card className="mb-6">
                        <h3 className="font-display text-xl font-semibold text-light mb-4">
                            Your Mechanic
                        </h3>
                        <div className="flex items-center gap-4">
                            <div className="text-5xl">{assignedMechanic.avatar}</div>
                            <div className="flex-1">
                                <p className="font-display font-semibold text-light text-lg">
                                    {assignedMechanic.name}
                                </p>
                                <p className="text-sm text-muted">
                                    {assignedMechanic.specialization}
                                </p>
                                <p className="text-sm text-muted">
                                    {assignedMechanic.vehicle}
                                </p>
                                <div className="flex items-center gap-1 mt-2">
                                    <span className="text-warning">⭐</span>
                                    <span className="text-sm font-semibold text-light">
                                        {assignedMechanic.rating}
                                    </span>
                                </div>
                            </div>
                            <a
                                href={`tel:${assignedMechanic.phone}`}
                                className="btn-primary px-4 py-2"
                            >
                                📞 Call
                            </a>
                        </div>
                    </Card>
                )}

                {/* Problem description */}
                <Card>
                    <h3 className="font-display text-lg font-semibold text-light mb-2">
                        Your Request
                    </h3>
                    <p className="text-muted">{currentRequest.text}</p>
                </Card>
            </div>
        </div>
    );
}
