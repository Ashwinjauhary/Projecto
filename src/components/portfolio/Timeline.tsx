'use client';

import { motion } from 'framer-motion';
import { Target, Rocket, Award, History } from 'lucide-react';

const EVENTS = [
    {
        year: '2025',
        title: 'Projecto Evolution',
        description: 'Launching the premium iteration of Projecto, focusing on high-end interactive artifacts and seamless data flows.',
        icon: Rocket,
        color: 'from-cyan-400 to-blue-600'
    },
    {
        year: '2024',
        title: 'Open Source Catalyst',
        description: 'Contributed to global architecture frameworks, refining expertise in scalable engineering and reactive systems.',
        icon: Target,
        color: 'from-blue-600 to-purple-600'
    },
    {
        year: '2023',
        title: 'Full Stack Odyssey',
        description: 'Architecting end-to-end digital solutions for visionary startups, bridging the gap between design and logic.',
        icon: Award,
        color: 'from-purple-600 to-pink-600'
    },
    {
        year: '2022',
        title: 'Genesis',
        description: 'The beginning of the journey. First lines of code that sparked a passion for digital craftsmanship.',
        icon: History,
        color: 'from-pink-600 to-rose-600'
    }
];

export function Timeline() {
    return (
        <section className="py-24 bg-slate-950 relative overflow-hidden">
            <div className="container mx-auto px-4">
                <div className="flex flex-col mb-16 items-start">
                    <span className="text-cyan-400 font-bold tracking-[0.3em] uppercase text-xs mb-4">Chronology</span>
                    <h2 className="text-5xl md:text-7xl font-black text-white italic tracking-tighter uppercase leading-none">
                        The <span className="text-gradient">Timeline</span>
                    </h2>
                </div>

                <div className="relative">
                    {/* Vertical Line */}
                    <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-[1px] bg-gradient-to-b from-cyan-500 via-blue-500 to-transparent opacity-20 hidden md:block" />

                    <div className="space-y-12">
                        {EVENTS.map((event, index) => (
                            <motion.div
                                key={event.year}
                                initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true, margin: "-100px" }}
                                transition={{ duration: 0.8, ease: "easeOut" }}
                                className={`relative flex flex-col md:flex-row items-center gap-8 ${index % 2 === 0 ? 'md:flex-row-reverse' : ''
                                    }`}
                            >
                                {/* Year/Icon Node */}
                                <div className="absolute left-8 md:left-1/2 -ms-[17px] md:-ms-[17px] z-10 w-8 h-8 rounded-full glass border-cyan-500/40 flex items-center justify-center bg-slate-950 hidden md:flex">
                                    <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                                </div>

                                {/* Content Card */}
                                <div className="w-full md:w-1/2 pl-16 md:pl-0">
                                    <div className="glass-dark p-8 rounded-3xl border-white/5 hover:border-white/10 transition-all duration-500 group">
                                        <div className="flex items-center gap-4 mb-4">
                                            <div className={`p-3 rounded-2xl bg-gradient-to-br ${event.color} bg-opacity-10 w-fit`}>
                                                <event.icon className="text-white" size={20} />
                                            </div>
                                            <span className="text-2xl font-black text-white italic">{event.year}</span>
                                        </div>

                                        <h3 className="text-xl font-bold text-white mb-3 group-hover:text-cyan-400 transition-colors">
                                            {event.title}
                                        </h3>
                                        <p className="text-slate-400 font-light leading-relaxed">
                                            {event.description}
                                        </p>
                                    </div>
                                </div>

                                <div className="hidden md:block md:w-1/2" />
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
