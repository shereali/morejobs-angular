import {CommonSelectBox} from '../common';

export interface PostModel {
  category_id: number;
  image: string;
  company_id: number;
  publish_date: string;
  source: string;
  job_listing_type_id: number;
  id: number;
  title: string;
  category: { id: number; title_en: string };
  company: {
    id: number;
    title_en: string;
    organization_type: { id: number; title_en: string }
  };
  applicants_count: number;
  short_listed_count: number;
  status: { id: number; title: string };
  deadline: string;
  created_at: string;
}


export const perPageOptions: Array<CommonSelectBox> = [
  {id: 1, value: '50', title: '50'},
  {id: 2, value: '100', title: '100'},
  {id: 3, value: '200', title: '200'},
  {id: 4, value: '300', title: '300'},
  {id: 5, value: '400', title: '400'},
  {id: 6, value: '500', title: '500'},
];
