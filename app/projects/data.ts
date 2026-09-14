export type Project = {
  slug: string;
  title: string;
  category: string;
  location: string;
  place: string;
  image: string;
  alt: string;
  detail: string;
  detailAlt: string;
  short: string;
  description: string;
  work: string;
  scope: string[];
  expertise?: string;
  visual?: boolean;
  year?: string;
};
export const projects: Project[] = [
  {
    slug: "rose-cottage",
    expertise: "/expertise/extensions-renovations",
    year: "2025",
    title: "Rose Cottage",
    category: "Residential renovation",
    location: "Hampshire",
    place: "Isington, Alton, Hampshire",
    image: "/images/rose-cottage.webp",
    alt: "Aerial view of Rose Cottage and its garden in Isington",
    detail: "/images/rose-detail.webp",
    detailAlt: "Rose Cottage’s white facade and garden seen from above",
    short: "A period home, thoughtfully renewed.",
    description:
      "A whole-home refurbishment of a period cottage near Alton, combining structural and waterproofing work with a renewed interior.",
    work: "The project extended through the kitchen, living room, bathroom, bedrooms and hallway. Each space was brought back into use with care for the character of the cottage.",
    scope: [
      "Whole-home renovation",
      "Structural & waterproofing works",
      "Interior refurbishment",
    ],
  },
  {
    slug: "guildford-quaker-meeting-house",
    expertise: "/heritage",
    year: "2025",
    title: "Guildford Quaker Meeting House",
    category: "Heritage & conservation",
    location: "Surrey",
    place: "Guildford, Surrey",
    image: "/images/guildford.webp",
    alt: "The historic exterior of Guildford Quaker Meeting House",
    detail: "/images/guildford-detail.webp",
    detailAlt: "Building detail at Guildford Quaker Meeting House",
    short: "Care for a Grade II listed community landmark.",
    description:
      "External conservation work to a Grade II listed meeting house in Guildford, protecting a historic building that remains in community use.",
    work: "The scope included sash window repairs, lime repointing, replacement of damaged brickwork and slate roof renovation. External decoration completed the work, with repairs chosen to suit the building’s historic materials.",
    scope: [
      "Sash window restoration",
      "Lime repointing & brickwork",
      "Slate roofing & decoration",
    ],
  },
  {
    slug: "the-old-thatch",
    expertise: "/heritage",
    title: "The Old Thatch",
    category: "Heritage & conservation",
    location: "Hampshire",
    place: "Hampshire",
    image: "/images/old-thatch-detail.webp",
    alt: "The thatched roof, flint and brick facade of The Old Thatch in Hampshire",
    detail: "/images/old-thatch.webp",
    detailAlt: "Close-up of traditional flint and brickwork at The Old Thatch",
    short: "Traditional materials. A sympathetic repair.",
    description:
      "Repairs to the flint panels of a thatched Hampshire property, addressing weathered flintwork and failing mortar.",
    work: "Flint was pieced back into the panels where needed and the joints repointed using a compatible lime mortar. The approach preserves the wall’s ability to breathe while retaining its distinctive texture and character.",
    scope: [
      "Flint panel repairs",
      "Traditional lime repointing",
      "Historic fabric retention",
    ],
  },
  {
    slug: "the-laurels",
    title: "The Laurels",
    category: "Residential renovation",
    location: "Hampshire",
    place: "Sherfield on Loddon, Hampshire",
    year: "2026",
    image: "/images/laurels.webp",
    alt: "Renovated interior at The Laurels",
    detail: "/images/laurels-detail.webp",
    detailAlt: "Kitchen and living spaces at The Laurels",
    short: "A family home opened up at its heart.",
    description:
      "Kitchen, dining and utility spaces brought together, with separate work to the snug in a Hampshire family home.",
    work: "A load-bearing wall was removed and a new structural opening formed with steel beams and padstones. The revised layout brought changes to heating, plumbing and electrics, followed by flooring, plasterwork, skirting and decoration.",
    scope: [
      "Structural opening & internal reconfiguration",
      "Underfloor heating & tiled flooring",
      "Services, plastering & decoration",
    ],
    expertise: "/expertise/extensions-renovations",
  },
  {
    slug: "elm-park-gardens",
    title: "Elm Park Gardens",
    category: "Residential renovation",
    location: "London",
    place: "Chelsea, London",
    year: "2026",
    image: "/images/elm-park.webp",
    alt: "Refined interior finishes at Elm Park Gardens",
    detail: "/images/elm-park-detail.webp",
    detailAlt: "Renovation details at Elm Park Gardens",
    short: "Renewed interiors in the heart of Chelsea.",
    description:
      "Renovation of a Chelsea basement flat, with internal and external finishing work and changes to the layout.",
    work: "Walls, ceilings and existing woodwork were prepared and decorated using Farrow & Ball finishes. Selected door openings were reworked, while exterior masonry decoration and new timber panelling formed part of the external scope.",
    scope: [
      "Interior preparation & decoration",
      "Layout alterations & making good",
      "Exterior finishes & timber panelling",
    ],
    expertise: "/expertise/extensions-renovations",
  },
  {
    slug: "winters-hill",
    title: "Winter’s Hill Eco House",
    category: "New home",
    location: "Hampshire",
    place: "Sherfield on Loddon, Hampshire",
    year: "2026",
    visual: true,
    image: "/images/winters-hill-visual.webp",
    alt: "Kitchen design visual for Winter’s Hill Eco House, not a photograph of the completed building",
    detail: "/images/winters-hill-detail-visual.webp",
    detailAlt: "Kitchen layout drawing for Winter’s Hill Eco House",
    short: "A new home, from structure to final finishes.",
    description:
      "A new-build eco house delivered as principal contractor from a bare site over a published nine-month programme.",
    work: "Buildtonic’s published project covers structure, roof and cladding, mechanical and electrical work, joinery, plastering and finishing. The available imagery shows kitchen and bathroom design visuals; finished-build photographs have not been published with this case study.",
    scope: [
      "Principal contractor delivery",
      "Structure, roof & cladding",
      "Services, joinery & finishes",
    ],
    expertise: "/expertise/new-homes",
  },
];
