'use client';

import { motion } from 'framer-motion';

const techStack = [
    'React', 'Next.js', 'TypeScript', 'Tailwind CSS', 'Supabase', 'Node.js',
    'PostgreSQL', 'Framer Motion', 'GSAP', 'Vercel', 'Prisma', 'Drizzle',
    'Three.js', 'React Query', 'GitHub API', 'Docker', 'AWS'
];

export function TechMarquee() {
    return (
        <div className="relative w-full overflow-hidden bg-slate-50 dark:bg-slate-900/50 py-10 border-y border-slate-200 dark:border-slate-800">
            <div className="flex whitespace-nowrap">
                <motion.div
                    className="flex gap-12 items-center"
                    animate={{
                        x: [0, -1000],
                    }}
                    transition={{
                        duration: 30,
                        repeat: Infinity,
                        ease: 'linear',
                    }}
                >
                    {/* Double the array for seamless looping */}
                    {[...techStack, ...techStack].map((tech, index) => (
                        <span
                            key={index}
                            className="text-2xl md:text-4xl font-heading font-black text-slate-300 dark:text-slate-700 hover:text-primary transition-colors cursor-default select-none uppercase tracking-tighter"
                        >
                            {tech}
                        </span>
                    ))}
                </motion.div>
            </div>
            <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-slate-50 dark:from-slate-900 to-transparent z-10" />
            <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-slate-50 dark:from-slate-900 to-transparent z-10" />
        </div>
    );
}
