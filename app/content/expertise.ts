export type Expertise = {
  slug: string;
  title: string;
  eyebrow: string;
  intro: string;
  image: string;
  imageAlt: string;
  imageCaption: string;
  sections: { id: string; title: string; text: string }[];
  preparation: string[];
  projectSlugs: string[];
};

export const expertise: Expertise[] = [
  {
    slug: "new-homes",
    title: "A new home. A considered beginning.",
    eyebrow: "New homes",
    intro:
      "Individual homes, replacement dwellings and garden annexes. Buildtonic delivers residential construction as principal contractor, from a bare site to the finishing details.",
    image: "/images/projects/winters-hill-cover.jpg",
    imageAlt: "Kitchen design visual for Winter’s Hill Eco House",
    imageCaption:
      "Winter’s Hill Eco House — design visual, not finished-build photography",
    sections: [
      {
        id: "delivery",
        title: "One team across the build",
        text: "Groundworks, drainage and foundations lead into structure, roofing and a weathertight shell. Heating, plumbing, electrics and ventilation are coordinated with joinery and finishes.",
      },
      {
        id: "design",
        title: "Working with your design team",
        text: "We build from architects’ and structural engineers’ drawings. If your design team is not yet in place, we can discuss introductions and the information needed to develop your brief.",
      },
      {
        id: "details",
        title: "Beyond the structure",
        text: "Kitchens, doors, stairs and decoration sit alongside external works such as drives, patios, fencing and landscaping. Scope and specification are established for your individual project.",
      },
    ],
    preparation: [
      "Site location and access",
      "Drawings and design-team details, if available",
      "Your priorities, intended timescale and current planning stage",
    ],
    projectSlugs: ["winters-hill"],
  },
  {
    slug: "extensions-renovations",
    title: "More from the home you have.",
    eyebrow: "Extensions & renovations",
    intro:
      "Create space, rework a layout or renew a whole property. Buildtonic combines structural alterations with the finishing work that makes the new and existing parts feel at home together.",
    image: "/images/projects/the-laurels-g6.jpg",
    imageAlt: "Renovated living space at The Laurels",
    imageCaption: "The Laurels, Hampshire — residential renovation",
    sections: [
      {
        id: "extensions",
        title: "Extensions & alterations",
        text: "Single and double-storey extensions, rear and side additions, kitchen extensions and internal reconfiguration. Structural openings, steelwork and finishes are coordinated as part of the agreed scope.",
      },
      {
        id: "renovation",
        title: "Renovation & refurbishment",
        text: "Whole-house or room-by-room work, including kitchens, bathrooms, flooring, plastering and decoration. Renovation can also address waterproofing, tired services and defects identified during assessment.",
      },
      {
        id: "comfort",
        title: "A comfortable, coherent home",
        text: "Heating, electrics, lighting and joinery are planned around the revised layout. Underfloor heating is among the capabilities offered, with the specification considered for the building.",
      },
      {
        id: "period",
        title: "An older home needs its own approach",
        text: "Period and listed properties may need different materials and consent coordination. Our heritage expertise informs repairs and alterations where original character matters.",
      },
    ],
    preparation: [
      "Which rooms or parts of the building you want to change",
      "Existing plans and photographs",
      "Whether you hope to stay in the property during the work",
    ],
    projectSlugs: ["the-laurels", "rose-cottage", "elm-park-gardens"],
  },
  {
    slug: "consent",
    title: "A clear brief for a sensitive building.",
    eyebrow: "Listed Building Consent coordination",
    intro:
      "Support with the information, methods and conversations behind a listed-building project. Buildtonic coordinates the construction brief with architects, heritage consultants and conservation officers.",
    image: "/images/projects/guildford-quaker-meeting-house-cover.jpg",
    imageAlt: "Historic sash windows at Guildford Quaker Meeting House",
    imageCaption:
      "Guildford Quaker Meeting House — Grade II listed conservation work",
    sections: [
      {
        id: "information",
        title: "Information that respects the building",
        text: "Application support, method statements and heritage coordination help describe the proposed works and the way sensitive repairs will be carried out.",
      },
      {
        id: "liaison",
        title: "Coordination alongside the build",
        text: "We work with your professional team and the local authority to align proposed materials, detailing and construction methods with the project’s consent requirements.",
      },
      {
        id: "decisions",
        title: "Check the requirements early",
        text: "The permissions needed depend on the building and proposed work. Confirm them with the local planning authority and your appointed advisers before starting. Coordination does not guarantee consent or an approval date.",
      },
    ],
    preparation: [
      "Property address and any listing information",
      "A description of proposed changes, including internal work",
      "Existing drawings, advice or correspondence from your professional team",
    ],
    projectSlugs: ["guildford-quaker-meeting-house", "the-old-thatch"],
  },
  {
    slug: "surveys",
    title: "Understand the building before the next step.",
    eyebrow: "Surveys & building concerns",
    intro:
      "Contractor-led assessments for owners and prospective buyers. Buildtonic’s survey services help establish the condition of a property and the work that may need attention.",
    image: "/images/projects/rose-cottage-g2.jpg",
    imageAlt: "Aerial view of the roof and exterior of Rose Cottage",
    imageCaption: "Rose Cottage, Hampshire — project photography",
    sections: [
      {
        id: "condition",
        title: "Condition surveys & reports",
        text: "Assessment of fabric, visible structure, roofs, moisture and defects, with a photographed, prioritised report. Where formal chartered or structural input is required, the scope can involve RICS surveyors and chartered structural engineers.",
      },
      {
        id: "pre-purchase",
        title: "Pre-purchase surveys",
        text: "A practical view of a property before purchase, including condition and issues that may affect the work or budget ahead. Access, scope and the type of report required should be discussed first.",
      },
      {
        id: "defects",
        title: "Defect & damp investigation",
        text: "Investigation of damp, decay, cracking or movement, with the building’s construction and moisture behaviour considered before recommending repairs. A website conversation cannot establish a structural diagnosis.",
      },
      {
        id: "drone",
        title: "Drone surveys",
        text: "Aerial inspection of roofs, chimneys and high-level fabric can provide images of otherwise difficult-to-reach areas. The suitable inspection method depends on access, the site and the questions being investigated.",
      },
    ],
    preparation: [
      "Address, building type and approximate age",
      "What concerns you, where it appears and when you noticed it",
      "The purpose of the report and any access arrangements",
    ],
    projectSlugs: ["rose-cottage", "guildford-quaker-meeting-house"],
  },
];

export const heritageSpecialisms = [
  {
    id: "lime",
    title: "Lime plaster, render & pointing",
    text: "Lime-based finishes and mortars can help traditional walls manage moisture. Mixes and aggregates are selected for the existing fabric, whether the work is internal plaster, external render or repointing.",
  },
  {
    id: "limecrete",
    title: "Limecrete & breathable floors",
    text: "Limecrete floor systems offer a breathable approach for appropriate period properties. The build-up can incorporate insulation and underfloor heating, with finishes considered as part of the whole specification.",
  },
  {
    id: "conservation",
    title: "Listed building & conservation repairs",
    text: "Retain sound historic material and repair where possible. Timber, brick, flint and stone work can involve piecing-in, matched replacements and compatible mortar rather than wholesale renewal.",
  },
  {
    id: "timber",
    title: "Historic timber treatment & repair",
    text: "Assessment of rot, insect damage and moisture sources, followed by appropriate treatment or repairs. Splicing and localised renewal can preserve original joinery and structural timber where suitable.",
  },
  {
    id: "structure",
    title: "Structural repairs",
    text: "Work can include masonry crack repairs, beams and lintels, foundation strengthening and temporary support. Significant structural work is coordinated with structural engineers and their design.",
  },
  {
    id: "consent",
    title: "Conservation detailing & consent",
    text: "Repair methods, materials and detailing should be considered together. Consent coordination helps connect the proposed work with the advice of architects, heritage consultants and conservation officers.",
  },
];
