import {CommonSelectBox} from '../common';

export interface JobPostModel {
  not_viewed_applicants_count: number;
  viewed_applicants_count: number;
  job_listing_type_id: number;
  id: number;
  title: string;
  applicants_count: number;
  short_listed_count: number;
  status: { id: number; title: string };
  deadline: string;
  created_at: string;
}

export interface CreateInitialDataModel {
  service_types: Array<{ id: number; title: string }>;
}


export const perPageOptions: Array<CommonSelectBox> = [
  {id: 1, value: '50', title: '50'},
  {id: 2, value: '100', title: '100'},
  {id: 3, value: '200', title: '200'},
  {id: 4, value: '300', title: '300'},
  {id: 5, value: '400', title: '400'},
  {id: 6, value: '500', title: '500'},
];
