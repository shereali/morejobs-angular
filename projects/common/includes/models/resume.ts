export interface PersonalDetailModel {
  id: number;
  first_name: string;
  last_name: string;
  username: string;
  user_type: {
    id: number;
    title: string;
  };
  reg_medium: {
    id: number;
    title: string;
  };
  image: string | null;
  account_verified_at: string;
  status: {
    id: number;
    title: string;
  };
  created_at: string;
  contact_emails: Array<UserContactModal>;
  contact_mobiles: Array<UserContactModal>;
  profile: UserProfileModal;
}

export interface UserContactModal {
  id: number;
  title: string;
  type: number;
  is_verified: boolean;
  is_default: boolean;
  created_at: string;
}

export interface UserProfileModal {
  nationality: string;
  id: number;
  father_name: string | null;
  mother_name: string | null;
  dob: string | null;
  gender_id: number | null;
  gender: { id: number; title: string } | null;
  religion_id: number | null;
  religion: { id: number; title: string } | null;
  marital_status_id: number | null;
  marital_status: { id: number; title: string } | null;
  country_id: number | null;
  country: { id: number; title: string } | null;
  nid_no: string | null;
  present_area_id: number | null;
  present_area: { id: number; title_en: string } | null;
  permanent_area_id: number| null;
  permanent_area: { id: number; title: string } | null;
  present_address: string | null;
  permanent_address: string | null;
  objective: string | null;
  career_summary: string | null;
  keywords: string | null;
  extracurricular: string | null;
  specialization: string | null;
  present_salary: number;
  expected_salary: number;
  job_level_id: number | null;
  job_nature_id: number | null;
  job_level: { id: number; title: string } | null;
  job_nature: { id: number; title: string } | null;
  resume_file: string | null;
}

export interface ResumeEditInitialDataModel {
  religions: Array<CommonDropDownModel>;
  gender: Array<CommonDropDownModel>;
  marital_status: Array<CommonDropDownModel>;
  countries: Array<CommonDropDownModel>;
}

export interface CommonDropDownModel {
  id: number;
  title: string;
}

export interface ResumeDetailModel extends PersonalDetailModel {
  certifications: Array<any>;
  references: Array<any>;
  educations: Array<EducationModel>;
  trainings: Array<TrainingModel>;
  specializations: Array<SpecializationModel>;
  preferred_organization_types: Array<PreferredOrganizationTypeModel>;
  preferred_areas: Array<PreferredAreaModel>;
  preferred_job_categories: Array<PreferredJobCategoryModel>;
  language_proficiencies: Array<LanguageProficiencyModel>;
  job_experiences: Array<JobExperiencesModel>;
}

export interface EducationModel {
  id: number;
  education_level_id: number;
  degree_id: number;
  hide_mark: number;
  passing_year: number;
  duration: number;
  institute_name: string;
  achievement: string;
  cgpa: number;
  result_type_id: number;
  education_level: {
    id: number;
    title: string;
  };
  degree: {
    id: number;
    title: string;
  };
  result_type: {
    id: number;
    title: string;
  };
}

export interface TrainingModel {
  id: number;
  title: string;
  country_id: number;
  topic: string;
  year: number;
  duration: number;
  institute_name: string;
  address: string;
  country: {
    id: number;
    title: string;
  };
}

export interface SpecializationModel {
  id: string;
  title: string;
}

export interface PreferredOrganizationTypeModel {
  id: number;
  title_en: string;
  title_bn: string;
}

export interface PreferredAreaModel {
  id: number;
  title_en: string;
  title_bn: string;
}

export interface PreferredJobCategoryModel {
  id: number;
  title_en: string;
  title_bn: string;
}

export interface LanguageProficiencyModel {
  id: number;
  title: string;
  reading_skill: string;
  writing_skill: string;
  speaking_skill: string;
}

export interface JobExperiencesModel {
  id: number;
  company_name: string;
  industry_type_id: number;
  designation: string;
  address: string;
  department: string;
  from: string;
  to: string;
  is_current: number;
}
