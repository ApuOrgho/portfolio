export interface SkillCategory {
  id: string;
  icon: string;
  items: string[];
}

export const skillCategories: SkillCategory[] = [
  {
    id: "languages",
    icon: "code",
    items: ["JavaScript", "TypeScript", "C++", "Python", "Java", "SQL"],
  },
  {
    id: "frontend",
    icon: "layout",
    items: ["React.js", "Next.js", "HTML5", "CSS3", "Tailwind CSS", "Redux"],
  },
  {
    id: "backend",
    icon: "server",
    items: ["Node.js", "Express.js", "REST APIs", "MongoDB", "MySQL", "Firebase"],
  },
  {
    id: "tools",
    icon: "wrench",
    items: ["Git & GitHub", "Docker", "Linux", "Postman", "VS Code", "CI/CD"],
  },
  {
    id: "cp",
    icon: "trophy",
    items: [
      "Data Structures",
      "Algorithms",
      "Competitive Programming",
      "Problem Setting",
    ],
  },
];
