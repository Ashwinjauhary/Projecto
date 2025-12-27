'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Image as ImageIcon, Video, X, Upload, Loader2, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { Database } from '@/lib/supabase/database_types';

type ProjectMedia = Database['public']['Tables']['project_media']['Row'];

interface MediaUploaderProps {
    projectId: string;
    initialMedia: ProjectMedia[];
}

export function MediaUploader({ projectId, initialMedia }: MediaUploaderProps) {
    const [media, setMedia] = useState<ProjectMedia[]>(initialMedia);
    const [uploading, setUploading] = useState(false);

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        setUploading(true);

        try {
            for (const file of Array.from(files)) {
                const fileExt = file.name.split('.').pop();
                const fileName = `${projectId}/${Math.random().toString(36).substring(2)}.${fileExt}`;
                const filePath = fileName;

                // 1. Upload to Supabase Storage
                const { error: uploadError } = await supabase.storage
                    .from('project-media')
                    .upload(filePath, file);

                if (uploadError) throw uploadError;

                // 2. Get Public URL
                const { data: { publicUrl } } = supabase.storage
                    .from('project-media')
                    .getPublicUrl(filePath);

                // 3. Save to project_media table
                const { data: mediaData, error: dbError } = await supabase
                    .from('project_media')
                    .insert({
                        project_id: projectId,
                        type: file.type.startsWith('video') ? 'video' : 'image',
                        url: publicUrl,
                        order_index: media.length,
                    })
                    .select()
                    .single();

                if (dbError) throw dbError;

                setMedia(prev => [...prev, mediaData]);
            }

            toast.success('Media uploaded successfully');
        } catch (error: any) {
            toast.error(error.message || 'Failed to upload media');
            console.error(error);
        } finally {
            setUploading(false);
            // Reset input
            e.target.value = '';
        }
    };

    const handleDelete = async (mediaItem: ProjectMedia) => {
        try {
            // 1. Delete from database
            const { error: dbError } = await supabase
                .from('project_media')
                .delete()
                .eq('id', mediaItem.id);

            if (dbError) throw dbError;

            // 2. Delete from storage (need to extract path from URL)
            // Note: This is simplified. In a real app, you'd store the storage path
            const urlParts = mediaItem.url.split('/');
            const fileName = urlParts[urlParts.length - 1];
            const storagePath = `${projectId}/${fileName}`;

            await supabase.storage
                .from('project-media')
                .remove([storagePath]);

            setMedia(prev => prev.filter(m => m.id !== mediaItem.id));
            toast.success('Media deleted');
        } catch (error: any) {
            toast.error('Failed to delete media');
            console.error(error);
        }
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <Label className="text-lg font-semibold">Project Media</Label>
                <div className="relative">
                    <input
                        type="file"
                        id="media-upload"
                        className="hidden"
                        multiple
                        accept="image/*,video/*"
                        onChange={handleFileUpload}
                        disabled={uploading}
                    />
                    <Label
                        htmlFor="media-upload"
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground cursor-pointer hover:opacity-90 transition-opacity ${uploading ? 'pointer-events-none opacity-50' : ''}`}
                    >
                        {uploading ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                            <Upload className="w-4 h-4" />
                        )}
                        {uploading ? 'Uploading...' : 'Upload Media'}
                    </Label>
                </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {media.map((item) => (
                    <Card key={item.id} className="relative group overflow-hidden bg-muted">
                        <CardContent className="p-0 aspect-video flex items-center justify-center">
                            {item.type === 'image' ? (
                                <img
                                    src={item.url}
                                    alt="Project media"
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="relative w-full h-full flex items-center justify-center bg-black">
                                    <Video className="w-8 h-8 text-white/50" />
                                    <video src={item.url} className="w-full h-full object-cover opacity-50" />
                                </div>
                            )}

                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                <Button
                                    variant="destructive"
                                    size="icon"
                                    className="h-8 w-8"
                                    onClick={() => handleDelete(item)}
                                >
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                ))}

                {media.length === 0 && !uploading && (
                    <div className="col-span-full py-12 flex flex-col items-center justify-center border-2 border-dashed rounded-xl text-muted-foreground">
                        <ImageIcon className="w-12 h-12 mb-2 opacity-20" />
                        <p>No media uploaded for this project</p>
                    </div>
                )}
            </div>
        </div>
    );
}
