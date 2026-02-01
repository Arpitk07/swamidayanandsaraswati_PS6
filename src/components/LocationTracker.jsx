import { motion } from 'framer-motion';
import PropTypes from 'prop-types';
import { formatDistance } from '../services/geolocation';

/**
 * Premium location tracker with 3D radar pulse and dynamic ETA
 */
export function LocationTracker({ distance, eta, mechanicName }) {
    return (
        <div className="relative">
            {/* Multi-layer radar pulse animation */}
            <div className="absolute inset-0 flex items-center justify-center">
                {[0, 0.5, 1, 1.5].map((delay) => (
                    <motion.div
                        key={delay}
                        className="absolute w-32 h-32 border-2 border-danger rounded-full"
                        animate={{
                            scale: [1, 2.5],
                            opacity: [0.8, 0],
                        }}
                        transition={{
                            duration: 3,
                            repeat: Infinity,
                            ease: 'easeOut',
                            delay
                        }}
                    />
                ))}
            </div>

            {/* Center GPS pin with 3D effect */}
            <motion.div
                className="relative z-10 flex flex-col items-center justify-center bg-gradient-to-br from-void to-void/80 border-4 border-danger w-32 h-32 rounded-full shadow-2xl"
                initial={{ scale: 0, rotateY: 180 }}
                animate={{ scale: 1, rotateY: 0 }}
                transition={{
                    type: 'spring',
                    stiffness: 200,
                    delay: 0.2
                }}
                whileHover={{
                    scale: 1.1,
                    boxShadow: '0 0 40px rgba(239, 68, 68, 0.6)',
                    transition: { type: 'spring', stiffness: 300 }
                }}
            >
                {/* Glow ring */}
                <motion.div
                    className="absolute -inset-2 bg-danger/20 rounded-full blur-xl"
                    animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.5, 0.8, 0.5],
                    }}
                    transition={{
                        duration: 2,
                        repeat: Infinity,
                    }}
                />

                {/* Icon */}
                <motion.div
                    className="text-5xl relative z-10"
                    animate={{
                        y: [-2, 2, -2],
                    }}
                    transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: 'easeInOut'
                    }}
                >
                    📍
                </motion.div>

                {/* Distance display */}
                <motion.div
                    className="text-sm font-display font-bold text-danger mt-2 relative z-10"
                    key={distance}
                    initial={{ scale: 1.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: 'spring' }}
                >
                    {distance ? formatDistance(distance) : '---'}
                </motion.div>
            </motion.div>

            {/* Info below with stagger animation */}
            <motion.div
                className="mt-8 text-center space-y-2"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
            >
                <motion.p
                    className="text-sm text-muted"
                    animate={{ opacity: [0.7, 1, 0.7] }}
                    transition={{ duration: 2, repeat: Infinity }}
                >
                    {mechanicName || 'Mechanic'} is
                </motion.p>

                <motion.div
                    className="inline-flex items-baseline gap-2"
                    whileHover={{ scale: 1.05 }}
                >
                    <motion.span
                        className="text-4xl font-display font-bold text-success"
                        key={eta}
                        initial={{ scale: 1.3, color: '#F97316' }}
                        animate={{ scale: 1, color: '#10B981' }}
                        transition={{ type: 'spring' }}
                    >
                        {eta || '--'}
                    </motion.span>
                    <span className="text-lg text-light font-semibold">min away</span>
                </motion.div>

                {/* Progress bar */}
                {eta && (
                    <motion.div
                        className="w-48 h-2 bg-void border border-light/20 mx-auto mt-4 overflow-hidden"
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: 1 }}
                        transition={{ delay: 0.6 }}
                    >
                        <motion.div
                            className="h-full bg-gradient-to-r from-danger via-warning to-success"
                            initial={{ width: '0%' }}
                            animate={{ width: `${Math.max(10, 100 - (eta / 25) * 100)}%` }}
                            transition={{ duration: 1, ease: 'easeOut' }}
                        />
                    </motion.div>
                )}
            </motion.div>
        </div>
    );
}

LocationTracker.propTypes = {
    distance: PropTypes.number,
    eta: PropTypes.number,
    mechanicName: PropTypes.string,
};
