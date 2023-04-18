export interface TrainingModel {
  course_categories: Array<any>;
  deadline: string;
  id: number;
  title: string;
  duration_hour: number;
  duration_day: number;
  duration_month: number;
  duration_year: number;
  price: number;
  training_type_id: number;
  training_type: {
    id: number;
    title: string;
  };
  start_date: string;
  end_date: string;
  class_schedule: string;
  class_timetable: string;
  no_of_sessions: string;
  venue: string;
  trainer_id: number;
  trainer: {
    id: number;
    first_name: string;
    last_name: string;
  };
  who_can_attend: string;
  details: string;
  created_at: string;
}
