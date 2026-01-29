export interface Photo {
  id: number;
  src: string;
  description: string;
  created_at?: string;
  updated_at?: string;
  user_id?: string;
  user_name?: string;
  user_email?: string;
}
