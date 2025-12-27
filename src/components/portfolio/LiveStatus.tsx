'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/lib/supabase/client';

export function LiveStatus() {
    const [status, setStatus] = useState<{ status: string; color: string } | null>(null);

    useEffect(() => {
        const fetchStatus = async () => {
            const { data, error } = await (supabase.from('site_config' as any) as any)
                .select('value')
                .eq('key', 'live_status')
                .single();

            if (data) {
                setStatus(data.value);
            }
        };

        fetchStatus();

        // Optional: Real-time subscription
        const channel = supabase
            .channel('site_config_changes')
            .on('postgres_changes', {
                event: 'UPDATE',
                schema: 'public',
                table: 'site_config',
                filter: "key=eq.live_status"
            }, (payload: any) => {
                setStatus(payload.new.value);
            })
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, []);

    if (!status) return null;

    const colorMap: Record<string, string> = {
        green: 'bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.5)]',
        orange: 'bg-orange-500 shadow-[0_0_15px_rgba(249,115,22,0.5)]',
        red: 'bg-red-500 shadow-[0_0_15px_rgba(239,68,68,0.5)]',
        blue: 'bg-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.5)]',
    };

    const pulseColorMap: Record<string, string> = {
        green: 'bg-emerald-500/50',
        orange: 'bg-orange-500/50',
        red: 'bg-red-500/50',
        blue: 'bg-blue-500/50',
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-3 px-4 py-2 glass border-white/5 rounded-full"
        >
            <div className="relative flex h-2 w-2">
                <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${pulseColorMap[status.color] || pulseColorMap.green}`}></span>
                <span className={`relative inline-flex rounded-full h-2 w-2 ${colorMap[status.color] || colorMap.green}`}></span>
            </div>
            <span className="text-[10px] uppercase font-black tracking-[0.2em] text-white/80">
                {status.status}
            </span>
        </motion.div>
    );
}
