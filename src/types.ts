export type TemplateType = 'circulair' | 'modern' | 'luxe' | 'professioneel';

export type FontType = 'sans' | 'serif' | 'display';

export type SpacingType = 'compact' | 'normal' | 'spacious';

export interface EducationItem {
  id: string;
  title: string;
  institution: string;
  location: string;
  period: string;
  description: string;
}

export interface ExperienceItem {
  id: string;
  role: string;
  company: string;
  location: string;
  period: string;
  description: string;
}

export interface PersonalInfo {
  fullName: string;
  title: string;
  email: string;
  phone: string;
  address: string;
  postalCodeCity: string;
  linkedin: string;
  website: string;
  photoUrl: string;
  summary: string;
}

export interface CVData {
  personal: PersonalInfo;
  education: EducationItem[];
  experience: ExperienceItem[];
  skills: string[];
  hobbies: string[];
}

export interface CVConfig {
  template: TemplateType;
  accentColor: string;
  font: FontType;
  spacing: SpacingType;
}
