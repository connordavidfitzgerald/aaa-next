import jj from "@/assets/images/jj.jpg";
import luckensy from "@/assets/images/luckensy.jpg";
import jordane from "@/assets/images/jordane.jpg";
import johnelle from "@/assets/images/johnelle.jpg";
import reatchy from "@/assets/images/reatchy.jpg";

export interface TeamMember {
  key: string;
  slug: string;
  name: string;
  role: string;
  services: string[];
  location: string;
  image: string;
  bio: string;
  instagram: string;
  linkedin: string;
  projectIds: string[];
}

export const core: TeamMember[] = [
  {
    key: "jj",
    slug: "jean-julien",
    name: "Jean-Julien Hazoumé",
    role: "Creative Direction, Design & Development",
    services: [
      "Creative Direction",
      "Art Direction",
      "Graphic Design",
      "Identity",
      "UI/UX Design",
      "Web Development",
    ],
    location: "Montréal, QC",
    image: jj,
    bio: "Jean-Julien Hazoumé is a creative director, designer, and founder of Applied Archive Atelier. Building the studio around the idea that who you work with matters as much as what you make, Jean-Julien propels each mission toward the form that amplifies it best – from websites to objects.",
    instagram: "https://instagram.com",
    linkedin: "https://linkedin.com",
    projectIds: ["chimie", "ecozoic"],
  },
  {
    key: "luckensy",
    slug: "luckensy",
    name: "Luckensy Odigé",
    role: "Graphic Design, Illustration, Photography",
    services: [
      "Creative Direction",
      "Art Direction",
      "Graphic Design",
      "Identity",
      "Illustration",
      "Photography",
    ],
    location: "Montréal, QC",
    image: luckensy,
    bio: "Luckensy Odigé watches over the identity of a mission – poster, report, campaign, image – so it stays legible from one culture to the next.",
    instagram: "https://instagram.com",
    linkedin: "https://linkedin.com",
    projectIds: ["ellipse"],
  },
  {
    key: "jordane",
    slug: "jordane",
    name: "Jordane Kaluma",
    role: "Semiotics, Creative Strategy, Funding",
    services: ["Semiotics", "Creative Strategy", "Funding"],
    location: "Montréal, QC",
    image: jordane,
    bio: "Jordane Kaluma reads the cultural signals beneath a project and turns them into positioning, language, and the funding that keeps a mission alive.",
    instagram: "https://instagram.com",
    linkedin: "https://linkedin.com",
    projectIds: [],
  },
  {
    key: "johnelle",
    slug: "johnelle",
    name: "Johnelle Smith",
    role: "Graphic and Experiential Design",
    services: ["Graphic Design", "Experiential Design"],
    location: "Montréal, QC",
    image: johnelle,
    bio: "Johnelle Smith treats design as cultural infrastructure – identities and spaces that make room for the artists, organizers, and institutions shaping cultural life.",
    instagram: "https://instagram.com",
    linkedin: "https://linkedin.com",
    projectIds: ["bxb", "ctrl"],
  },
  {
    key: "reatchy",
    slug: "reatchy",
    name: "Reatchy Legros",
    role: "Direction & Video",
    services: ["Direction", "Video Production"],
    location: "Montréal, QC",
    image: reatchy,
    bio: "Reatchy Legros, direction and video. Directs and edits films that carry a point of view, from shoot to final cut – to mirror, question, and enchant the real.",
    instagram: "https://instagram.com",
    linkedin: "https://linkedin.com",
    projectIds: [],
  },
];

export const collaborators: TeamMember[] = [
  {
    key: "christianA",
    slug: "christian-alkeboulan",
    name: "Christian Alkeboulan",
    role: "Photography",
    services: ["Photography"],
    location: "Montréal, QC",
    image: "",
    bio: "",
    instagram: "https://instagram.com",
    linkedin: "https://linkedin.com",
    projectIds: ["chimie", "ecozoic"],
  },
  {
    key: "connorf",
    slug: "connor-fitzgerald",
    name: "Connor Fitzgerald",
    role: "Design, Web Development",
    services: [
      "Creative Direction",
      "Identity",
      "Graphic Design",
      "Web Development",
    ],
    location: "Montréal, QC",
    image: "",
    bio: "",
    instagram: "https://instagram.com",
    linkedin: "https://linkedin.com",
    projectIds: ["ecozoic", "chimie"],
  },
  {
    key: "fotar",
    slug: "fotar-tunteng",
    name: "Fotar Tunteng",
    role: "Web Development",
    services: ["Web Development", "UI/UX", "Creative Coding"],
    location: "Montréal, QC",
    image: "",
    bio: "Jordane Kaluma reads the cultural signals beneath a project and turns them into positioning, language, and the funding that keeps a mission alive.",
    instagram: "https://instagram.com",
    linkedin: "https://linkedin.com",
    projectIds: [],
  },
  {
    key: "gabriel",
    slug: "gabriel-cance",
    name: "Gabriel Cance",
    role: "Creative Mentor, Design",
    services: [
      "Graphic Design",
      "Identity",
      "Art Direction",
      "Creative Direction",
    ],
    location: "Montréal, QC",
    image: "",
    bio: "Johnelle Smith treats design as cultural infrastructure – identities and spaces that make room for the artists, organizers, and institutions shaping cultural life.",
    instagram: "https://instagram.com",
    linkedin: "https://linkedin.com",
    projectIds: ["bxb", "ctrl"],
  },
  {
    key: "nadjee-cadet",
    slug: "nadjee",
    name: "Nadjee Cadet",
    role: "Motion Design",
    services: ["Motion Design", "Video Production", "Photography"],
    location: "Montréal, QC",
    image: "",
    bio: "Reatchy Legros, direction and video. Directs and edits films that carry a point of view, from shoot to final cut – to mirror, question, and enchant the real.",
    instagram: "https://instagram.com",
    linkedin: "https://linkedin.com",
    projectIds: [],
  },
  {
    key: "rama",
    slug: "rama-sow",
    name: "Rama Sow",
    role: "Creative Mentor, Amplification",
    services: ["Amplification Strategy", "Creative Direction"],
    location: "Montréal, QC",
    image: "",
    bio: "Reatchy Legros, direction and video. Directs and edits films that carry a point of view, from shoot to final cut – to mirror, question, and enchant the real.",
    instagram: "https://instagram.com",
    linkedin: "https://linkedin.com",
    projectIds: [],
  },
  {
    key: "rama",
    slug: "rama-sow",
    name: "Rama Sow",
    role: "Creative Mentor, Amplification",
    services: ["Amplification Strategy", "Creative Direction"],
    location: "Montréal, QC",
    image: "",
    bio: "Reatchy Legros, direction and video. Directs and edits films that carry a point of view, from shoot to final cut – to mirror, question, and enchant the real.",
    instagram: "https://instagram.com",
    linkedin: "https://linkedin.com",
    projectIds: [],
  },
];

// Resolve a display name (e.g. a project's team/credit entry) to a member slug,
// or undefined when the name isn't one of our members (external collaborators).
const allMembers = [...core, ...collaborators];

export function memberSlugByName(name: string): string | undefined {
  const trimmed = name.trim();
  return allMembers.find((m) => m.name === trimmed)?.slug;
}

// Look up a member (core or collaborator) by their URL slug.
export function getMemberBySlug(slug: string): TeamMember | undefined {
  return allMembers.find((m) => m.slug === slug);
}
