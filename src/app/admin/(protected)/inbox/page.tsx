'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase/client';
import { toast } from 'sonner';
import { Mail, Trash2, CheckCircle, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Message {
    id: string;
    name: string;
    email: string;
    subject: string;
    message: string;
    status: 'unread' | 'read' | 'archived';
    created_at: string;
}

export default function InboxPage() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchMessages = async () => {
        try {
            const { data, error } = await (supabase
                .from('contact_messages' as any) as any)
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            setMessages(data || []);
        } catch (error: any) {
            toast.error(error.message || 'Failed to fetch messages');
        } finally {
            setLoading(false);
        }
    };

    const updateStatus = async (id: string, status: string) => {
        try {
            const { error } = await (supabase
                .from('contact_messages' as any) as any)
                .update({ status } as any)
                .eq('id', id);

            if (error) throw error;
            toast.success(`Message marked as ${status}`);
            fetchMessages();
        } catch (error: any) {
            toast.error(error.message || 'Update failed');
        }
    };

    const deleteMessage = async (id: string) => {
        if (!confirm('Are you sure you want to delete this message?')) return;
        try {
            const { error } = await (supabase
                .from('contact_messages' as any) as any)
                .delete()
                .eq('id', id);

            if (error) throw error;
            toast.success('Message deleted');
            fetchMessages();
        } catch (error: any) {
            toast.error(error.message || 'Delete failed');
        }
    };

    useEffect(() => {
        fetchMessages();
    }, []);

    if (loading) return <div className="p-8">Loading messages...</div>;

    return (
        <div className="p-8 space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold font-heading">Inbox</h1>
                    <p className="text-muted-foreground italic">Manage inquiries from your portfolio artifacts.</p>
                </div>
            </div>

            <div className="grid gap-6">
                {messages.length === 0 ? (
                    <div className="text-center py-20 bg-slate-50 dark:bg-slate-900/50 rounded-3xl border border-dashed border-slate-200 dark:border-slate-800">
                        <Mail className="w-12 h-12 mx-auto mb-4 text-slate-400 opacity-20" />
                        <p className="text-slate-500 font-light">Your inbox is a blank slate.</p>
                    </div>
                ) : (
                    messages.map((msg) => (
                        <div
                            key={msg.id}
                            className={`p-6 rounded-3xl border transition-all duration-300 ${msg.status === 'unread'
                                ? 'bg-white dark:bg-slate-900 border-cyan-500/20 shadow-lg shadow-cyan-500/5'
                                : 'bg-slate-50/50 dark:bg-slate-900/20 border-slate-200 dark:border-slate-800'
                                }`}
                        >
                            <div className="flex justify-between items-start gap-4">
                                <div className="space-y-1 flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                        <span className="font-bold text-white italic">{msg.name}</span>
                                        <span className="text-xs text-slate-500">({msg.email})</span>
                                        {msg.status === 'unread' && (
                                            <span className="px-2 py-0.5 rounded-full bg-cyan-400/10 text-cyan-400 text-[10px] uppercase font-black tracking-widest">Unread</span>
                                        )}
                                    </div>
                                    <h2 className="text-lg font-bold text-slate-300 mb-2">{msg.subject || 'Inquiry'}</h2>
                                    <p className="text-slate-400 font-light leading-relaxed whitespace-pre-wrap">{msg.message}</p>
                                    <div className="flex items-center gap-2 mt-4 text-[10px] text-slate-500 uppercase tracking-widest">
                                        <Clock size={12} />
                                        {new Date(msg.created_at).toLocaleString()}
                                    </div>
                                </div>

                                <div className="flex gap-2">
                                    {msg.status === 'unread' && (
                                        <Button
                                            size="sm"
                                            variant="ghost"
                                            className="text-cyan-400 hover:text-cyan-300 hover:bg-cyan-400/10"
                                            onClick={() => updateStatus(msg.id, 'read')}
                                        >
                                            <CheckCircle size={18} />
                                        </Button>
                                    )}
                                    <Button
                                        size="sm"
                                        variant="ghost"
                                        className="text-rose-400 hover:text-rose-300 hover:bg-rose-400/10"
                                        onClick={() => deleteMessage(msg.id)}
                                    >
                                        <Trash2 size={18} />
                                    </Button>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
