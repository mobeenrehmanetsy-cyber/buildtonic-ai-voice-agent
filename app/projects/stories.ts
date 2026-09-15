export type Story = {
  heading: string;
  detail: string;
  note?: string;
  quote?: string;
  gallery: { file: string; caption: string }[];
  media?: { title: string; href: string }[];
};
export const stories: Record<string, Story> = {
  "rose-cottage": {
    heading: "From fabric to finish.",
    detail:
      "Structural and waterproofing works formed part of a refurbishment reaching through the whole cottage. The kitchen, lounge, bathroom, bedrooms and hall were renewed with the original building’s character in mind.",
    gallery: [
      { file: "g2.jpg", caption: "The cottage and garden, seen from above" },
      {
        file: "g3.jpg",
        caption:
          "A closer view of the cottage and adjoining single-storey space",
      },
      { file: "g4.jpg", caption: "The renewed living room" },
      { file: "g5.jpg", caption: "The kitchen, looking through from the hall" },
    ],
    media: [
      {
        title: "Client testimonial · Ben Rivera (YouTube)",
        href: "https://www.youtube.com/watch?v=e38d-HDWi7Y",
      },
      {
        title: "Before · published project reel (Instagram)",
        href: "https://www.instagram.com/reel/DUjeKVJDJcO/",
      },
      {
        title: "After · published project post (Instagram)",
        href: "https://www.instagram.com/p/DPWklRoDI6y/",
      },
    ],
  },
  "guildford-quaker-meeting-house": {
    heading: "Repair, with respect.",
    detail:
      "Lime mortar and carefully repaired sash windows were central to the external conservation work. Damaged bricks were replaced and the slate roof renovated; sticking internal doors were also rehung. The material choices responded to the status and history of this Grade II listed building.",
    quote: "We recommend Buildtonic and would employ them again.",
    note: "Client review via Checkatrade, reproduced on Buildtonic’s project page.",
    gallery: [
      {
        file: "g1.jpg",
        caption: "Arched sash windows and the brick elevation",
      },
      {
        file: "g2.jpg",
        caption: "Window and brickwork details around the courtyard",
      },
      {
        file: "g3.jpg",
        caption: "Slate roof and sash window on a lower elevation",
      },
    ],
  },
  "the-old-thatch": {
    heading: "A repair that belongs.",
    detail:
      "The existing flint had weathered and the joints had deteriorated. Replacement flint was pieced into the panels where needed. A compatible lime mortar allows the wall to breathe, protecting the surrounding fabric as well as retaining its texture.",
    gallery: [
      {
        file: "cover.jpg",
        caption:
          "The flint panels and brick borders at the centre of the repair work",
      },
    ],
    media: [
      {
        title: "Client testimonial (YouTube)",
        href: "https://www.youtube.com/watch?v=Ua2ZZQmmytw",
      },
    ],
  },
  "the-laurels": {
    heading: "The detail beneath the surface.",
    detail:
      "Steel beams and padstones enabled the new opening. Below the tiled floor, underfloor heating was laid over latex screed with Schlüter detailing. Reconfigured plumbing and upgraded electrics served the new layout; plasterwork, ogee skirting and decoration brought the rooms together.",
    note: "In collaboration with Tom Howley, as credited in Buildtonic’s published project.",
    gallery: [
      { file: "g1.jpg", caption: "A view through the newly connected spaces" },
      { file: "g2.jpg", caption: "Kitchen cabinetry and pendant lighting" },
      {
        file: "g3.jpg",
        caption: "The breakfast space and its relationship to the kitchen",
      },
      {
        file: "g4.jpg",
        caption: "Tiled flooring, panelling and the breakfast bar",
      },
      { file: "g5.jpg", caption: "Dining and kitchen spaces brought together" },
      {
        file: "cover.jpg",
        caption: "A closer look at the interior finishing details",
      },
    ],
    media: [
      {
        title: "Project walkthrough (Instagram)",
        href: "https://www.instagram.com/p/DZC4G7lDCGy/",
      },
      {
        title: "Further project footage (Instagram)",
        href: "https://www.instagram.com/p/DYU_XMEMqSC/",
      },
    ],
  },
  "elm-park-gardens": {
    heading: "A continuous finish.",
    detail:
      "Careful preparation brought walls, ceilings and existing woodwork together in Farrow & Ball finishes. Selected doors and frames were removed to open up the layout. Outside, masonry was redecorated and new timber panelling installed and painted.",
    gallery: [
      { file: "g1.jpg", caption: "Bedroom finishes and fitted joinery" },
      {
        file: "g2.jpg",
        caption: "Bedroom walls, lighting and the route through the flat",
      },
      {
        file: "g3.jpg",
        caption: "Interior circulation and decorative wall details",
      },
      { file: "g4.jpg", caption: "Hallway lighting and floor finishes" },
    ],
  },
  "winters-hill": {
    heading: "One contractor. The whole build.",
    detail:
      "From a bare site, Buildtonic acted as principal contractor across a published nine-month programme. The scope brought together structure, roofing, cladding, mechanical and electrical work, joinery, plastering and final finishes.",
    note: "The published project describes delivery of the home. The available images are design material, not evidence of the completed construction.",
    gallery: [
      {
        file: "g3.jpg",
        caption: "Bathroom design visual · basin and material palette",
      },
      {
        file: "g4.jpg",
        caption: "Bathroom design visual · bath and shower arrangement",
      },
      { file: "g1.png", caption: "Bathroom layout drawing · design material" },
      {
        file: "g2.png",
        caption: "Bathroom layout drawing · alternative room arrangement",
      },
    ],
  },
};
