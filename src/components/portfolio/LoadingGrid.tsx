import { Skeleton } from '@/components/ui/skeleton';

export function LoadingGrid() {
    return (
        <section className="py-20 px-4 bg-slate-50 dark:bg-slate-900">
            <div className="container mx-auto">
                <div className="text-center mb-12">
                    <Skeleton className="h-12 w-64 mx-auto mb-4" />
                    <Skeleton className="h-6 w-96 mx-auto" />
                </div>

                <div className="flex gap-4 justify-center mb-12">
                    <Skeleton className="h-10 w-32 rounded-full" />
                    <Skeleton className="h-10 w-32 rounded-full" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                        <div key={i} className="rounded-xl border border-slate-200 dark:border-slate-800 p-4 space-y-4 bg-white dark:bg-slate-950">
                            <Skeleton className="h-48 w-full rounded-lg" />
                            <div className="space-y-2">
                                <Skeleton className="h-6 w-3/4" />
                                <Skeleton className="h-4 w-full" />
                                <Skeleton className="h-4 w-1/2" />
                            </div>
                            <div className="flex gap-2">
                                <Skeleton className="h-6 w-12 rounded-full" />
                                <Skeleton className="h-6 w-12 rounded-full" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
