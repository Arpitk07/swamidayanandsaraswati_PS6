import { motion } from 'framer-motion';
import PropTypes from 'prop-types';

/**
 * Reusable button component with spring animations
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
    const baseClasses = 'font-display font-semibold px-6 py-3 border-xs transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2';

    const variantClasses = {
        primary: 'bg-danger text-light border-danger hover:shadow-lg hover:shadow-danger/50',
        secondary: 'bg-transparent text-light border-light hover:bg-light hover:text-void',
        success: 'bg-success text-void border-success hover:shadow-lg hover:shadow-success/50',
    };

    const combinedClasses = `${baseClasses} ${variantClasses[variant]} ${className}`;

    return (
        <motion.button
            type={type}
            className={combinedClasses}
            onClick={onClick}
            disabled={disabled || loading}
            whileHover={{ scale: disabled || loading ? 1 : 1.02 }}
            whileTap={{ scale: disabled || loading ? 1 : 0.95 }}
            transition={{ type: 'spring', stiffness: 400, damping: 17 }}
            {...props}
        >
            {loading ? (
                <>
                    <div className="w-4 h-4 border-2 border-light border-t-transparent rounded-full animate-spin" />
                    <span>Loading...</span>
                </>
            ) : children}
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
