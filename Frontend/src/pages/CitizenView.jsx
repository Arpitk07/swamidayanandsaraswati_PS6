import { useState, useEffect } from 'react';
import { motion, useAnimation, AnimatePresence } from 'framer-motion';
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
    const [showSuccess, setShowSuccess] = useState(false);
    const controls = useAnimation();

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

    // Success animation
    useEffect(() => {
        if (currentRequest && !showSuccess) {
            setShowSuccess(true);
            controls.start({
                scale: [1, 1.2, 1],
                rotate: [0, 10, -10, 0],
                transition: { duration: 0.8 }
            });
        }
    }, [currentRequest, showSuccess, controls]);

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
            <div className="relative min-h-screen flex items-center justify-center px-4 overflow-hidden">
                {/* Animated background */}
                <div className="absolute inset-0 bg-gradient-to-br from-void via-void to-danger/5">
                    <motion.div
                        className="absolute inset-0"
                        animate={{
                            background: [
                                'radial-gradient(circle at 20% 50%, rgba(239, 68, 68, 0.1) 0%, transparent 40%)',
                                'radial-gradient(circle at 80% 50%, rgba(239, 68, 68, 0.1) 0%, transparent 40%)',
                                'radial-gradient(circle at 20% 50%, rgba(239, 68, 68, 0.1) 0%, transparent 40%)'
                            ]
                        }}
                        transition={{ duration: 8, repeat: Infinity }}
                    />
                </div>

                <motion.div
                    className="relative z-10 w-full max-w-2xl"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ type: 'spring', stiffness: 200 }}
                >
                    {/* Hero section */}
                    <div className="text-center mb-12">
                        <motion.div
                            className="inline-block mb-6"
                            animate={{
                                rotate: [0, 5, -5, 0],
                                scale: [1, 1.1, 1]
                            }}
                            transition={{
                                duration: 3,
                                repeat: Infinity,
                                ease: 'easeInOut'
                            }}
                        >
                            <span className="text-8xl">🚨</span>
                        </motion.div>

                        <motion.h1
                            className="font-display text-7xl font-bold text-danger mb-4"
                            initial={{ y: -50, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.2, type: 'spring' }}
                        >
                            Emergency
                        </motion.h1>

                        <motion.div
                            className="h-1 w-32 bg-gradient-to-r from-danger via-warning to-danger mx-auto mb-6"
                            initial={{ scaleX: 0 }}
                            animate={{ scaleX: 1 }}
                            transition={{ delay: 0.4 }}
                        />

                        <motion.p
                            className="text-2xl text-light/70"
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.3 }}
                        >
                            We'll get help to you{' '}
                            <span className="text-warning font-semibold">immediately</span>
                        </motion.p>
                    </div>

                    {/* Request form */}
                    <Card delay={0.4}>
                        <form onSubmit={handleSubmitRequest} className="space-y-6">
                            {/* Problem input */}
                            <div>
                                <motion.label
                                    htmlFor="problem"
                                    className="block text-sm font-display font-semibold text-light mb-3 flex items-center gap-2"
                                    initial={{ x: -20, opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    transition={{ delay: 0.5 }}
                                >
                                    <span className="text-xl">📝</span>
                                    What's the problem?
                                </motion.label>

                                <motion.div
                                    initial={{ y: 20, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ delay: 0.6 }}
                                >
                                    <textarea
                                        id="problem"
                                        className="w-full bg-void border-2 border-light/20 text-light px-5 py-4 focus:border-danger focus:outline-none focus:ring-2 focus:ring-danger/20 transition-all resize-none font-body"
                                        rows="4"
                                        placeholder="e.g., Car broke down near highway flyover, engine won't start..."
                                        value={requestText}
                                        onChange={(e) => setRequestText(e.target.value)}
                                        required
                                    />
                                </motion.div>
                            </div>

                            {/* Location indicator */}
                            <motion.div
                                className="flex items-center gap-3 px-4 py-3 bg-success/10 border border-success/20"
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ delay: 0.7 }}
                            >
                                <motion.span
                                    className="text-2xl"
                                    animate={{ scale: [1, 1.2, 1] }}
                                    transition={{ duration: 2, repeat: Infinity }}
                                >
                                    📍
                                </motion.span>
                                <div className="flex-1">
                                    <div className="text-sm font-semibold text-success">
                                        {location ? 'Location Detected' : 'Getting Location...'}
                                    </div>
                                    <div className="text-xs text-light/60">
                                        {location
                                            ? `${location.lat.toFixed(4)}, ${location.lon.toFixed(4)}`
                                            : 'We\'ll use your current position'}
                                    </div>
                                </div>
                                {location && (
                                    <motion.span
                                        className="text-success"
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        transition={{ type: 'spring' }}
                                    >
                                        ✓
                                    </motion.span>
                                )}
                            </motion.div>

                            {/* Submit button */}
                            <motion.div
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.8 }}
                            >
                                <Button
                                    type="submit"
                                    variant="primary"
                                    loading={loading}
                                    className="w-full text-lg py-5"
                                >
                                    {loading ? 'Finding nearest mechanic...' : (
                                        <>
                                            <span>🚑</span>
                                            <span>Get Help Now</span>
                                        </>
                                    )}
                                </Button>
                            </motion.div>

                            {/* Trust indicators */}
                            <motion.div
                                className="flex items-center justify-center gap-6 text-xs text-muted pt-4"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 1 }}
                            >
                                {[
                                    { icon: '⚡', text: 'Avg 3min response' },
                                    { icon: '🔒', text: 'Secure & Private' },
                                    { icon: '24/7', text: 'Always Available' }
                                ].map((item, i) => (
                                    <motion.div
                                        key={i}
                                        className="flex items-center gap-1"
                                        whileHover={{ scale: 1.1, color: '#F97316' }}
                                    >
                                        <span>{item.icon}</span>
                                        <span>{item.text}</span>
                                    </motion.div>
                                ))}
                            </motion.div>
                        </form>
                    </Card>
                </motion.div>
            </div>
        );
    }

    // Tracking view
    return (
        <div className="min-h-screen px-4 py-8 relative overflow-hidden">
            {/* Background animation */}
            <div className="fixed inset-0 pointer-events-none">
                <motion.div
                    className="absolute inset-0 bg-gradient-to-br from-success/5 via-transparent to-danger/5"
                    animate={{
                        opacity: [0.3, 0.6, 0.3],
                    }}
                    transition={{ duration: 4, repeat: Infinity }}
                />
            </div>

            <div className="relative z-10 max-w-3xl mx-auto">
                {/* Header with success animation */}
                <motion.div
                    className="text-center mb-8"
                    initial={{ opacity: 0, y: -30 }}
                    animate={controls}
                >
                    <motion.div
                        className="inline-block mb-4"
                        animate={{
                            scale: [1, 1.2, 1],
                        }}
                        transition={{
                            duration: 2,
                            repeat: Infinity,
                        }}
                    >
                        <span className="text-6xl">✅</span>
                    </motion.div>

                    <h1 className="font-display text-5xl font-bold text-light mb-2">
                        Help is{' '}
                        <motion.span
                            className="text-success"
                            animate={{ opacity: [1, 0.7, 1] }}
                            transition={{ duration: 1.5, repeat: Infinity }}
                        >
                            confirmed
                        </motion.span>
                    </h1>

                    <motion.p
                        className="text-muted text-sm"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                    >
                        Request ID:{' '}
                        <span className="font-mono text-light">{currentRequest.request_id}</span>
                    </motion.p>
                </motion.div>

                {/* Status badge with pulse */}
                <motion.div
                    className="flex justify-center mb-10"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', delay: 0.2 }}
                >
                    <AnimatePresence mode="wait">
                        <StatusBadge status={requestStatus} />
                    </AnimatePresence>
                </motion.div>

                {/* Location tracker with enhanced animation */}
                <motion.div
                    className="flex justify-center mb-12"
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.4, type: 'spring' }}
                >
                    <LocationTracker
                        distance={distance}
                        eta={eta}
                        mechanicName={assignedMechanic?.name}
                    />
                </motion.div>

                {/* Mechanic details with stagger */}
                {assignedMechanic && (
                    <Card delay={0.5} className="mb-6">
                        <h3 className="font-display text-2xl font-bold text-light mb-6 flex items-center gap-2">
                            <span>👨‍🔧</span>
                            Your Mechanic
                        </h3>

                        <div className="flex items-center gap-6">
                            <motion.div
                                className="text-7xl"
                                animate={{
                                    rotate: [0, 5, -5, 0],
                                }}
                                transition={{
                                    duration: 3,
                                    repeat: Infinity,
                                }}
                            >
                                {assignedMechanic.avatar}
                            </motion.div>

                            <div className="flex-1 space-y-2">
                                <p className="font-display font-bold text-light text-2xl">
                                    {assignedMechanic.name}
                                </p>
                                <p className="text-muted flex items-center gap-2">
                                    <span>🔧</span>
                                    {assignedMechanic.specialization}
                                </p>
                                <p className="text-muted flex items-center gap-2">
                                    <span>🚗</span>
                                    {assignedMechanic.vehicle}
                                </p>
                                <motion.div
                                    className="flex items-center gap-2 mt-3"
                                    whileHover={{ scale: 1.05 }}
                                >
                                    <span className="text-warning text-xl">⭐</span>
                                    <span className="text-lg font-bold text-warning">
                                        {assignedMechanic.rating}
                                    </span>
                                    <span className="text-xs text-muted">/ 5.0</span>
                                </motion.div>
                            </div>

                            <motion.a
                                href={`tel:${assignedMechanic.phone}`}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <Button variant="primary" className="px-6 py-3">
                                    <span>📞</span>
                                    <span>Call</span>
                                </Button>
                            </motion.a>
                        </div>
                    </Card>
                )}

                {/* Problem description */}
                <Card delay={0.6}>
                    <h3 className="font-display text-lg font-semibold text-light mb-3 flex items-center gap-2">
                        <span>📋</span>
                        Your Request
                    </h3>
                    <p className="text-light/80 leading-relaxed">{currentRequest.text}</p>
                </Card>

                {/* Live updates indicator */}
                <motion.div
                    className="mt-8 text-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8 }}
                >
                    <div className="inline-flex items-center gap-2 text-sm text-muted">
                        <motion.span
                            className="w-2 h-2 bg-success rounded-full"
                            animate={{
                                scale: [1, 1.5, 1],
                                opacity: [1, 0.5, 1],
                            }}
                            transition={{
                                duration: 2,
                                repeat: Infinity,
                            }}
                        />
                        <span>Live tracking active</span>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
