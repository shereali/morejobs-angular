import {CommonSelectBox} from './common';

export interface ResumeViewModel {
  viewed_at: string;
  is_viewed: boolean;
  company: CompanyModel;
}


export interface CvSummary {
  user: {
    id: number;
    first_name: string;
    last_name: string;
    image: string | null;
  };
  mobile: { id: number; title: string } | null;
  education: { id: number; institute_name: string } | null;
  job_experiences: {
    company_name: string;
    designation: string;
    address: string;
    exp_duration: string;
  }[];
  other: {
    total_age: string;
    total_exp: { years: number; months: string }
  };
}

interface CompanyModel {
  id: number;
  title_en: string;
  title_bn: string;
}

export const perPageOptions: Array<CommonSelectBox> = [
  {id: 1, value: '50', title: '50'},
  {id: 2, value: '100', title: '100'},
  {id: 3, value: '200', title: '200'},
  {id: 4, value: '300', title: '300'},
  {id: 5, value: '400', title: '400'},
  {id: 6, value: '500', title: '500'},
];
