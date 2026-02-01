import { motion } from 'framer-motion';
import PropTypes from 'prop-types';

/**
 * Asymmetric card component with sharp geometry
 */
export function Card({ children, className = '', ...props }) {
    return (
        <motion.div
            className={`card ${className}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 24 }}
            {...props}
        >
            {children}
        </motion.div>
    );
}

Card.propTypes = {
    children: PropTypes.node.isRequired,
    className: PropTypes.string,
};
