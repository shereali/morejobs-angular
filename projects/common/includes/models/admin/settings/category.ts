export interface CategoryModel {
  id: number;
  title_en: string;
  title_bn: string;
  category_type_id: number;
  tag_id: number;
  category_type: { id: number; title_en: string; title_bn: string };
  tag: { id: number; title_en: string; title_bn: string };
  posts_count: number;
}
