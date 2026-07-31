export interface ExperienceItem {
  id: string;
  org: string;
  url?: string;
  start: string;
  end: string | null;
  current: boolean;
}

export const experience: ExperienceItem[] = [
  {
    id: "cefalo",
    org: "Cefalo Bangladesh Ltd.",
    url: "https://cefalo.com/",
    start: "2025-07",
    end: null,
    current: true,
  },
  {
    id: "vp",
    org: "AUST Programming and Informatics Club (AUSTPIC)",
    url: "https://www.facebook.com/austpic",
    start: "2024-12",
    end: "2025-06",
    current: false,
  },
  {
    id: "trainer",
    org: "AUST ACM Lab 2",
    start: "2023-09",
    end: "2025-06",
    current: false,
  },
];
