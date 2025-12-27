'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase/client';
import { toast } from 'sonner';
import { Settings as SettingsIcon, Save, Globe, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function SettingsPage() {
    const [liveStatus, setLiveStatus] = useState({ status: '', color: 'green' });
    const [socialLinks, setSocialLinks] = useState({ github: '', linkedin: '', twitter: '', instagram: '' });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchConfig = async () => {
            const { data, error } = await supabase.from('site_config' as any).select('*');
            if (data) {
                const status = (data as any).find((c: any) => c.key === 'live_status');
                const social = (data as any).find((c: any) => c.key === 'social_links');
                if (status) setLiveStatus(status.value);
                if (social) setSocialLinks(social.value);
            }
            setLoading(false);
        };
        fetchConfig();
    }, []);

    const saveConfig = async (key: string, value: any) => {
        try {
            const { error } = await supabase
                .from('site_config')
                .upsert({ key, value, updated_at: new Date().toISOString() }, { onConflict: 'key' });
            if (error) throw error;
            toast.success('Configuration saved');
        } catch (error: any) {
            toast.error(error.message);
        }
    };

    if (loading) return <div className="p-8">Loading settings...</div>;

    return (
        <div className="p-8 space-y-8">
            <div>
                <h1 className="text-3xl font-bold font-heading">Settings</h1>
                <p className="text-muted-foreground italic">Manage global site behavior and social connectivity.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Live Status */}
                <Card className="glass-dark border-white/5">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Info size={18} className="text-cyan-400" />
                            Live Status
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label>Status Text</Label>
                            <Input
                                value={liveStatus.status}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setLiveStatus({ ...liveStatus, status: e.target.value })}
                                placeholder="e.g. Available for Work"
                                className="bg-slate-900 border-white/10"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Indicator Color</Label>
                            <select
                                value={liveStatus.color}
                                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setLiveStatus({ ...liveStatus, color: e.target.value })}
                                className="w-full p-2 rounded-md bg-slate-900 border border-white/10 text-sm"
                            >
                                <option value="green">Green (Active)</option>
                                <option value="yellow">Yellow (Busy)</option>
                                <option value="red">Red (Away)</option>
                                <option value="blue">Blue (Learning)</option>
                            </select>
                        </div>
                        <Button className="w-full mt-4 bg-cyan-500 hover:bg-cyan-600" onClick={() => saveConfig('live_status', liveStatus)}>
                            <Save size={16} className="mr-2" />
                            Update Status
                        </Button>
                    </CardContent>
                </Card>

                {/* Social Links */}
                <Card className="glass-dark border-white/5">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Globe size={18} className="text-purple-400" />
                            Social Links
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {Object.keys(socialLinks).map((key) => (
                            <div key={key} className="space-y-2">
                                <Label className="capitalize">{key} URL</Label>
                                <Input
                                    value={(socialLinks as any)[key]}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSocialLinks({ ...socialLinks, [key]: e.target.value })}
                                    className="bg-slate-900 border-white/10"
                                />
                            </div>
                        ))}
                        <Button className="w-full mt-4 bg-purple-500 hover:bg-purple-600" onClick={() => saveConfig('social_links', socialLinks)}>
                            <Save size={16} className="mr-2" />
                            Save All Links
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
