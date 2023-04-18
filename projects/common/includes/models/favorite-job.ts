import {CommonSelectBox} from './common';

export interface FavJobModel {
  id: number;
  user_id: number;
  post_id: number;
  post: PostModel;
}

export interface PostModel {
  id: number;
  title: string;
  deadline: string;
  company: CompanyModel;
}

export interface CompanyModel {
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
