'use client';

import { useRef, useEffect } from 'react';
import gsap from 'gsap';

export function useMagnetic() {
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const element = ref.current;
        if (!element) return;

        const handleMouseMove = (e: MouseEvent) => {
            const { clientX, clientY } = e;
            const { left, top, width, height } = element.getBoundingClientRect();

            const centerX = left + width / 2;
            const centerY = top + height / 2;

            const distanceX = clientX - centerX;
            const distanceY = clientY - centerY;

            // Interaction distance limit
            const limit = 100;
            const distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);

            if (distance < limit) {
                gsap.to(element, {
                    x: distanceX * 0.4,
                    y: distanceY * 0.4,
                    duration: 0.4,
                    ease: 'power3.out'
                });
            } else {
                gsap.to(element, {
                    x: 0,
                    y: 0,
                    duration: 0.7,
                    ease: 'elastic.out(1, 0.3)'
                });
            }
        };

        const handleMouseLeave = () => {
            gsap.to(element, {
                x: 0,
                y: 0,
                duration: 0.7,
                ease: 'elastic.out(1, 0.3)'
            });
        };

        window.addEventListener('mousemove', handleMouseMove);
        element.addEventListener('mouseleave', handleMouseLeave);

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            element.removeEventListener('mouseleave', handleMouseLeave);
        };
    }, []);

    return ref;
}
