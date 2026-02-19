import React, { useEffect, useCallback, useRef } from 'react';
import { motion, useMotionValue, useMotionTemplate } from 'framer-motion';

const PremiumEffects: React.FC = () => {
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    // Move gradient logic to MotionTemplates to avoid re-renders
    const mainGradient = useMotionTemplate`radial-gradient(600px circle at ${mouseX}px ${mouseY}px, hsla(var(--accent), 0.08), transparent 80%)`;

    const handleMouseMove = useCallback((e: MouseEvent) => {
        mouseX.set(e.clientX);
        mouseY.set(e.clientY);
    }, [mouseX, mouseY]);

    useEffect(() => {
        window.addEventListener('mousemove', handleMouseMove, { passive: true });

        // Optimize scroll percent calculation
        const handleScroll = () => {
            const doc = document.documentElement;
            const scrolled = (doc.scrollTop / (doc.scrollHeight - doc.clientHeight)) * 100;
            doc.style.setProperty('--scroll-percent', `${scrolled.toFixed(1)}%`);
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('scroll', handleScroll);
        };
    }, [handleMouseMove]);

    const isAdminPage = location.pathname.startsWith('/admin');

    if (isAdminPage) return null;

    return (
        <div className="fixed inset-0 pointer-events-none z-[9998] overflow-hidden">
            {/* Subtle glow follower only - no custom cursor elements */}
            <motion.div
                className="fixed inset-0 z-[-1] pointer-events-none opacity-30 mix-blend-screen will-change-[background]"
                style={{
                    background: mainGradient,
                }}
            />
        </div>
    );
};

export default PremiumEffects;
