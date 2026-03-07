export interface Topic {
  id: string;
  title: string;
  description: string;
  lessons: number;
  icon: string;
  color: string;
}

export interface Note {
  id: string;
  topicId: string;
  title: string;
  content: string;
}

export interface Feature {
  id: string;
  title: string;
  description: string;
  points: string[];
  image: string;
  reverse?: boolean;
}

export interface Stat {
  id: string;
  value: string;
  label: string;
}

export interface NavLink {
  label: string;
  href: string;
}
