export interface PersonalData {
  name: string;
  title: string;
  email: string;
  phone: string;
  location: string;
  linkedin: string;
  summary: string;
  photo?: string;
}

export interface Skill {
  id: string;
  name: string;
  level: number;
}

export interface Experience {
  id: string;
  jobTitle: string;
  company: string;
  startDate: string;
  endDate: string;
  description: string;
}

export interface Education {
  id: string;
  degree: string;
  institution: string;
  startDate: string;
  endDate: string;
}

export interface ResumeData {
  personal: PersonalData;
  skills: Skill[];
  experience: Experience[];
  education: Education[];
}

export interface SummaryOption {
  title: string;
  description: string;
  content: string;
}
