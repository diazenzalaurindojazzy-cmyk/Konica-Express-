export interface Experience {
  id: string;
  jobTitle: string;
  company: string;
  location: string;
  startDate: string;
  endDate: string;
  description: string;
}

export interface Education {
  id:string;
  institution: string;
  degree: string;
  fieldOfStudy: string;
  startDate: string;
  endDate: string;
}

export interface ResumeData {
  profilePicture: string | null;
  fullName: string;
  jobTitle: string;
  email: string;
  phone: string;
  location: string;
  linkedin: string;
  portfolio: string;
  summary: string;
  skills: string[];
  experience: Experience[];
  education: Education[];
}

export enum Template {
    Modern = 'Modern',
    Classic = 'Classic',
    Creative = 'Creative',
    Professional = 'Professional',
}