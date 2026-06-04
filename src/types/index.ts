export interface Speaker {
  name: string;
  role: string;
  org: string;
  presentation?: string;
  image?: string;
}

export interface SDG {
  number: number;
  label: string;
}

export interface Workshop {
  slug: string;
  title: string;
  subtitle?: string;
  tag: string;
  date: string;
  time: string;
  location: string;
  summary: string;
  highlights: string;
  takeaways: string[];
  participants: number | string;
  speakers: Speaker[];
  gallery: string[];
  sdgs: SDG[];
  badge?: string;
}

export interface Faculty {
  name: string;
  role: string;
  department: string;
  campus: string;
  image: string;
  link: string;
}

export interface Student {
  name: string;
  role: string;
  class: string;
  image?: string;
  github?: string;
  linkedin?: string;
  isCoordinator?: boolean;
}

export interface GalleryItem {
  src: string;
  alt: string;
  id: string;
}
