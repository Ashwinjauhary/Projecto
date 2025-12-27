'use client';

import { motion } from 'framer-motion';
import {
    SiNextdotjs, SiTypescript, SiTailwindcss, SiSupabase, SiFramer,
    SiReact, SiNodedotjs, SiPostgresql, SiGithub, SiVercel,
    SiDocker, SiAmazonwebservices, SiPrisma, SiGreensock
} from 'react-icons/si';

const SKILLS = [
    { name: 'Next.js', icon: SiNextdotjs, color: '#FFFFFF' },
    { name: 'TypeScript', icon: SiTypescript, color: '#3178C6' },
    { name: 'Tailwind', icon: SiTailwindcss, color: '#06B6D4' },
    { name: 'Supabase', icon: SiSupabase, color: '#3ECF8E' },
    { name: 'Framer', icon: SiFramer, color: '#0055FF' },
    { name: 'React', icon: SiReact, color: '#61DAFB' },
    { name: 'Node.js', icon: SiNodedotjs, color: '#339933' },
    { name: 'Postgres', icon: SiPostgresql, color: '#4169E1' },
    { name: 'GitHub', icon: SiGithub, color: '#181717' },
    { name: 'Vercel', icon: SiVercel, color: '#000000' },
    { name: 'Docker', icon: SiDocker, color: '#2496ED' },
    { name: 'AWS', icon: SiAmazonwebservices, color: '#FF9900' },
    { name: 'Prisma', icon: SiPrisma, color: '#2D3748' },
    { name: 'GSAP', icon: SiGreensock, color: '#88CE02' },
];

export function TechCloud() {
    return (
        <section className="py-24 bg-slate-950 overflow-hidden relative">
            <div className="absolute inset-0 bg-glow opacity-30 pointer-events-none" />

            <div className="container mx-auto px-4">
                <div className="flex flex-col items-center text-center mb-16">
                    <span className="text-cyan-400 font-bold tracking-[0.3em] uppercase text-xs mb-4">Arsenal</span>
                    <h2 className="text-5xl md:text-7xl font-black text-white italic tracking-tighter uppercase leading-none">
                        Tech <span className="text-gradient">Ecosystem</span>
                    </h2>
                </div>

                <div className="flex flex-wrap justify-center gap-8 md:gap-12 max-w-5xl mx-auto">
                    {SKILLS.map((skill, index) => (
                        <motion.div
                            key={skill.name}
                            initial={{ opacity: 0, scale: 0.5 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{
                                delay: index * 0.05,
                                type: 'spring',
                                stiffness: 260,
                                damping: 20
                            }}
                            whileHover={{
                                y: -10,
                                scale: 1.1,
                                filter: 'drop-shadow(0 0 15px rgba(34, 211, 238, 0.4))'
                            }}
                            className="group flex flex-col items-center gap-4 cursor-pointer"
                        >
                            <div className="p-6 rounded-3xl glass-dark border-white/5 group-hover:border-cyan-500/30 transition-all duration-500">
                                <skill.icon
                                    size={48}
                                    className="text-slate-500 group-hover:text-white transition-colors duration-500"
                                    style={{ color: 'var(--icon-color)' } as any}
                                />
                            </div>
                            <span className="text-xs font-bold text-slate-500 group-hover:text-cyan-400 uppercase tracking-widest transition-colors duration-500">
                                {skill.name}
                            </span>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Drifting Background Badges */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-5">
                {Array.from({ length: 10 }).map((_, i) => (
                    <motion.div
                        key={i}
                        animate={{
                            x: [Math.random() * 1000, Math.random() * -1000],
                            y: [Math.random() * 1000, Math.random() * -1000],
                            rotate: [0, 360]
                        }}
                        transition={{
                            duration: 20 + Math.random() * 20,
                            repeat: Infinity,
                            ease: 'linear'
                        }}
                        className="absolute text-white font-black text-9xl italic uppercase tracking-tighter"
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`
                        }}
                    >
                        Projecto
                    </motion.div>
                ))}
            </div>
        </section>
    );
}
