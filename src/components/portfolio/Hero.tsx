'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { useMagnetic } from '@/lib/hooks/useMagnetic';
import { LiveStatus } from './LiveStatus';

const TITLES = [
    "The Collective",
    "Digital Artistry",
    "Creative Engine",
    "Visionary Code"
];

export function Hero() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const sectionRef = useRef<HTMLDivElement>(null);
    const isInView = useInView(sectionRef, { once: true });

    const [titleIndex, setTitleIndex] = useState(0);
    const exploreRef = useMagnetic();
    const collaborateRef = useMagnetic();

    useEffect(() => {
        const interval = setInterval(() => {
            setTitleIndex((prev) => (prev + 1) % TITLES.length);
        }, 3000);
        return () => clearInterval(interval);
    }, []);

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

        const particleCount = 150;
        // Premium Neon Colors
        const colors = ['#22d3ee', '#818cf8', '#f472b6', '#4ade80'];

        for (let i = 0; i < particleCount; i++) {
            particles.push({
                x: (Math.random() - 0.5) * canvas.width * 2,
                y: (Math.random() - 0.5) * canvas.height * 2,
                z: Math.random() * 1000,
                vx: (Math.random() - 0.5) * 0.3,
                vy: (Math.random() - 0.5) * 0.3,
                vz: Math.random() * 2 + 0.5,
                color: colors[Math.floor(Math.random() * colors.length)],
            });
        }

        let animationId: number;
        const animate = () => {
            ctx.fillStyle = 'rgba(2, 6, 23, 0.15)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            particles.forEach((particle) => {
                particle.x += particle.vx;
                particle.y += particle.vy;
                particle.z -= particle.vz;

                const dx = (mouse.x - canvas.width / 2);
                const dy = (mouse.y - canvas.height / 2);
                particle.x += dx * 0.0015 * (1 - particle.z / 1000);
                particle.y += dy * 0.0015 * (1 - particle.z / 1000);

                if (particle.z <= 0) {
                    particle.z = 1000;
                    particle.x = (Math.random() - 0.5) * canvas.width * 2;
                    particle.y = (Math.random() - 0.5) * canvas.height * 2;
                }

                const scale = 600 / particle.z;
                const x2d = particle.x * scale + canvas.width / 2;
                const y2d = particle.y * scale + canvas.height / 2;
                const size = scale * 2;

                const opacity = 1 - particle.z / 1000;
                ctx.fillStyle = particle.color;
                ctx.globalAlpha = opacity;
                ctx.beginPath();
                ctx.arc(x2d, y2d, size, 0, Math.PI * 2);
                ctx.fill();

                // Connections
                particles.forEach((other) => {
                    const distSq = Math.pow(particle.x - other.x, 2) +
                        Math.pow(particle.y - other.y, 2) +
                        Math.pow(particle.z - other.z, 2);

                    if (distSq < 150 * 150) {
                        const otherScale = 600 / other.z;
                        const otherX2d = other.x * otherScale + canvas.width / 2;
                        const otherY2d = other.y * otherScale + canvas.height / 2;

                        ctx.strokeStyle = particle.color;
                        ctx.globalAlpha = 0.15 * (1 - Math.sqrt(distSq) / 150) * opacity;
                        ctx.lineWidth = 0.8;
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
                style={{ opacity: 0.6 }}
            />

            <div className="relative z-10 container mx-auto px-4 py-20 text-center">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={isInView ? { opacity: 1, scale: 1 } : {}}
                    transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
                >
                    <div className="flex flex-col items-center gap-6 mb-6">
                        <motion.div
                            initial={{ scale: 0.5, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                            className="w-24 h-24 mb-4"
                        >
                            <img src="/icon.png" alt="Logo" className="w-full h-full object-contain filter drop-shadow-[0_0_20px_rgba(34,211,238,0.3)]" />
                        </motion.div>
                        <div className="px-4 py-1 rounded-full glass border-cyan-500/20 text-cyan-400 text-xs font-bold tracking-[0.2em] uppercase">
                            Portfolio v4.0 • Built with Next.js
                        </div>
                        <LiveStatus />
                    </div>

                    <h1 className="font-heading text-6xl md:text-9xl font-black text-white mb-8 tracking-tighter uppercase italic leading-[1.1]">
                        <AnimatePresence mode="wait">
                            <motion.span
                                key={titleIndex}
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                exit={{ y: -20, opacity: 0 }}
                                transition={{ duration: 0.5, ease: "circOut" }}
                                className="block"
                            >
                                {TITLES[titleIndex].split(" ")[0]}
                                <span className="block text-gradient">
                                    {TITLES[titleIndex].split(" ")[1]}
                                </span>
                            </motion.span>
                        </AnimatePresence>
                    </h1>

                    <p className="text-xl md:text-2xl text-slate-400 mb-12 max-w-2xl mx-auto font-light tracking-wide leading-relaxed">
                        Exploration of engineering, artistry, and seamless data architecture.
                        Experience the <span className="text-white font-medium">Future of Digital Artifacts</span>.
                    </p>

                    <div className="flex flex-col md:flex-row gap-8 justify-center items-center">
                        <div ref={exploreRef as any}>
                            <motion.a
                                href="#projects"
                                whileTap={{ scale: 0.9 }}
                                className="group relative px-12 py-6 bg-white text-slate-950 rounded-full font-bold uppercase tracking-widest text-sm transition-all duration-300 shadow-[0_0_30px_rgba(255,255,255,0.15)] flex items-center gap-3"
                            >
                                <span className="relative z-10">Explore Artifacts</span>
                                <div className="absolute inset-x-0 bottom-0 h-0 group-hover:h-full bg-cyan-400 transition-all duration-300 rounded-full -z-0 opacity-10" />
                            </motion.a>
                        </div>

                        <div ref={collaborateRef as any}>
                            <motion.a
                                href="#contact"
                                whileTap={{ scale: 0.9 }}
                                className="px-12 py-6 border-2 border-white/20 text-white rounded-full font-bold uppercase tracking-widest text-sm hover:border-cyan-400/50 hover:text-cyan-400 transition-all duration-300 glass"
                            >
                                Collaborate
                            </motion.a>
                        </div>
                    </div>

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1.5 }}
                        className="mt-12"
                    >
                        <a
                            href="/resume.pdf"
                            download
                            className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500 hover:text-cyan-400 transition-colors flex items-center justify-center gap-3 group"
                        >
                            <div className="w-8 h-px bg-slate-800 group-hover:bg-cyan-500/50 transition-colors" />
                            Download Resume Artifact
                            <div className="w-8 h-px bg-slate-800 group-hover:bg-cyan-500/50 transition-colors" />
                        </a>
                    </motion.div>
                </motion.div>
            </div>

            {/* Scroll Indicator */}
            <motion.div
                className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2 }}
            >
                <span className="text-[10px] text-slate-500 uppercase tracking-[0.5em] font-bold">Scroll</span>
                <div className="w-[1px] h-16 bg-gradient-to-b from-cyan-500 via-blue-500 to-transparent opacity-40" />
            </motion.div>
        </section>
    );
}
