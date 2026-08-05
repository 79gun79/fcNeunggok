export interface Comment {
  id: number;
  post_id: number;
  content: string;
  author: string;
  avatar_url: string | null;
  user_id: string;
  created_at: string;
  updated_at: string;
}
