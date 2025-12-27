'use client';

import { useEffect, useRef } from 'react';
import { motion, useInView } from 'framer-motion';

export function Hero() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const sectionRef = useRef<HTMLDivElement>(null);
    const isInView = useInView(sectionRef, { once: true });

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        const mouse = { x: canvas.width / 2, y: canvas.height / 2 };
        const handleMouseMove = (e: MouseEvent) => {
            mouse.x = e.clientX;
            mouse.y = e.clientY;
        };
        window.addEventListener('mousemove', handleMouseMove);

        const particles: Array<{
            x: number;
            y: number;
            z: number;
            vx: number;
            vy: number;
            vz: number;
            color: string;
        }> = [];

        const particleCount = 120;
        const colors = ['#60A5FA', '#A78BFA', '#F472B6'];

        for (let i = 0; i < particleCount; i++) {
            particles.push({
                x: (Math.random() - 0.5) * canvas.width * 2,
                y: (Math.random() - 0.5) * canvas.height * 2,
                z: Math.random() * 1000,
                vx: (Math.random() - 0.5) * 0.2,
                vy: (Math.random() - 0.5) * 0.2,
                vz: Math.random() * 1.5 + 0.5,
                color: colors[Math.floor(Math.random() * colors.length)],
            });
        }

        let animationId: number;
        const animate = () => {
            ctx.fillStyle = 'rgba(2, 6, 23, 0.1)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            particles.forEach((particle) => {
                particle.x += particle.vx;
                particle.y += particle.vy;
                particle.z -= particle.vz;

                const dx = (mouse.x - canvas.width / 2);
                const dy = (mouse.y - canvas.height / 2);
                particle.x += dx * 0.001 * (1 - particle.z / 1000);
                particle.y += dy * 0.001 * (1 - particle.z / 1000);

                if (particle.z <= 0) {
                    particle.z = 1000;
                    particle.x = (Math.random() - 0.5) * canvas.width * 2;
                    particle.y = (Math.random() - 0.5) * canvas.height * 2;
                }

                const scale = 600 / particle.z;
                const x2d = particle.x * scale + canvas.width / 2;
                const y2d = particle.y * scale + canvas.height / 2;
                const size = scale * 1.5;

                const opacity = 1 - particle.z / 1000;
                ctx.fillStyle = particle.color;
                ctx.globalAlpha = opacity;
                ctx.beginPath();
                ctx.arc(x2d, y2d, size, 0, Math.PI * 2);
                ctx.fill();

                particles.forEach((other) => {
                    const distSq = Math.pow(particle.x - other.x, 2) +
                        Math.pow(particle.y - other.y, 2) +
                        Math.pow(particle.z - other.z, 2);

                    if (distSq < 200 * 200) {
                        const otherScale = 600 / other.z;
                        const otherX2d = other.x * otherScale + canvas.width / 2;
                        const otherY2d = other.y * otherScale + canvas.height / 2;

                        ctx.strokeStyle = particle.color;
                        ctx.globalAlpha = 0.1 * (1 - Math.sqrt(distSq) / 200) * opacity;
                        ctx.lineWidth = 0.5;
                        ctx.beginPath();
                        ctx.moveTo(x2d, y2d);
                        ctx.lineTo(otherX2d, otherY2d);
                        ctx.stroke();
                    }
                });
            });
            ctx.globalAlpha = 1;
            animationId = requestAnimationFrame(animate);
        };

        animate();

        return () => {
            cancelAnimationFrame(animationId);
            window.removeEventListener('resize', resizeCanvas);
            window.removeEventListener('mousemove', handleMouseMove);
        };
    }, []);

    return (
        <section
            ref={sectionRef}
            className="relative min-h-screen flex items-center justify-center overflow-hidden bg-slate-950"
        >
            <canvas
                ref={canvasRef}
                className="absolute inset-0 w-full h-full"
                style={{ opacity: 0.8 }}
            />

            <div className="relative z-10 container mx-auto px-4 py-20 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.8 }}
                >
                    <h1 className="font-heading text-6xl md:text-9xl font-black text-white mb-6 uppercase tracking-tighter italic">
                        The
                        <span className="block bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                            Collective
                        </span>
                    </h1>

                    <p className="text-xl md:text-2xl text-slate-400 mb-10 max-w-2xl mx-auto font-light tracking-wide">
                        A premium exhibition of engineering, design, and seamless GitHub integration.
                    </p>

                    <div className="flex flex-col md:flex-row gap-6 justify-center items-center">
                        <motion.a
                            href="#projects"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="px-10 py-5 bg-white text-slate-950 rounded-full font-bold uppercase tracking-widest text-sm hover:bg-primary hover:text-white transition-all duration-300 shadow-[0_0_20px_rgba(255,255,255,0.2)]"
                        >
                            Explore Artifacts
                        </motion.a>
                        <motion.a
                            href="#contact"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="px-10 py-5 border-2 border-white/20 text-white rounded-full font-bold uppercase tracking-widest text-sm hover:border-white transition-all duration-300"
                        >
                            Collaborate
                        </motion.a>
                    </div>
                </motion.div>
            </div>

            <motion.div
                className="absolute bottom-12 left-1/2 -translate-x-1/2"
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
            >
                <div className="w-1 h-20 bg-gradient-to-b from-white to-transparent opacity-20" />
            </motion.div>
        </section>
    );
}
