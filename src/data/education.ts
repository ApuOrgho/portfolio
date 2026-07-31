export interface EducationItem {
  id: string;
  school: string;
  url: string;
  image: string;
}

export const education: EducationItem[] = [
  {
    id: "aust",
    school: "Ahsanullah University of Science and Technology",
    url: "https://www.aust.edu/",
    image: "/images/education/aust.png",
  },
  {
    id: "ndc",
    school: "Notre Dame College",
    url: "https://ndc.edu.bd/",
    image: "/images/education/ndc.jpg",
  },
  {
    id: "jubilee",
    school: "K.L Jubilee High School",
    url: "https://en.m.wikipedia.org/wiki/K._L._Jubilee_High_School_%26_College",
    image: "/images/education/jubilee.jpg",
  },
];
