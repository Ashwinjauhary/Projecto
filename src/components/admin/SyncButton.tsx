'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';
import { toast } from 'sonner';

export function SyncButton() {
    const router = useRouter();
    const [syncing, setSyncing] = useState(false);

    const handleSync = async () => {
        setSyncing(true);

        try {
            const response = await fetch('/api/sync', {
                method: 'POST',
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to sync');
            }

            toast.success(`Successfully synced ${data.synced} projects!`);
            router.refresh();
        } catch (error: any) {
            toast.error(error.message || 'Failed to sync projects');
        } finally {
            setSyncing(false);
        }
    };

    return (
        <Button onClick={handleSync} disabled={syncing}>
            <RefreshCw className={`w-4 h-4 mr-2 ${syncing ? 'animate-spin' : ''}`} />
            {syncing ? 'Syncing...' : 'Sync GitHub'}
        </Button>
    );
}
