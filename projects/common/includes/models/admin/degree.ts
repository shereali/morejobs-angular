export interface DegreeModel {
  id: number;
  title: string;
  education_level_id: number;
  major_required: boolean;
  education_level: { id: number; title: string };
}
