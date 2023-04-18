export interface AreaModel {
  id: number;
  title_en: string;
  title_bn: string;
  slug: string;
  parent_id: number | null;
  country_id: number | null;
  level: number;
  sub_areas: Array<AreaModel>;
}
