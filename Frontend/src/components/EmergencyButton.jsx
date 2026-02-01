import { motion } from 'framer-motion';
import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';

/**
 * Floating emergency button with pulse effect
 */
export function EmergencyButton({ onClick, active = false }) {
    const [isPulsing, setIsPulsing] = useState(true);

    // Stop pulsing after 5 seconds
    useEffect(() => {
        const timer = setTimeout(() => setIsPulsing(false), 5000);
        return () => clearTimeout(timer);
    }, []);

    const handleClick = () => {
        // Haptic feedback if supported
        if (navigator.vibrate) {
            navigator.vibrate(100);
        }
        onClick();
    };

    return (
        <motion.button
            className="fixed bottom-8 right-8 z-50 w-20 h-20 bg-danger text-light rounded-full shadow-2xl border-2 border-light flex items-center justify-center font-display font-bold text-3xl"
            onClick={handleClick}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            animate={active ? {} : isPulsing ? {
                scale: [1, 1.1, 1],
                boxShadow: [
                    '0 0 0 0 rgba(239, 68, 68, 0.7)',
                    '0 0 0 20px rgba(239, 68, 68, 0)',
                    '0 0 0 0 rgba(239, 68, 68, 0)'
                ]
            } : {}}
            transition={{
                duration: 1.5,
                repeat: isPulsing ? Infinity : 0,
                ease: 'easeInOut'
            }}
            aria-label="Emergency assistance button"
        >
            {active ? '⏱️' : 'SOS'}
        </motion.button>
    );
}

EmergencyButton.propTypes = {
    onClick: PropTypes.func.isRequired,
    active: PropTypes.bool,
};
