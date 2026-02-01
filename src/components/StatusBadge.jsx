import { motion } from 'framer-motion';
import PropTypes from 'prop-types';

const statusConfig = {
    assigned: {
        label: 'Mechanic Assigned',
        className: 'badge-assigned',
        icon: '🔧'
    },
    on_the_way: {
        label: 'On the Way',
        className: 'badge-on-way',
        icon: '🚗'
    },
    arriving: {
        label: 'Arriving Soon',
        className: 'badge-arrived',
        icon: '⏱️'
    },
    arrived: {
        label: 'Arrived',
        className: 'badge-arrived',
        icon: '✅'
    }
};

/**
 * Status badge with smooth transitions
 */
export function StatusBadge({ status }) {
    const config = statusConfig[status] || statusConfig.assigned;

    return (
        <motion.div
            className={`badge ${config.className}`}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            key={status}
            transition={{ type: 'spring', stiffness: 500, damping: 25 }}
        >
            <span className="text-base">{config.icon}</span>
            <span>{config.label}</span>
        </motion.div>
    );
}

StatusBadge.propTypes = {
    status: PropTypes.oneOf(['assigned', 'on_the_way', 'arriving', 'arrived']).isRequired,
};
