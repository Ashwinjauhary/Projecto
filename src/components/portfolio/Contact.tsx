'use client';

import { motion } from 'framer-motion';
import { Mail, Github, Linkedin, Twitter, ArrowRight, Loader2 } from 'lucide-react';
import { supabase } from '@/lib/supabase/client';
import { toast } from 'sonner';
import { useState } from 'react';

export function Contact() {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: ''
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.name || !formData.email || !formData.message) {
            toast.error('Please fill in all fields');
            return;
        }

        setIsSubmitting(true);
        try {
            const { error } = await supabase
                .from('contact_messages' as any)
                .insert([{
                    name: formData.name,
                    email: formData.email,
                    message: formData.message,
                    subject: 'Portfolio Inquiry',
                    status: 'unread'
                } as any]);

            if (error) throw error;

            toast.success('Artifact received! I will get back to you soon.');
            setFormData({ name: '', email: '', message: '' });
        } catch (error: any) {
            toast.error(error.message || 'Transmission failed. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <section id="contact" className="py-32 px-4 bg-slate-950 text-white relative overflow-hidden">
            {/* Background Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none" />

            <div className="container mx-auto max-w-5xl relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                    <div>
                        <motion.h2
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            className="font-heading text-5xl md:text-7xl font-black mb-8 uppercase tracking-tighter italic"
                        >
                            Open <br />
                            <span className="text-gradient">Connectivity</span>
                        </motion.h2>
                        <p className="text-xl text-slate-400 mb-12 max-w-md font-light leading-relaxed">
                            Ready to collaborate on the next high-end digital artifact? Send a signal.
                        </p>

                        <div className="flex gap-6">
                            {[
                                { icon: Github, href: 'https://github.com/Ashwinjauhary' },
                                { icon: Linkedin, href: '#' },
                                { icon: Twitter, href: '#' },
                                { icon: Mail, href: 'mailto:ashwinjauhary@example.com' },
                            ].map((social, i) => (
                                <motion.a
                                    key={i}
                                    href={social.href}
                                    target="_blank"
                                    whileHover={{ scale: 1.1, y: -5 }}
                                    className="w-12 h-12 rounded-2xl glass border-white/5 flex items-center justify-center text-slate-400 hover:text-cyan-400 hover:border-cyan-500/30 transition-all duration-500"
                                >
                                    <social.icon className="w-5 h-5" />
                                </motion.a>
                            ))}
                        </div>
                    </div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        className="glass-dark border border-white/5 p-10 rounded-[2.5rem] relative group"
                    >
                        <form className="space-y-8" onSubmit={handleSubmit}>
                            <div className="space-y-2">
                                <label className="text-[10px] uppercase tracking-[0.2em] font-black text-slate-500">Identity</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full bg-transparent border-b border-white/5 py-4 focus:outline-none focus:border-cyan-500 transition-colors text-lg font-light"
                                    placeholder="John Doe"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] uppercase tracking-[0.2em] font-black text-slate-500">Signal Address</label>
                                <input
                                    type="email"
                                    required
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className="w-full bg-transparent border-b border-white/5 py-4 focus:outline-none focus:border-cyan-500 transition-colors text-lg font-light"
                                    placeholder="john@nexus.com"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] uppercase tracking-[0.2em] font-black text-slate-500">The Message</label>
                                <textarea
                                    required
                                    value={formData.message}
                                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                    className="w-full bg-transparent border-b border-white/5 py-4 focus:outline-none focus:border-cyan-500 transition-colors text-lg font-light resize-none"
                                    placeholder="I'm reaching out to..."
                                    rows={3}
                                />
                            </div>
                            <button
                                disabled={isSubmitting}
                                className="group w-full md:w-auto h-16 px-10 glass rounded-2xl flex items-center justify-center gap-4 text-sm font-black uppercase tracking-[0.2em] hover:bg-white/5 hover:border-cyan-500/30 transition-all duration-500 disabled:opacity-50"
                            >
                                {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                                    <>
                                        Transmit
                                        <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform duration-500" />
                                    </>
                                )}
                            </button>
                        </form>

                        {/* Decorative Gradient */}
                        <div className="absolute inset-x-10 -bottom-1 h-px bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
