import {UserContactModal} from './resume';

export interface User {
  username: string;
  id: number;
  first_name: string;
  last_name: string;
  image: string;
}

export interface Users {
  total: number;
  last_page: number;
  current_page?: number;
  data: {
    id: number;
    name: number;
  };
}

export interface UserModel {
  contact_emails: Array<UserContactModal>;
  resume_completed: boolean;
  user_type: { id: number; title: string };
  status: { id: number; title: string };
  created_at: string;
  id: number;
  first_name: string;
  last_name: string;
  image: string;
}
