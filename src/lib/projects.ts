import ellipseCover from "@/assets/images/ellipse-cover.jpg";
import ellipse2 from "@/assets/images/ellipse2.jpg";
import ellipse3 from "@/assets/images/ellipse3.jpg";
import ellipse4 from "@/assets/images/ellipse4.jpg";
import ellipse5 from "@/assets/images/ellipse5.jpg";
import eco1 from "@/assets/images/ECO_COVER.jpg";
import eco2 from "@/assets/images/ECO_WEB.png";
import eco3 from "@/assets/images/ECO_PALETTE.png";
import eco4 from "@/assets/images/ECO_TEXT.jpg";
import eco5 from "@/assets/images/ECO_STORIES.jpg";
import eco6 from "@/assets/images/ECO_PHONE.jpg";
import eco7 from "@/assets/images/ECO_STILL.jpg";

import ctrl1 from "@/assets/images/ctrl_screenmock.jpg";
import ctrl2 from "@/assets/images/ctrl_text.jpg";
import ctrl3 from "@/assets/images/ctrl_disk.jpeg";
import ctrl4 from "@/assets/images/ctrl_phone2.jpg";
import ctrl5 from "@/assets/images/ctrl_phone.jpg";
import ctrl6 from "@/assets/images/ctrl_face.jpg";

import bxb1 from "@/assets/images/bxb_outdoor.jpg";
import bxb2 from "@/assets/images/bxb_type.jpg";
import bxb3 from "@/assets/images/bxb_closeup.jpg";
import bxb4 from "@/assets/images/bxb_pamphlet.jpg";
import bxb5 from "@/assets/images/bxb_infograph.jpg";
import bxb6 from "@/assets/images/bxb_brickposter.jpg";

import chimieCard from "@/assets/images/chimiecard.jpg";
import chimieWall from "@/assets/images/chimiewall.jpg";
import chimieWindow from "@/assets/images/chimiewindow.jpg";
import chimieCandid from "@/assets/images/chimiecandid.jpg";
import chimieCandid2 from "@/assets/images/chimie_candid2.jpg";
import chimieCandid3 from "@/assets/images/chimie_candid3.jpg";
import chimieCloseup from "@/assets/images/chimie_closeup.jpg";
import chimieColourRed from "@/assets/images/chimie_colourred.jpg";
import chimieComputer from "@/assets/images/chimie_computer.jpg";
import chimieNoseguide from "@/assets/images/chimie_noseguide.jpg";
import chimieType from "@/assets/images/chimie_type.jpg";
import chimiePalette from "@/assets/images/colorpalette.jpg";

export type MediaItem =
  | { kind: "image"; src: string; alt?: string }
  | { kind: "video"; muxPlaybackId: string; thumbnail?: string };

export type MediaRow = MediaItem | [MediaItem, MediaItem];

export const img = (src: string, alt?: string): MediaItem => ({
  kind: "image",
  src,
  alt,
});

export const video = (
  muxPlaybackId: string,
  thumbnail?: string,
): MediaItem => ({
  kind: "video",
  muxPlaybackId,
  thumbnail,
});

export interface ProjectLink {
  label: string;
  href: string;
}

export interface Project {
  id: string;
  index: string;
  client: string;
  description: string;
  services: string;
  team: string;
  date: string;
  image?: string;
  imageAlt?: string;
  muxPlaybackId?: string;
  thumbnail?: string;
  media: MediaRow[];
  credits?: string[];
  links?: ProjectLink[];
}

export const projects: Project[] = [
  {
    id: "bxb",
    index: "002",
    client: "Brique par brique",
    description:
      "Brique par Brique is a Parc-Extension organization building community housing and cultural infrastructure in Montréal. We developed the identity for their campaign to raise money for affordable housing and a new community centre.",
    services: "Identity, Campaign, Strategy, Art Direction",
    team: "Johnelle Smith, Rachel Seatvet",
    date: "2025",
    links: [
      { label: "Website", href: "https://briqueparbrique.com/" },
      {
        label: "Instagram",
        href: "https://www.instagram.com/briquexbrique/",
      },
    ],
    muxPlaybackId: "00f02eD6Vs5T023j702VlB02uJls43i94H166Gdjb02gSPlPs",
    thumbnail:
      "https://image.mux.com/00f02eD6Vs5T023j702VlB02uJls43i94H166Gdjb02gSPlPs/thumbnail.jpg",
    media: [
      video(
        "00f02eD6Vs5T023j702VlB02uJls43i94H166Gdjb02gSPlPs",
        "https://image.mux.com/00f02eD6Vs5T023j702VlB02uJls43i94H166Gdjb02gSPlPs/thumbnail.jpg",
      ),
      img(bxb1, "Brique par brique"),
      img(bxb2, "Brique par brique"),
      img(bxb3, "Brique par brique"),
      img(bxb4, "Brique par brique"),
      img(bxb5, "Brique par brique"),
      img(bxb6, "Brique par brique"),
    ],
  },
  {
    id: "ecozoic",
    index: "001",
    client: "Leadership for the Ecozoic",
    description:
      "Identity and website for Leadership for the Ecozoic, a transdisciplinary research initiative based at McGill University and the University of Vermont, working toward a just and ecologically sustainable future.",
    services: "Identity, Website, Art Direction",
    team: "Jean-Julien Hazoumé",
    date: "2025",
    image: eco1,
    imageAlt: "Ecozoic",
    media: [
      img(eco1, "Ecozoic"),
      video("Q3T81EFbujaCk3diwagRcviKFeYGFfYiYTY00VW01qJhQ"),

      [img(eco3, "Ecozoic"), img(eco4, "Ecozoic")],
      video("Tyn8xBzIFmBpgADOMhUMtpiXEet4eks9H4l02O98yMkA"),
      img(eco5, "Ecozoic"),
      [img(eco6, "Ecozoic"), img(eco7, "Ecozoic")],
      video("N00I4BmynmbwdiAgM9CMT2ytS01iZrMnBp6qqy112RZFM"),
    ],
    credits: ["Jean-Julien Hazoumé"],
    links: [
      { label: "Website", href: "https://l4ecozoic.org/" },
      {
        label: "Instagram",
        href: "https://www.instagram.com/leadershipfortheecozoic/",
      },
    ],
  },
  {
    id: "ctrl",
    index: "003",
    client: "CTRL+ALT",
    description:
      "CTRL+ALT is a Montréal festival dedicated to the Queer artists of the city's nightlife, spanning drag, burlesque, dance, and electronic music. We built their website to promote their 2025 edition of the festival.",
    services: "Website",
    team: "Johnelle Smith",
    date: "2025",
    links: [
      { label: "Website", href: "https://www.ctrlalt.ca/" },
      { label: "Instagram", href: "https://www.instagram.com/ctrlaltfest/" },
    ],
    image: ctrl1,
    credits: ["Johnelle Smith"],
    imageAlt: "CTRL+ALT thumbnail",
    media: [
      img(ctrl1, "CTRL+ALT"),
      [img(ctrl2, "CTRL+ALT"), img(ctrl3, "CTRL+ALT")],
      video(
        "QXAEfL5C1kCOERFnAJ3uuV9icuXqMuAsGoeocmZJrP00",
        "https://image.mux.com/QXAEfL5C1kCOERFnAJ3uuV9icuXqMuAsGoeocmZJrP00/thumbnail.jpg",
      ),
      [video("xlzsPwce01N00jVN998LnEtznrJLhfDc02GO01uPZc8TI9w"), img(ctrl4)],
      video(
        "SghV94zlZPzg01NIOw7P6hZU1r1Fi00AqxEuS3WwjSnqQ",
        "https://image.mux.com/SghV94zlZPzg01NIOw7P6hZU1r1Fi00AqxEuS3WwjSnqQ/thumbnail.jpg",
      ),
      video(
        "iBsrb101fH02BqhfO01e1qeMcOO9NOT6v1wX02v0201gXAxgk",
        "https://image.mux.com/iBsrb101fH02BqhfO01e1qeMcOO9NOT6v1wX02v0201gXAxgk/thumbnail.jpg",
      ),
      [img(ctrl5, "CTRL+ALT"), img(ctrl6, "CTRL+ALT")],
    ],
  },
  {
    id: "ellipse",
    index: "004",
    client: "Ellipse Magazine",
    description:
      "Established in 1969, ellipse is a magazine published twice yearly and presents the work of writers in English and French translation. After a brief hiatus, they contacted us to work on a redesign for the 90th issue.",
    services: "Editorial Design",
    team: "Luckensy Odigé",
    date: "2025",
    image: ellipseCover,
    imageAlt: "Ellipse cover",
    media: [
      img(ellipseCover, "Ellipse cover"),
      img(ellipse2),
      img(ellipse3),
      img(ellipse4),
      img(ellipse5),
    ],
    credits: ["Luckensy Odigé"],
    links: [
      { label: "Website", href: "https://ellipsemagazine.com/" },
      {
        label: "Instagram",
        href: "https://www.instagram.com/ellipse.mag/",
      },
    ],
  },
  {
    id: "chimie",
    index: "005",
    client: "Chimie",
    description:
      "chimie is a Montréal-based sensory project cultivating curiosity and connection around scent, through workshops, gatherings, and collaborations. We developed their branding, built their website, and shaped a community-minded social strategy.",
    services: "Identity, Social Strategy, Website, Art Direction",
    team: "Jean-Julien Hazoumé",
    credits: ["Jean-Julien Hazoumé"],
    links: [
      { label: "Website", href: "https://chimiescent.com/" },
      { label: "Instagram", href: "https://www.instagram.com/chimiescent/" },
    ],
    date: "2024",
    image: chimieWall,
    imageAlt: "CHIMIE thumbnail",
    media: [
      img(chimieWall),
      video(
        "9tk02Yy8QotdvvWcCfsqubod4Oal3ENViC01qO00J6YO6o",
        "https://image.mux.com/9tk02Yy8QotdvvWcCfsqubod4Oal3ENViC01qO00J6YO6o/thumbnail.jpg",
      ),
      [img(chimieType), img(chimieCard)],
      img(chimieWindow),
      img(chimiePalette),
      video(
        "37WQk2HUGJ3GW6hO2X1lRjYXTh8ZFHk7TaaylptVXuQ",
        "https://image.mux.com/37WQk2HUGJ3GW6hO2X1lRjYXTh8ZFHk7TaaylptVXuQ/thumbnail.jpg",
      ),
      [img(chimieCloseup), img(chimieColourRed)],
      img(chimieNoseguide),
      [img(chimieComputer), img(chimieCandid)],
      video(
        "IsJ00mXNIJkrA00uPN2xTvQMC00mTpiF6kNLZVmEDBMe9M",
        "https://image.mux.com/IsJ00mXNIJkrA00uPN2xTvQMC00mTpiF6kNLZVmEDBMe9M/thumbnail.jpg",
      ),
      [img(chimieCandid2), img(chimieCandid3)],
    ],
  },
];

// eco2 is imported but not currently referenced in media rows; reference
// it here so static analysis tracks the import.
void eco2;
