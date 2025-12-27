export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[]

export type Database = {
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
                    view_count: number
                    click_count: number
                    created_at: string
                    updated_at: string | null
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
                    view_count?: number
                    click_count?: number
                    created_at?: string
                    updated_at?: string | null
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
                    view_count?: number
                    click_count?: number
                    created_at?: string
                    updated_at?: string | null
                }
                Relationships: []
            }
            project_media: {
                Row: {
                    id: string
                    project_id: string | null
                    type: "video" | "image" | null
                    url: string
                    order_index: number
                    created_at: string | null
                }
                Insert: {
                    id?: string
                    project_id?: string | null
                    type?: "video" | "image" | null
                    url: string
                    order_index?: number
                    created_at?: string | null
                }
                Update: {
                    id?: string
                    project_id?: string | null
                    type?: "video" | "image" | null
                    url?: string
                    order_index?: number
                    created_at?: string | null
                }
                Relationships: [
                    {
                        foreignKeyName: "project_media_project_id_fkey"
                        columns: ["project_id"]
                        isOneToOne: false
                        referencedRelation: "projects"
                        referencedColumns: ["id"]
                    },
                ]
            }
            contact_messages: {
                Row: {
                    id: string
                    name: string
                    email: string
                    subject: string | null
                    message: string
                    status: string | null
                    created_at: string | null
                }
                Insert: {
                    id?: string
                    name: string
                    email: string
                    subject?: string | null
                    message: string
                    status?: string | null
                    created_at?: string | null
                }
                Update: {
                    id?: string
                    name?: string
                    email?: string
                    subject?: string | null
                    message?: string
                    status?: string | null
                    created_at?: string | null
                }
                Relationships: []
            }
            site_config: {
                Row: {
                    id: string
                    key: string
                    value: Json
                    updated_at: string | null
                }
                Insert: {
                    id?: string
                    key: string
                    value: Json
                    updated_at?: string | null
                }
                Update: {
                    id?: string
                    key?: string
                    value?: Json
                    updated_at?: string | null
                }
                Relationships: []
            }
        }
        Views: {
            [_ in never]: never
        }
        Functions: {
            increment_view_count: {
                Args: {
                    project_id: string
                }
                Returns: undefined
            }
            increment_click_count: {
                Args: {
                    project_id: string
                }
                Returns: undefined
            }
        }
        Enums: {
            [_ in never]: never
        }
    }
}
