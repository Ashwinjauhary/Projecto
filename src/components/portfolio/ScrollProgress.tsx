'use client';

import { useEffect, useState } from 'react';

export function ScrollProgress() {
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const updateScrollProgress = () => {
            const winScroll = window.scrollY;
            const height = document.documentElement.scrollHeight - window.innerHeight;
            if (height === 0) return;
            const scrolled = winScroll / height;
            setProgress(scrolled);
        };

        window.addEventListener('scroll', updateScrollProgress);
        updateScrollProgress(); // Initial check

        return () => window.removeEventListener('scroll', updateScrollProgress);
    }, []);

    return (
        <div
            className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-400 to-blue-600 z-[100] origin-left transition-transform duration-75 ease-out"
            style={{ transform: `scaleX(${progress})` }}
        />
    );
}
