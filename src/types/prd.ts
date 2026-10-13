export interface PRDSection {
  id: string;
  number: string;
  title: string;
  shortDesc: string;
  iconName: string;
  subsections: {
    id: string;
    title: string;
    badge?: string;
  }[];
}

export interface UserPersona {
  role: string;
  profile: string;
  painPoints: string[];
  goals: string[];
  featuresUsed: string[];
}

export interface TechStackItem {
  layer: string;
  technology: string;
  role: string;
  justification: string;
}

export interface DatabaseModel {
  name: string;
  description: string;
  fields: {
    name: string;
    type: string;
    description: string;
    isPrimary?: boolean;
    isForeign?: boolean;
  }[];
}
