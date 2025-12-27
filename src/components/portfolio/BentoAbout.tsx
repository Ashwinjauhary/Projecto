'use client';

import { motion } from 'framer-motion';
import { LucideIcon, Code2, Cpu, Globe, GraduationCap, Briefcase, Zap } from 'lucide-react';

interface BentoItemProps {
    title: string;
    description?: string;
    icon: LucideIcon;
    className?: string;
    children?: React.ReactNode;
}

function BentoItem({ title, description, icon: Icon, className = "", children }: BentoItemProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            whileHover={{ y: -5 }}
            className={`group relative p-8 glass-dark rounded-3xl overflow-hidden transition-all duration-500 ${className}`}
        >
            <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity duration-500">
                <Icon size={120} />
            </div>

            <div className="relative z-10 flex flex-col h-full">
                <div className="mb-4 p-3 bg-white/5 rounded-2xl w-fit border border-white/10 group-hover:border-cyan-500/30 transition-colors duration-500">
                    <Icon className="text-cyan-400 group-hover:text-cyan-300 transition-colors duration-500" size={24} />
                </div>

                <h3 className="text-2xl font-bold text-white mb-2">{title}</h3>
                {description && <p className="text-slate-400 leading-relaxed font-light">{description}</p>}

                {children && <div className="mt-auto pt-6">{children}</div>}
            </div>

            {/* Subtle Gradient Glow */}
            <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        </motion.div>
    );
}

export function BentoAbout() {
    return (
        <section className="py-24 px-4 bg-slate-950">
            <div className="container mx-auto">
                <div className="flex flex-col mb-16">
                    <span className="text-cyan-400 font-bold tracking-[0.3em] uppercase text-xs mb-4">Discovery</span>
                    <h2 className="text-5xl md:text-7xl font-black text-white italic tracking-tighter uppercase leading-none">
                        Self <span className="text-gradient">Artifact</span>
                    </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 md:grid-rows-2 gap-6 h-auto md:h-[800px]">
                    {/* Hero Section */}
                    <BentoItem
                        title="Engineering Philosophy"
                        description="I build digital experiences where advanced architecture meets playful design. My goal is to transform complex logic into seamless, high-performance interactions."
                        icon={Zap}
                        className="md:col-span-2 md:row-span-1"
                    >
                        <div className="flex flex-wrap gap-2">
                            {["Excellence", "Innovation", "Design", "Performance"].map(tag => (
                                <span key={tag} className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] text-cyan-400 font-bold uppercase tracking-wider">
                                    {tag}
                                </span>
                            ))}
                        </div>
                    </BentoItem>

                    {/* Tech Stack */}
                    <BentoItem
                        title="Core Systems"
                        icon={Cpu}
                        className="md:col-span-2 md:row-span-2"
                    >
                        <div className="grid grid-cols-2 gap-4">
                            {[
                                { label: "Next.js", level: 95 },
                                { label: "TypeScript", level: 90 },
                                { label: "GSAP", level: 85 },
                                { label: "Supabase", level: 80 },
                                { label: "Tailwind", level: 98 },
                                { label: "React", level: 94 }
                            ].map(skill => (
                                <div key={skill.label} className="space-y-2">
                                    <div className="flex justify-between text-xs font-bold text-slate-300 uppercase italic">
                                        <span>{skill.label}</span>
                                        <span>{skill.level}%</span>
                                    </div>
                                    <div className="h-1 bg-white/5 rounded-full overflow-hidden border border-white/5">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            whileInView={{ width: `${skill.level}%` }}
                                            className="h-full bg-gradient-to-r from-cyan-500 to-blue-500"
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </BentoItem>

                    {/* Background */}
                    <BentoItem
                        title="The Journey"
                        description="Crafting high-end digital solutions for visionary brands and personal experimentation."
                        icon={Briefcase}
                        className="md:col-span-1 md:row-span-1"
                    />

                    {/* Education/Misc */}
                    <BentoItem
                        title="Genesis"
                        description="Foundation in Computer Science & Interactive Design."
                        icon={GraduationCap}
                        className="md:col-span-1 md:row-span-1"
                    />
                </div>
            </div>
        </section>
    );
}
