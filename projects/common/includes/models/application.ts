import {CommonSelectBox} from './common';

export interface ApplicationModel {
  id: number;
  title: string;
  is_viewed: boolean;
  application_status: number;
  expected_salary: number;
  applied_at: string;
  company: CompanyMode;
}

export interface CompanyMode {
  id: number;
  title_en: string;
  title_bn: string;
  company_id: number;
}

export const perPageOptions: Array<CommonSelectBox> = [
  {id: 1, value: '50', title: '50'},
  {id: 2, value: '100', title: '100'},
  {id: 3, value: '200', title: '200'},
  {id: 4, value: '300', title: '300'},
  {id: 5, value: '400', title: '400'},
  {id: 6, value: '500', title: '500'},
];
