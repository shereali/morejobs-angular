import {CommonSelectBox} from '../common';

export interface Package {
  features: string;
  packages: [{
    filtered_details: [{
      id: number;
      quantity_to: number;
      price: number;
      quantity: number;
    }];
    id: number;
    title: string;
    features: string;
    preview_sample: string;
    details: [{
      quantity_to: number;
      price: number;
      quantity: number;
    }]

  }];
  is_recommended: any;
  id: number;
  title: string;
  applicants_count: number;
  short_listed_count: number;
  status: { id: number; title: string };
  deadline: string;
  created_at: string;
}
