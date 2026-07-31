export interface ProjectItem {
  id: string;
  image: string;
  tech: string[];
  repo?: string;
  demo?: string;
  video?: string;
  featured?: boolean;
}

export const projects: ProjectItem[] = [
  {
    id: "cpStandings",
    image: "/images/projects/aust-cp-standings.jpg",
    tech: ["Next.js", "TypeScript", "Tailwind CSS", "Vercel Cron"],
    repo: "https://github.com/ApuOrgho/aust-cp-standings-frontend",
    demo: "https://cp-standings.apuorgho.com",
    featured: true,
  },
  {
    id: "portfolio",
    image: "/images/projects/portfolio.jpg",
    tech: ["Next.js", "TypeScript", "Three.js", "Tailwind CSS", "next-intl"],
    repo: "https://github.com/ApuOrgho/portfolio",
    demo: "https://apuorgho.com",
    featured: true,
  },
  {
    id: "digicure",
    image: "/images/projects/digicure.png",
    tech: ["Java", "Android Studio", "Firebase"],
    video: "/videos/digicure.mp4",
  },
  {
    id: "missionCs",
    image: "/images/projects/mission-cs.jpg",
    tech: ["C++", "iGraphics"],
    video: "/videos/mission_cs.mp4",
  },
  {
    id: "banking",
    image: "/images/projects/bank-management.jpg",
    tech: ["Java", "NetBeans", "MySQL"],
    video: "/videos/banking_management.mp4",
  },
];
