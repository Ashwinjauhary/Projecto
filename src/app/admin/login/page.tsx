'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { Github } from 'lucide-react';

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleEmailLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (error) throw error;

            toast.success('Logged in successfully!');

            // Wait a moment for cookies to be set
            await new Promise(resolve => setTimeout(resolve, 500));

            // Verify session is available
            const { data: { session } } = await supabase.auth.getSession();

            if (session) {
                // Use hard redirect to ensure session is loaded on server
                window.location.href = '/admin/dashboard';
            } else {
                throw new Error('Session not established. Please try again.');
            }
        } catch (error: any) {
            toast.error(error.message || 'Failed to log in');
            setLoading(false);
        }
    };

    const handleGitHubLogin = async () => {
        setLoading(true);

        try {
            const { error } = await supabase.auth.signInWithOAuth({
                provider: 'github',
                options: {
                    redirectTo: `${window.location.origin}/admin/dashboard`,
                },
            });

            if (error) throw error;
        } catch (error: any) {
            toast.error(error.message || 'Failed to log in with GitHub');
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-4">
            <Card className="w-full max-w-md">
                <CardHeader className="space-y-4">
                    <div className="flex justify-center">
                        <div className="w-16 h-16 rounded-2xl overflow-hidden border border-slate-800 bg-slate-900 p-2">
                            <img src="/icon.png" alt="Logo" className="w-full h-full object-contain" />
                        </div>
                    </div>
                    <CardTitle className="text-3xl font-heading font-bold text-center">
                        Admin Hub
                    </CardTitle>
                    <CardDescription className="text-center">
                        Sign in to manage your portfolio
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <form onSubmit={handleEmailLogin} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="admin@example.com"
                                value={email}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                                required
                                disabled={loading}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <Input
                                id="password"
                                type="password"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                                required
                                disabled={loading}
                            />
                        </div>
                        <Button type="submit" className="w-full" disabled={loading}>
                            {loading ? 'Signing in...' : 'Sign In'}
                        </Button>
                    </form>

                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-background px-2 text-muted-foreground">
                                Or continue with
                            </span>
                        </div>
                    </div>

                    <Button
                        type="button"
                        variant="outline"
                        className="w-full"
                        onClick={handleGitHubLogin}
                        disabled={loading}
                    >
                        <Github className="mr-2 h-4 w-4" />
                        GitHub
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
}
