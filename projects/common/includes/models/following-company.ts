import {CommonSelectBox} from './common';

export interface FollowingCompanyModel {
  id: number;
  user_id: number;
  company_id: number;
  company: CompanyModel;
}

export interface CompanyModel {
  id: number;
  title_en: string;
  title_bn: string;
  jobs_count: number;
}

export interface UnfollowedCompanyModel extends CompanyModel {
  open_from?: string;
  jobs_count: number;
}

export interface AvailableJobModel {
  id: number;
  title: string;
  deadline: string;
}


export const perPageOptions: Array<CommonSelectBox> = [
  {id: 1, value: '50', title: '50'},
  {id: 2, value: '100', title: '100'},
  {id: 3, value: '200', title: '200'},
  {id: 4, value: '300', title: '300'},
  {id: 5, value: '400', title: '400'},
  {id: 6, value: '500', title: '500'},
];
