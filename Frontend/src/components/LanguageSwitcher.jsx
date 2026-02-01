import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';

/**
 * Language switcher component with animated transitions
 */
export function LanguageSwitcher({ className = '' }) {
    const { i18n } = useTranslation();

    const languages = [
        { code: 'en', label: 'English', flag: '🇬🇧' },
        { code: 'hi', label: 'हिंदी', flag: '🇮🇳' },
        { code: 'mr', label: 'मराठी', flag: '🇮🇳' }
    ];

    const changeLanguage = (langCode) => {
        i18n.changeLanguage(langCode);
    };

    return (
        <div className={`flex items-center gap-2 ${className}`}>
            {languages.map((lang) => (
                <motion.button
                    key={lang.code}
                    onClick={() => changeLanguage(lang.code)}
                    className={`px-3 py-2 border font-display text-sm font-semibold transition-all ${i18n.language === lang.code
                            ? 'bg-danger text-light border-danger'
                            : 'bg-transparent text-light/70 border-light/20 hover:border-light/40'
                        }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    <span className="mr-2">{lang.flag}</span>
                    {lang.label}
                </motion.button>
            ))}
        </div>
    );
}

LanguageSwitcher.propTypes = {
    className: PropTypes.string,
};
