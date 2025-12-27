export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[]

export interface Database {
    public: {
        Tables: {
            projects: {
                Row: {
                    id: string
                    repo_name: string
                    title: string | null
                    description: string | null
                    github_url: string
                    live_url: string | null
                    featured: boolean
                    visible: boolean
                    order_index: number
                    stars: number
                    forks: number
                    language: string | null
                    topics: string[] | null
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    repo_name: string
                    title?: string | null
                    description?: string | null
                    github_url: string
                    live_url?: string | null
                    featured?: boolean
                    visible?: boolean
                    order_index?: number
                    stars?: number
                    forks?: number
                    language?: string | null
                    topics?: string[] | null
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    repo_name?: string
                    title?: string | null
                    description?: string | null
                    github_url?: string
                    live_url?: string | null
                    featured?: boolean
                    visible?: boolean
                    order_index?: number
                    stars?: number
                    forks?: number
                    language?: string | null
                    topics?: string[] | null
                    created_at?: string
                    updated_at?: string
                }
                Relationships: []
            }
            project_media: {
                Row: {
                    id: string
                    project_id: string
                    type: 'image' | 'video'
                    url: string
                    order_index: number
                    created_at: string
                }
                Insert: {
                    id?: string
                    project_id: string
                    type: 'image' | 'video'
                    url: string
                    order_index?: number
                    created_at?: string
                }
                Update: {
                    id?: string
                    project_id?: string
                    type?: 'image' | 'video'
                    url?: string
                    order_index?: number
                    created_at?: string
                }
                Relationships: [
                    {
                        foreignKeyName: "project_media_project_id_fkey"
                        columns: ["project_id"]
                        isOneToOne: false
                        referencedRelation: "projects"
                        referencedColumns: ["id"]
                    }
                ]
            }
        }
        Views: {
            [_ in never]: never
        }
        Functions: {
            [_ in never]: never
        }
        Enums: {
            [_ in never]: never
        }
        CompositeTypes: {
            [_ in never]: never
        }
    }
}
