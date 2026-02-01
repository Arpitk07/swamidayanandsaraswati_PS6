import { motion } from 'framer-motion';
import { useEmergencyStore } from '../store/useEmergencyStore';
import { Button } from '../components/Button';

export function Landing() {
    const { setRole } = useEmergencyStore();

    return (
        <div className="min-h-screen flex items-center justify-center px-4">
            <div className="w-full max-w-4xl">
                {/* Hero */}
                <motion.div
                    className="text-center mb-16"
                    initial={{ opacity: 0, y: -50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ type: 'spring', stiffness: 200 }}
                >
                    <h1 className="font-display text-7xl md:text-8xl font-bold text-danger mb-4 leading-none">
                        RoadAssist
                    </h1>
                    <p className="text-2xl text-light/70">
                        Emergency road help at your fingertips
                    </p>
                </motion.div>

                {/* Role selection */}
                <div className="grid md:grid-cols-2 gap-8">
                    {/* Citizen */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2, type: 'spring' }}
                    >
                        <div className="card p-8 hover:border-danger transition-all cursor-pointer group h-full flex flex-col justify-between">
                            <div>
                                <div className="text-6xl mb-6">🆘</div>
                                <h2 className="font-display text-3xl font-bold text-light mb-3">
                                    I Need Help
                                </h2>
                                <p className="text-muted mb-6">
                                    Get emergency roadside assistance quickly
                                </p>
                                <ul className="space-y-2 text-sm text-muted">
                                    <li>✓ Find nearest mechanic</li>
                                    <li>✓ Live tracking</li>
                                    <li>✓ Real-time updates</li>
                                </ul>
                            </div>
                            <Button
                                variant="primary"
                                className="w-full mt-8"
                                onClick={() => setRole('citizen')}
                            >
                                Request Assistance
                            </Button>
                        </div>
                    </motion.div>

                    {/* Mechanic */}
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3, type: 'spring' }}
                    >
                        <div className="card p-8 hover:border-success transition-all cursor-pointer group h-full flex flex-col justify-between">
                            <div>
                                <div className="text-6xl mb-6">🔧</div>
                                <h2 className="font-display text-3xl font-bold text-light mb-3">
                                    I'm a Mechanic
                                </h2>
                                <p className="text-muted mb-6">
                                    Manage jobs and help people in need
                                </p>
                                <ul className="space-y-2 text-sm text-muted">
                                    <li>✓ View assigned jobs</li>
                                    <li>✓ Share your location</li>
                                    <li>✓ Update job status</li>
                                </ul>
                            </div>
                            <Button
                                variant="secondary"
                                className="w-full mt-8 group-hover:border-success"
                                onClick={() => setRole('mechanic')}
                            >
                                View Jobs
                            </Button>
                        </div>
                    </motion.div>
                </div>

                {/* Footer info */}
                <motion.div
                    className="text-center mt-16 text-sm text-muted"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                >
                    <p>🚀 Powered by AI-driven emergency response</p>
                </motion.div>
            </div>
        </div>
    );
}
