export interface ContestEntry {
  serial: number;
  team: string;
  contest: string;
  date: string;
  rank: number;
}

export const contests: ContestEntry[] = [
  { serial: 1, team: "AUST_CrackPlatoon", contest: "2022 ICPC Asia Dhaka Regional Contest hosted by Green University of Bangladesh", date: "2023-03-11", rank: 33 },
  { serial: 2, team: "AUST_CrackPlatoon", contest: "ICPC Asia West Continent Final Contest 2022", date: "2023-05-20", rank: 51 },
  { serial: 3, team: "AUST_Badamtola!", contest: "BUET Inter University Programming Contest 2023", date: "2023-07-28", rank: 86 },
  { serial: 4, team: "AUST_RedX", contest: "CoU-BRACNet Inter University Programming Contest 2023", date: "2023-09-16", rank: 20 },
  { serial: 5, team: "AUST_Shunno7", contest: "ICPC Dhaka Regional Site 2023 hosted by BUBT", date: "2023-11-04", rank: 56 },
  { serial: 6, team: "AUST_Shunno7", contest: "CUET IUPC CodeStorm 1.0", date: "2024-01-26", rank: 38 },
  { serial: 7, team: "AUST_Shunno7", contest: "UAP Inter University Collaborative Programming Contest 1.0 (Senior)", date: "2024-01-28", rank: 31 },
  { serial: 8, team: "AUST_Shunno7", contest: "SUST CSE Carnival 2024 IUPC", date: "2024-02-18", rank: 101 },
  { serial: 9, team: "AUST_Shunno7", contest: "NCPC Onsite 2023 hosted by JU", date: "2024-03-09", rank: 34 },
  { serial: 10, team: "AUST_Shunno7", contest: "IUT 11th National ICT Fest Programming Contest 2024", date: "2024-04-27", rank: 34 },
  { serial: 11, team: "AUST_HonorRedX", contest: "ICPC Asia Dhaka Regional Contest 2024 Onsite Round hosted by DIU", date: "2024-07-12", rank: 235 },
  { serial: 12, team: "AUST_HonorRedX", contest: "BUET Inter University Programming Contest 2024", date: "2024-11-01", rank: 60 },
  { serial: 13, team: "Aust_Shunno7", contest: "KUET Inter University Programming Contest 2025", date: "2025-01-04", rank: 70 },
  { serial: 14, team: "AUST_Shunno7", contest: "UIU Inter University Programming Contest 2025", date: "2025-01-18", rank: 75 },
  { serial: 15, team: "AUST_Simplexity", contest: "AUST Inter University Programming Contest 2025", date: "2025-02-22", rank: 54 },
  { serial: 16, team: "AUST_Simplexity", contest: "DUET Inter University Programming Contest 2025", date: "2025-05-10", rank: 22 },
  { serial: 17, team: "AUST_Simplexity", contest: "UU Inter University Programming Contest 2025", date: "2025-06-21", rank: 31 },
  { serial: 18, team: "AUST_Simplexity", contest: "MU Inter University Programming Contest 2025", date: "2025-11-22", rank: 72 },
  { serial: 19, team: "AUST_Simplexity", contest: "BUBT Inter University Collaborative Programming Contest 2025", date: "2025-11-29", rank: 2 },
  { serial: 20, team: "AUST_Simplexity", contest: "CUET Inter University Programming Contest 2025", date: "2025-12-13", rank: 11 },
  { serial: 21, team: "AUST_Simplexity", contest: "ICPC Dhaka Regional Site 2025 Onsite hosted by BUBT", date: "2025-12-21", rank: 28 },
  { serial: 22, team: "AUST_Simplexity", contest: "BUET Inter University Programming Contest 2026", date: "2026-02-05", rank: 47 },
  { serial: 23, team: "AUST_Simplexity", contest: "ICPC Asia West Continent Championship 2026", date: "2026-03-08", rank: 48 },
  { serial: 24, team: "AUST_Simplexity", contest: "NDUB Inter University Programming Contest 2026", date: "2026-05-16", rank: 44 },
  { serial: 25, team: "AUST_Simplexity", contest: "NSU Inter University Programming Contest 2026", date: "2026-06-12", rank: 21 },
  { serial: 26, team: "AUST_Simplexity", contest: "DUET Inter University Programming Contest 2026", date: "2026-06-27", rank: 21 },
  { serial: 27, team: "AUST_Simplexity", contest: "SUST Inter University Programming Contest 2026", date: "2026-07-12", rank: 22 },
  { serial: 28, team: "AUST_Simplexity", contest: "IUT Inter University Programming Contest 2026", date: "2026-07-25", rank: 21 },
];

export const contestStats = {
  total: contests.length,
  bestRank: Math.min(...contests.map((c) => c.rank)),
  teams: Array.from(new Set(contests.map((c) => c.team))).length,
};
