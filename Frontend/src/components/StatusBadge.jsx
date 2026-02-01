import { motion, AnimatePresence } from 'framer-motion';
import PropTypes from 'prop-types';

const statusConfig = {
    assigned: {
        label: 'Mechanic Assigned',
        className: 'badge-assigned',
        icon: '🔧',
        color: '#F97316'
    },
    on_the_way: {
        label: 'On the Way',
        className: 'badge-on-way',
        icon: '🚗',
        color: '#10B981'
    },
    arriving: {
        label: 'Arriving Soon',
        className: 'badge-arrived',
        icon: '⏱️',
        color: '#FAFAFA'
    },
    arrived: {
        label: 'Arrived',
        className: 'badge-arrived',
        icon: '✅',
        color: '#FAFAFA'
    }
};

/**
 * Premium status badge with smooth transitions and glow effects
 */
export function StatusBadge({ status }) {
    const config = statusConfig[status] || statusConfig.assigned;

    return (
        <AnimatePresence mode="wait">
            <motion.div
                key={status}
                className={`relative badge ${config.className} px-6 py-3 text-base`}
                initial={{ scale: 0, rotate: -180, opacity: 0 }}
                animate={{ scale: 1, rotate: 0, opacity: 1 }}
                exit={{ scale: 0, rotate: 180, opacity: 0 }}
                transition={{
                    type: 'spring',
                    stiffness: 500,
                    damping: 25
                }}
            >
                {/* Glow effect */}
                <motion.div
                    className="absolute -inset-1 blur-lg opacity-50"
                    style={{ backgroundColor: config.color }}
                    animate={{
                        opacity: [0.3, 0.6, 0.3],
                    }}
                    transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: 'easeInOut'
                    }}
                />

                {/* Content */}
                <div className="relative flex items-center gap-3">
                    <motion.span
                        className="text-2xl"
                        animate={{
                            rotate: [0, 10, -10, 0],
                            scale: [1, 1.2, 1]
                        }}
                        transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: 'easeInOut'
                        }}
                    >
                        {config.icon}
                    </motion.span>

                    <span className="font-semibold">{config.label}</span>

                    {/* Pulse indicator */}
                    <motion.div
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: config.color }}
                        animate={{
                            scale: [1, 1.5, 1],
                            opacity: [1, 0.5, 1],
                        }}
                        transition={{
                            duration: 1.5,
                            repeat: Infinity,
                        }}
                    />
                </div>

                {/* Shimmer effect */}
                <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                    initial={{ x: '-100%' }}
                    animate={{ x: '200%' }}
                    transition={{
                        duration: 2,
                        repeat: Infinity,
                        repeatDelay: 1,
                        ease: 'linear'
                    }}
                />
            </motion.div>
        </AnimatePresence>
    );
}

StatusBadge.propTypes = {
    status: PropTypes.oneOf(['assigned', 'on_the_way', 'arriving', 'arrived']).isRequired,
};
