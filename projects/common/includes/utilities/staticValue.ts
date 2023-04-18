import * as _ from 'lodash';

export const AGE_RANGE = _.range(12, 86, 1);
export const EXP_RANGE = _.range(0, 51, 1);

export const SALARY_RANGE_FROM = _.range(3000, 250001, 1000);
export const SALARY_RANGE_TO = _.range(4000, 250001, 1000);
export const YEAR_RANGE_TRAINING = _.range(2010, 2025, 1);
export const MONTH_RANGE = [
  {id: 1, title: 'January', short_title: 'Jan'},
  {id: 2, title: 'February', short_title: 'Feb'},
  {id: 3, title: 'March', short_title: 'Mar'},
  {id: 4, title: 'April', short_title: 'Apr'},
  {id: 5, title: 'May', short_title: 'May'},
  {id: 6, title: 'June', short_title: 'Jun'},
  {id: 7, title: 'July', short_title: 'Jul'},
  {id: 8, title: 'August', short_title: 'Aug'},
  {id: 9, title: 'September', short_title: 'Sep'},
  {id: 10, title: 'October', short_title: 'Oct'},
  {id: 11, title: 'November', short_title: 'Nov'},
  {id: 12, title: 'December', short_title: 'Dec'},
];
export const DAY_RANGE = _.range(1, 32, 1);
export const HOUR_RANGE = _.range(1, 25, 1);

export const COMPANY_SIDES = [
  {id: '1-15 employees', title: '1-15 employees'},
  {id: '16-30 employees', title: '16-30 employees'},
  {id: '31-50 employees', title: '31-50 employees'},
  {id: '51-120 employees', title: '51-120 employees'},
  {id: '121-300 employees', title: '121-300 employees'},
  {id: '301-500 employees', title: '301-500 employees'},
  {id: '501-1000 employees', title: '501-1000 employees'},
  {id: '1001-5000 employees', title: '1001-5000 employees'},
  {id: '5001-10000 employees', title: '5001-10000 employees'},
  {id: '10000+ employees', title: '10000+ employees'},
];

export const EXPERIENCE_AT_LEAST = _.range(1, 46, 1);
export const EXPERIENCE_AT_MOST = _.range(1, 51, 1);
