import type { StaticImageData } from "next/image";

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
    location: string;
    image: StaticImageData;
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
        role: "Co-Founder, Designer",
        location: "Montréal, QC",
        image: jj,
        bio: "Jean-Julien Hazoumé, creative direction, design & development. Propels each mission toward the form that amplifies it – from a no-code site to an object",
        instagram: "https://instagram.com",
        linkedin: "https://linkedin.com",
        projectIds: ["chimie", "ecozoic"],
    },
    {
        key: "luckensy",
        slug: "luckensy",
        name: "Luckensy Odigé",
        role: "Co-Founder, Designer",
        location: "Montréal, QC",
        image: luckensy,
        bio: "Luckensy Odigé, graphic design, illustration, photography. Watches over the identity of a mission – poster, report, campaign, image – so it stays legible from one culture to the next.",
        instagram: "https://instagram.com",
        linkedin: "https://linkedin.com",
        projectIds: ["ellipse"],
    },
    {
        key: "jordane",
        slug: "jordane",
        name: "Jordane Kaluma",
        role: "Co-Founder, Copywriter",
        location: "Montréal, QC",
        image: jordane,
        bio: "Jordane Kaluma, semiotics, creative strategy, funding. Reads the cultural signals beneath a project and turns them into positioning, language, and the funding that keeps a mission alive.",
        instagram: "https://instagram.com",
        linkedin: "https://linkedin.com",
        projectIds: [],
    },
    {
        key: "johnelle",
        slug: "johnelle",
        name: "Johnelle Smith",
        role: "Co-Founder, Designer",
        location: "Montréal, QC",
        image: johnelle,
        bio: "Johnelle Smith, graphic and experiential design. Treats design as cultural infrastructure – identities and spaces that make room for the artists, organizers, and institutions shaping cultural life.",
        instagram: "https://instagram.com",
        linkedin: "https://linkedin.com",
        projectIds: ["bxb", "ctrl"],
    },
    {
        key: "reatchy",
        slug: "reatchy",
        name: "Reatchy Legros",
        role: "Co-Founder, Photographer",
        location: "Montréal, QC",
        image: reatchy,
        bio: "Reatchy Legros, direction and video. Directs and edits films that carry a point of view, from shoot to final cut – to mirror, question, and enchant the real.",
        instagram: "https://instagram.com",
        linkedin: "https://linkedin.com",
        projectIds: [],
    },
];

export const collaborators: TeamMember[] = core;
