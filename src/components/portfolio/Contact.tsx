'use client';

import { motion } from 'framer-motion';
import { Mail, Github, Linkedin, Twitter, ArrowRight } from 'lucide-react';

export function Contact() {
    return (
        <section id="contact" className="py-32 px-4 bg-slate-950 text-white relative overflow-hidden">
            {/* Background Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/20 rounded-full blur-[120px] pointer-events-none" />

            <div className="container mx-auto max-w-5xl relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                    <div>
                        <motion.h2
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            className="font-heading text-5xl md:text-7xl font-black mb-8 uppercase tracking-tighter"
                        >
                            Let's build <br />
                            <span className="text-primary">Something Great</span>
                        </motion.h2>
                        <p className="text-xl text-slate-400 mb-12 max-w-md font-light leading-relaxed">
                            I'm always open to new opportunities, collaborations, or just a friendly chat about design and technology.
                        </p>

                        <div className="flex gap-6">
                            {[
                                { icon: Github, href: '#' },
                                { icon: Linkedin, href: '#' },
                                { icon: Twitter, href: '#' },
                                { icon: Mail, href: 'mailto:hello@example.com' },
                            ].map((social, i) => (
                                <motion.a
                                    key={i}
                                    href={social.href}
                                    whileHover={{ scale: 1.2, color: 'var(--primary)' }}
                                    className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center text-slate-400 hover:border-primary/50 transition-colors"
                                >
                                    <social.icon className="w-5 h-5" />
                                </motion.a>
                            ))}
                        </div>
                    </div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        className="bg-white/5 border border-white/10 p-10 rounded-3xl backdrop-blur-xl"
                    >
                        <form className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-xs uppercase tracking-widest font-bold text-slate-500">Name</label>
                                <input
                                    type="text"
                                    className="w-full bg-transparent border-b border-white/10 py-3 focus:outline-none focus:border-primary transition-colors text-lg"
                                    placeholder="John Doe"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs uppercase tracking-widest font-bold text-slate-500">Email</label>
                                <input
                                    type="email"
                                    className="w-full bg-transparent border-b border-white/10 py-3 focus:outline-none focus:border-primary transition-colors text-lg"
                                    placeholder="john@example.com"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs uppercase tracking-widest font-bold text-slate-500">Message</label>
                                <textarea
                                    className="w-full bg-transparent border-b border-white/10 py-3 focus:outline-none focus:border-primary transition-colors text-lg resize-none"
                                    placeholder="Tell me about your project..."
                                    rows={4}
                                />
                            </div>
                            <button className="group flex items-center gap-3 text-lg font-bold uppercase tracking-widest hover:text-primary transition-colors pt-4">
                                Send Message
                                <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                            </button>
                        </form>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
