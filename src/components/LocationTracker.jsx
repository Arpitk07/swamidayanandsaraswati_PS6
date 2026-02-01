import { motion } from 'framer-motion';
import PropTypes from 'prop-types';
import { formatDistance } from '../services/geolocation';

/**
 * Location tracker with animated radar pulse
 */
export function LocationTracker({ distance, eta, mechanicName }) {
    return (
        <div className="relative">
            {/* Radar pulse animation */}
            <div className="absolute inset-0 flex items-center justify-center">
                <motion.div
                    className="absolute w-24 h-24 border-2 border-danger rounded-full"
                    animate={{
                        scale: [1, 2],
                        opacity: [1, 0],
                    }}
                    transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: 'easeOut',
                    }}
                />
                <motion.div
                    className="absolute w-24 h-24 border-2 border-danger rounded-full"
                    animate={{
                        scale: [1, 2],
                        opacity: [1, 0],
                    }}
                    transition={{
                        duration: 2,
                        delay: 1,
                        repeat: Infinity,
                        ease: 'easeOut',
                    }}
                />
            </div>

            {/* Center content */}
            <motion.div
                className="relative z-10 flex flex-col items-center justify-center bg-void border-2 border-danger w-24 h-24 rounded-full"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 300 }}
            >
                <div className="text-2xl">📍</div>
                <div className="text-xs font-display font-semibold text-danger mt-1">
                    {distance ? formatDistance(distance) : '---'}
                </div>
            </motion.div>

            {/* Info below */}
            <motion.div
                className="mt-6 text-center"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
            >
                <p className="text-sm text-muted">
                    {mechanicName || 'Mechanic'} is
                </p>
                <p className="text-lg font-display font-semibold text-light">
                    {eta ? `${eta} min away` : 'en route'}
                </p>
            </motion.div>
        </div>
    );
}

LocationTracker.propTypes = {
    distance: PropTypes.number,
    eta: PropTypes.number,
    mechanicName: PropTypes.string,
};
