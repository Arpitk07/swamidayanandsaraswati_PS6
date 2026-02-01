import { motion, AnimatePresence } from 'framer-motion';
import PropTypes from 'prop-types';

/**
 * Asymmetric card component with premium entrance animations
 */
export function Card({ children, className = '', delay = 0, ...props }) {
    return (
        <motion.div
            className={`relative card group ${className}`}
            initial={{ opacity: 0, y: 30, rotateX: -15 }}
            animate={{ opacity: 1, y: 0, rotateX: 0 }}
            exit={{ opacity: 0, y: -30, rotateX: 15 }}
            transition={{
                type: 'spring',
                stiffness: 200,
                damping: 20,
                delay
            }}
            whileHover={{
                y: -5,
                transition: { type: 'spring', stiffness: 300 }
            }}
            {...props}
        >
            {/* Animated border gradient */}
            <motion.div
                className="absolute -inset-[1px] bg-gradient-to-r from-danger via-warning to-danger opacity-0 group-hover:opacity-100 blur-sm -z-10"
                animate={{
                    backgroundPosition: ['0% 50%', '100% 50%', '0% 50%']
                }}
                transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: 'linear'
                }}
                style={{
                    backgroundSize: '200% 200%'
                }}
            />

            {/* Corner accent */}
            <motion.div
                className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-danger/20 to-transparent opacity-0 group-hover:opacity-100 clip-diagonal"
                initial={{ scale: 0, rotate: -45 }}
                whileHover={{ scale: 1, rotate: 0 }}
                transition={{ type: 'spring', stiffness: 300 }}
            />

            {/* Content */}
            <div className="relative z-10">
                {children}
            </div>

            {/* Shine effect */}
            <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent pointer-events-none"
                initial={{ x: '-100%', skewX: -20 }}
                whileHover={{ x: '200%' }}
                transition={{ duration: 0.8, ease: 'easeInOut' }}
            />
        </motion.div>
    );
}

Card.propTypes = {
    children: PropTypes.node.isRequired,
    className: PropTypes.string,
    delay: PropTypes.number,
};

/**
 * Card with stagger children animation
 */
export function CardWithStagger({ children, className = '', ...props }) {
    const containerVariants = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.3
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, x: -20 },
        show: { opacity: 1, x: 0 }
    };

    return (
        <Card className={className} {...props}>
            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="show"
            >
                {Array.isArray(children) ? (
                    children.map((child, i) => (
                        <motion.div key={i} variants={itemVariants}>
                            {child}
                        </motion.div>
                    ))
                ) : (
                    <motion.div variants={itemVariants}>{children}</motion.div>
                )}
            </motion.div>
        </Card>
    );
}

CardWithStagger.propTypes = {
    children: PropTypes.node.isRequired,
    className: PropTypes.string,
};
