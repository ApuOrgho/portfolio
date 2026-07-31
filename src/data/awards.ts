export interface AwardItem {
  id: string;
  image: string;
  year: string;
}

export const awards: AwardItem[] = [
  { id: "biucpc", image: "/images/awards/biucpc.jpg", year: "2025" },
  { id: "vcCrest", image: "/images/awards/vc-crest.jpg", year: "2025" },
  { id: "iapcSpring23", image: "/images/awards/iapc_spring23.jpg", year: "2023" },
  { id: "iapcFall22Austpic", image: "/images/awards/iapc_fall22_austpic.jpg", year: "2022" },
  { id: "iapcFall22", image: "/images/awards/iapc_fall22.jpg", year: "2022" },
  { id: "problemSetter", image: "/images/awards/problem_setter_iapc_fall_23.jpg", year: "2023" },
];
