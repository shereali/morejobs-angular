import {CommonSelectBox} from '../models/common';

export interface PaginatedData<T> {
  current_page: number;
  data: T[];
  first_page_url: string;
  from: number;
  last_page: number;
  last_page_url: string;
  next_page_url: string;
  path: string;
  per_page: number;
  prev_page_url: string;
  to: number;
  total: number;
}

export class Pagination<T = any> {
  'current_page' = 1;
  'from': number;
  'to': number;
  'total': number;
  'per_page': number;
  'last_page': number;
  'last_page_url': string;
  'next_page_url': string;
  'prev_page_url': string;
  'first_page_url': string;

  constructor(data?: PaginatedData<T>) {
    if (data) {
      this.current_page = data.current_page;
      this.from = data.from;
      this.total = data.total;
      this.per_page = data.per_page;
      this.to = data.to;

      this.last_page = data.last_page;
      this.last_page_url = data.last_page_url;
      this.next_page_url = data.next_page_url;
      this.prev_page_url = data.prev_page_url;
      this.first_page_url = data.first_page_url;
    }
  }
}

export const perPageOptions: Array<CommonSelectBox> = [
  {id: 1, value: '50', title: '50'},
  {id: 2, value: '100', title: '100'},
  {id: 3, value: '200', title: '200'},
  {id: 4, value: '300', title: '300'},
  {id: 5, value: '400', title: '400'},
  {id: 6, value: '500', title: '500'},
];
