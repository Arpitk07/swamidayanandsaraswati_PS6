import { motion } from 'framer-motion';
import PropTypes from 'prop-types';

/**
 * Reusable button component with premium spring animations
 */
export function Button({
    children,
    variant = 'primary',
    loading = false,
    onClick,
    disabled = false,
    type = 'button',
    className = '',
    ...props
}) {
    const baseClasses = 'relative overflow-hidden font-display font-semibold px-8 py-4 border transition-all duration-300 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2';

    const variantClasses = {
        primary: 'bg-danger text-light border-danger hover:shadow-2xl hover:shadow-danger/60',
        secondary: 'bg-transparent text-light border-light hover:bg-light hover:text-void hover:shadow-2xl hover:shadow-light/40',
        success: 'bg-success text-void border-success hover:shadow-2xl hover:shadow-success/60',
    };

    const combinedClasses = `${baseClasses} ${variantClasses[variant]} ${className}`;

    return (
        <motion.button
            type={type}
            className={combinedClasses}
            onClick={onClick}
            disabled={disabled || loading}
            whileHover={{ scale: disabled || loading ? 1 : 1.05 }}
            whileTap={{ scale: disabled || loading ? 1 : 0.95 }}
            transition={{ type: 'spring', stiffness: 400, damping: 17 }}
            {...props}
        >
            {/* Shimmer effect */}
            {!loading && !disabled && (
                <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                    initial={{ x: '-100%' }}
                    animate={{ x: '200%' }}
                    transition={{
                        duration: 2,
                        repeat: Infinity,
                        repeatDelay: 3,
                        ease: 'linear'
                    }}
                />
            )}

            {/* Content */}
            <span className="relative z-10 flex items-center gap-2">
                {loading ? (
                    <>
                        <motion.div
                            className="w-5 h-5 border-2 border-light border-t-transparent rounded-full"
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                        />
                        <span>Processing...</span>
                    </>
                ) : children}
            </span>

            {/* Ripple effect on click */}
            {!disabled && !loading && (
                <motion.div
                    className="absolute inset-0 bg-white/10 rounded-full"
                    initial={{ scale: 0, opacity: 1 }}
                    whileTap={{ scale: 2, opacity: 0 }}
                    transition={{ duration: 0.5 }}
                />
            )}
        </motion.button>
    );
}

Button.propTypes = {
    children: PropTypes.node.isRequired,
    variant: PropTypes.oneOf(['primary', 'secondary', 'success']),
    loading: PropTypes.bool,
    onClick: PropTypes.func,
    disabled: PropTypes.bool,
    type: PropTypes.oneOf(['button', 'submit', 'reset']),
    className: PropTypes.string,
};
