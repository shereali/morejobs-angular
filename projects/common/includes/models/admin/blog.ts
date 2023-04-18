export interface BlogModel {
  id: number;
  type: number;
  title: string;
  subtitle: string;
  description: string;
  cover_image: string;
  status: {
    id: number;
    title: string;
  };
  created_at: string;
}
