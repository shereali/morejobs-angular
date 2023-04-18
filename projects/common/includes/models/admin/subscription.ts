import {CommonSelectBox} from '../common';
import {CompanyModel} from './company';

export interface SubscriptionModel {
  id: number;
  package_id: number;
  package_detail_id: number;
  quantity: number;
  paid: number;
  total: number;
  remaining: number;
  subscribe_at: string;
  expire_at: string;
  created_at: string;
  updated_at: string;
  status: { id: number; title: string };
  package: PackageModel;
  detail: PackageDetailModel;
  company: CompanyModel;
}

export interface PackageModel {
  id: number;
  title: string;
  features: string;
}

export interface PackageDetailModel {
  id: number;
  quantity_from: number;
  quantity_to: number;
  price: number;
  duration: number;
}


export const perPageOptions: Array<CommonSelectBox> = [
  {id: 1, value: '50', title: '50'},
  {id: 2, value: '100', title: '100'},
  {id: 3, value: '200', title: '200'},
  {id: 4, value: '300', title: '300'},
  {id: 5, value: '400', title: '400'},
  {id: 6, value: '500', title: '500'},
];
