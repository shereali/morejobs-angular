import {CommonSelectBox} from '../common';

export interface CompanyModel {
  about: string;
  address_bn: string;
  address_en: string;
  area_id: number;
  area: { title: string; id: number; parent_id: number };
  created_at: string;
  default_contact: string;
  id: number;
  logo: string;
  organization_type_id: number;
  organization_type: { title_en: string; id: number };
  industry_types: Array<{ title_en: string; title_bn: string; id: number }>;
  rl_no: string;
  status: { id: number; title: string };
  title_bn: string;
  title_en: string;
  year_establishment: number;
  company_size: string;
  trade_licence_no: string;
  updated_at: string;
  website: string;
}


export const perPageOptions: Array<CommonSelectBox> = [
  {id: 1, value: '50', title: '50'},
  {id: 2, value: '100', title: '100'},
  {id: 3, value: '200', title: '200'},
  {id: 4, value: '300', title: '300'},
  {id: 5, value: '400', title: '400'},
  {id: 6, value: '500', title: '500'},
];
