export interface ApiResponse<T> {
    message?: string;
    errors?: any;
    options?: any;
    success?: boolean;
    status?: number;
    data?: T;
}

export interface CommonSelectBox {
  id?: number;
  value: string | number;
  title: string;
}

export const perPageOptions: Array<CommonSelectBox> = [
  {id: 1, value: '50', title: '50'},
  {id: 2, value: '100', title: '100'},
  {id: 3, value: '200', title: '200'},
  {id: 4, value: '300', title: '300'},
  {id: 5, value: '400', title: '400'},
  {id: 6, value: '500', title: '500'},
];

