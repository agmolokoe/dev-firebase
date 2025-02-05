
export type ContentStatus = 'draft' | 'scheduled' | 'published' | 'failed';

export interface ContentPlan {
  id: string;
  platform: string;
  content_type: string;
  title: string;
  description?: string;
  media_url?: string[];
  scheduled_for?: string;
  status: ContentStatus;
  hashtags?: string[];
  created_at?: string;
  updated_at?: string;
}

export interface ContentPlanFormData {
  platform: string;
  content_type: string;
  title: string;
  description?: string;
  scheduled_for?: string;
  hashtags?: string[];
}
