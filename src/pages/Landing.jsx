import { motion, useScroll, useTransform } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useEmergencyStore } from '../store/useEmergencyStore';
import { Button } from '../components/Button';

export function Landing() {
    const { setRole } = useEmergencyStore();
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const { scrollY } = useScroll();

    // Parallax effects
    const y1 = useTransform(scrollY, [0, 300], [0, -50]);
    const y2 = useTransform(scrollY, [0, 300], [0, -25]);
    const opacity = useTransform(scrollY, [0, 200], [1, 0]);

    // Mouse parallax effect
    useEffect(() => {
        const handleMouseMove = (e) => {
            setMousePosition({
                x: (e.clientX - window.innerWidth / 2) / 50,
                y: (e.clientY - window.innerHeight / 2) / 50
            });
        };
        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    return (
        <div className="relative min-h-screen overflow-hidden">
            {/* Animated gradient background */}
            <div className="fixed inset-0 bg-gradient-to-br from-void via-void to-danger/10">
                <motion.div
                    className="absolute inset-0 opacity-30"
                    animate={{
                        background: [
                            'radial-gradient(circle at 20% 50%, rgba(239, 68, 68, 0.15) 0%, transparent 50%)',
                            'radial-gradient(circle at 80% 50%, rgba(249, 115, 22, 0.15) 0%, transparent 50%)',
                            'radial-gradient(circle at 50% 80%, rgba(239, 68, 68, 0.15) 0%, transparent 50%)',
                            'radial-gradient(circle at 20% 50%, rgba(239, 68, 68, 0.15) 0%, transparent 50%)'
                        ]
                    }}
                    transition={{
                        duration: 10,
                        repeat: Infinity,
                        ease: 'linear'
                    }}
                />
            </div>

            {/* Floating particles */}
            <div className="fixed inset-0 pointer-events-none">
                {[...Array(20)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute w-1 h-1 bg-danger rounded-full"
                        initial={{
                            x: Math.random() * window.innerWidth,
                            y: Math.random() * window.innerHeight,
                            opacity: 0
                        }}
                        animate={{
                            y: [null, -100, window.innerHeight + 100],
                            opacity: [0, 0.6, 0]
                        }}
                        transition={{
                            duration: Math.random() * 10 + 10,
                            repeat: Infinity,
                            delay: Math.random() * 5,
                            ease: 'linear'
                        }}
                    />
                ))}
            </div>

            <div className="relative z-10 flex items-center justify-center min-h-screen px-4">
                <div className="w-full max-w-6xl">
                    {/* Hero Section with Parallax */}
                    <motion.div
                        className="text-center mb-20"
                        style={{
                            y: y1,
                            opacity,
                            x: mousePosition.x * 0.5,
                        }}
                    >
                        {/* Emergency badge */}
                        <motion.div
                            className="inline-flex items-center gap-2 mb-8 px-4 py-2 border border-danger/30 bg-danger/5 backdrop-blur-sm"
                            initial={{ scale: 0, rotate: -10 }}
                            animate={{ scale: 1, rotate: 0 }}
                            transition={{
                                type: 'spring',
                                stiffness: 200,
                                delay: 0.2
                            }}
                        >
                            <motion.span
                                className="text-2xl"
                                animate={{ rotate: [0, 10, -10, 0] }}
                                transition={{
                                    duration: 2,
                                    repeat: Infinity,
                                    ease: 'easeInOut'
                                }}
                            >
                                🚨
                            </motion.span>
                            <span className="text-sm font-display font-semibold text-danger uppercase tracking-wider">
                                Emergency Response System
                            </span>
                        </motion.div>

                        {/* Main title with stagger effect */}
                        <div className="relative">
                            <motion.h1
                                className="font-display text-8xl md:text-9xl font-bold leading-none mb-6"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                            >
                                {['Road', 'Assist'].map((word, wordIndex) => (
                                    <motion.span
                                        key={word}
                                        className={wordIndex === 0 ? 'text-light' : 'text-danger'}
                                        style={{ display: 'inline-block', marginRight: '0.25em' }}
                                        initial={{ y: 100, opacity: 0 }}
                                        animate={{ y: 0, opacity: 1 }}
                                        transition={{
                                            type: 'spring',
                                            stiffness: 100,
                                            delay: 0.3 + wordIndex * 0.2
                                        }}
                                    >
                                        {word.split('').map((char, i) => (
                                            <motion.span
                                                key={i}
                                                style={{ display: 'inline-block' }}
                                                whileHover={{
                                                    y: -10,
                                                    color: '#F97316',
                                                    transition: { type: 'spring', stiffness: 300 }
                                                }}
                                            >
                                                {char}
                                            </motion.span>
                                        ))}
                                    </motion.span>
                                ))}
                            </motion.h1>

                            {/* Animated underline */}
                            <motion.div
                                className="h-2 bg-gradient-to-r from-danger via-warning to-danger mx-auto"
                                initial={{ width: 0 }}
                                animate={{ width: '60%' }}
                                transition={{ delay: 0.8, duration: 0.8, ease: 'easeOut' }}
                            />
                        </div>

                        <motion.p
                            className="text-2xl md:text-3xl text-light/70 mt-8 font-light"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 1, duration: 0.6 }}
                        >
                            AI-powered emergency assistance
                            <motion.span
                                className="text-warning ml-2"
                                animate={{ opacity: [1, 0.5, 1] }}
                                transition={{ duration: 2, repeat: Infinity }}
                            >
                                in seconds
                            </motion.span>
                        </motion.p>
                    </motion.div>

                    {/* Role Selection Cards */}
                    <motion.div
                        className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto"
                        style={{ y: y2 }}
                    >
                        {/* Citizen Card */}
                        <motion.div
                            initial={{ opacity: 0, x: -100 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 1.2, type: 'spring', stiffness: 100 }}
                            whileHover={{ scale: 1.02 }}
                        >
                            <div
                                className="relative group cursor-pointer h-full"
                                onClick={() => setRole('citizen')}
                            >
                                {/* Glow effect */}
                                <motion.div
                                    className="absolute -inset-1 bg-gradient-to-r from-danger to-warning opacity-0 group-hover:opacity-75 blur-xl transition-opacity duration-500"
                                    animate={{
                                        opacity: [0, 0.3, 0],
                                    }}
                                    transition={{
                                        duration: 3,
                                        repeat: Infinity,
                                    }}
                                />

                                <div className="relative card p-10 h-full flex flex-col justify-between border-2 border-light/10 group-hover:border-danger transition-all duration-300">
                                    {/* Icon with pulse */}
                                    <div className="mb-6">
                                        <motion.div
                                            className="text-8xl"
                                            animate={{
                                                scale: [1, 1.1, 1],
                                            }}
                                            transition={{
                                                duration: 2,
                                                repeat: Infinity,
                                                repeatType: 'reverse'
                                            }}
                                        >
                                            🆘
                                        </motion.div>
                                    </div>

                                    <div>
                                        <h2 className="font-display text-4xl font-bold text-light mb-4 group-hover:text-danger transition-colors">
                                            I Need Help
                                        </h2>
                                        <p className="text-lg text-muted mb-6">
                                            Get instant roadside assistance powered by AI
                                        </p>

                                        {/* Features list */}
                                        <ul className="space-y-3 mb-8">
                                            {[
                                                { icon: '⚡', text: 'Instant mechanic matching' },
                                                { icon: '📍', text: 'Live GPS tracking' },
                                                { icon: '🔔', text: 'Real-time status updates' }
                                            ].map((feature, i) => (
                                                <motion.li
                                                    key={i}
                                                    className="flex items-center gap-3 text-light/80"
                                                    initial={{ opacity: 0, x: -20 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    transition={{ delay: 1.4 + i * 0.1 }}
                                                >
                                                    <span className="text-2xl">{feature.icon}</span>
                                                    <span>{feature.text}</span>
                                                </motion.li>
                                            ))}
                                        </ul>
                                    </div>

                                    <Button
                                        variant="primary"
                                        className="w-full group-hover:shadow-2xl group-hover:shadow-danger/50"
                                    >
                                        Request Emergency Help →
                                    </Button>
                                </div>
                            </div>
                        </motion.div>

                        {/* Mechanic Card */}
                        <motion.div
                            initial={{ opacity: 0, x: 100 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 1.4, type: 'spring', stiffness: 100 }}
                            whileHover={{ scale: 1.02 }}
                        >
                            <div
                                className="relative group cursor-pointer h-full"
                                onClick={() => setRole('mechanic')}
                            >
                                {/* Glow effect */}
                                <motion.div
                                    className="absolute -inset-1 bg-gradient-to-r from-success to-light opacity-0 group-hover:opacity-75 blur-xl transition-opacity duration-500"
                                    animate={{
                                        opacity: [0, 0.3, 0],
                                    }}
                                    transition={{
                                        duration: 3,
                                        repeat: Infinity,
                                        delay: 1.5
                                    }}
                                />

                                <div className="relative card p-10 h-full flex flex-col justify-between border-2 border-light/10 group-hover:border-success transition-all duration-300">
                                    {/* Icon with rotation */}
                                    <div className="mb-6">
                                        <motion.div
                                            className="text-8xl"
                                            animate={{
                                                rotate: [0, 5, -5, 0],
                                            }}
                                            transition={{
                                                duration: 3,
                                                repeat: Infinity,
                                            }}
                                        >
                                            🔧
                                        </motion.div>
                                    </div>

                                    <div>
                                        <h2 className="font-display text-4xl font-bold text-light mb-4 group-hover:text-success transition-colors">
                                            I'm a Mechanic
                                        </h2>
                                        <p className="text-lg text-muted mb-6">
                                            Manage jobs and help people in emergencies
                                        </p>

                                        {/* Features list */}
                                        <ul className="space-y-3 mb-8">
                                            {[
                                                { icon: '📋', text: 'View assigned jobs' },
                                                { icon: '🗺️', text: 'Share live location' },
                                                { icon: '✅', text: 'Update job status' }
                                            ].map((feature, i) => (
                                                <motion.li
                                                    key={i}
                                                    className="flex items-center gap-3 text-light/80"
                                                    initial={{ opacity: 0, x: -20 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    transition={{ delay: 1.6 + i * 0.1 }}
                                                >
                                                    <span className="text-2xl">{feature.icon}</span>
                                                    <span>{feature.text}</span>
                                                </motion.li>
                                            ))}
                                        </ul>
                                    </div>

                                    <Button
                                        variant="secondary"
                                        className="w-full group-hover:bg-success group-hover:text-void group-hover:border-success group-hover:shadow-2xl group-hover:shadow-success/50"
                                    >
                                        Access Dashboard →
                                    </Button>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>

                    {/* Footer Stats */}
                    <motion.div
                        className="mt-20 grid grid-cols-3 gap-8 max-w-3xl mx-auto"
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1.8 }}
                    >
                        {[
                            { value: '24/7', label: 'Available' },
                            { value: '<5min', label: 'Avg Response' },
                            { value: '99%', label: 'Success Rate' }
                        ].map((stat, i) => (
                            <motion.div
                                key={i}
                                className="text-center"
                                whileHover={{ y: -5 }}
                            >
                                <motion.div
                                    className="font-display text-4xl font-bold text-danger mb-2"
                                    animate={{
                                        scale: [1, 1.05, 1],
                                    }}
                                    transition={{
                                        duration: 2,
                                        repeat: Infinity,
                                        delay: i * 0.3
                                    }}
                                >
                                    {stat.value}
                                </motion.div>
                                <div className="text-sm text-muted uppercase tracking-wider">
                                    {stat.label}
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>

                    {/* Powered by AI badge */}
                    <motion.div
                        className="text-center mt-16"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 2 }}
                    >
                        <div className="inline-flex items-center gap-2 text-sm text-muted">
                            <motion.span
                                animate={{ rotate: 360 }}
                                transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                            >
                                🤖
                            </motion.span>
                            <span>Powered by Advanced AI Matching</span>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
