import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { api } from '../services/api';
import { watchLocation, formatDistance } from '../services/geolocation';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { StatusBadge } from '../components/StatusBadge';

export function MechanicView() {
    const [currentJob] = useState({
        id: 'REQ-123456',
        citizen_name: 'John Doe',
        problem: 'Car broke down near highway flyover',
        location: { lat: 21.1458, lon: 79.0882 },
        status: 'assigned',
        distance: 2500,
    });

    const [jobStatus, setJobStatus] = useState('assigned');
    const [myLocation, setMyLocation] = useState(null);
    const [isTracking, setIsTracking] = useState(false);

    // Start location tracking
    useEffect(() => {
        if (isTracking) {
            const stopWatching = watchLocation(
                (position) => {
                    setMyLocation(position);
                    // Send location update to backend
                    api.updateMechanicLocation({
                        mechanic_id: 'M01',
                        lat: position.lat,
                        lon: position.lon,
                    });
                },
                (error) => {
                    console.error('Location tracking error:', error);
                }
            );

            return () => {
                if (stopWatching) stopWatching();
            };
        }
    }, [isTracking]);

    const updateStatus = (newStatus) => {
        setJobStatus(newStatus);
        // In real implementation, call API to update status
        console.log('Status updated to:', newStatus);
    };

    const startTracking = () => {
        setIsTracking(true);
        updateStatus('on_the_way');
    };

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
                        Current Job
                    </h1>
                    <p className="text-muted">Job ID: {currentJob.id}</p>
                </motion.div>

                {/* Status */}
                <div className="flex justify-center mb-8">
                    <StatusBadge status={jobStatus} />
                </div>

                {/* Job details */}
                <Card className="mb-6">
                    <h3 className="font-display text-xl font-semibold text-light mb-4">
                        Problem Report
                    </h3>
                    <div className="space-y-3">
                        <div>
                            <p className="text-sm text-muted mb-1">Citizen</p>
                            <p className="text-light font-semibold">{currentJob.citizen_name}</p>
                        </div>
                        <div>
                            <p className="text-sm text-muted mb-1">Issue</p>
                            <p className="text-light">{currentJob.problem}</p>
                        </div>
                        <div>
                            <p className="text-sm text-muted mb-1">Distance</p>
                            <p className="text-light font-semibold">
                                {formatDistance(currentJob.distance)}
                            </p>
                        </div>
                    </div>
                </Card>

                {/* Location tracking status */}
                {isTracking && myLocation && (
                    <Card className="mb-6">
                        <h3 className="font-display text-lg font-semibold text-success mb-2">
                            📍 Location Tracking Active
                        </h3>
                        <p className="text-sm text-muted">
                            Your location is being shared with the customer
                        </p>
                        <p className="text-xs text-muted mt-1">
                            Lat: {myLocation.lat.toFixed(6)}, Lon: {myLocation.lon.toFixed(6)}
                        </p>
                    </Card>
                )}

                {/* Action buttons */}
                <div className="space-y-4">
                    {jobStatus === 'assigned' && (
                        <Button
                            variant="primary"
                            className="w-full"
                            onClick={startTracking}
                        >
                            Start Navigation & Share Location
                        </Button>
                    )}

                    {jobStatus === 'on_the_way' && (
                        <Button
                            variant="success"
                            className="w-full"
                            onClick={() => updateStatus('arriving')}
                        >
                            Mark as Arriving Soon
                        </Button>
                    )}

                    {jobStatus === 'arriving' && (
                        <Button
                            variant="success"
                            className="w-full"
                            onClick={() => updateStatus('arrived')}
                        >
                            Mark as Arrived
                        </Button>
                    )}

                    {jobStatus === 'arrived' && (
                        <Card className="bg-success/10 border-success">
                            <div className="text-center">
                                <p className="text-2xl mb-2">✅</p>
                                <p className="font-display font-semibold text-light">
                                    You've arrived!
                                </p>
                                <p className="text-sm text-muted mt-1">
                                    Contact the customer to complete service
                                </p>
                            </div>
                        </Card>
                    )}

                    {/* Navigation button */}
                    <a
                        href={`https://www.google.com/maps/dir/?api=1&destination=${currentJob.location.lat},${currentJob.location.lon}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block"
                    >
                        <Button variant="secondary" className="w-full">
                            🗺️ Open in Maps
                        </Button>
                    </a>
                </div>
            </div>
        </div>
    );
}
