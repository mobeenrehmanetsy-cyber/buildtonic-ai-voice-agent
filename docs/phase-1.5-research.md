# Phase 1.5 ? source and media audit

Reviewed 15 September 2026. All six original project pages and their image tags, embedded players and social links were revisited. The original site is a factual and asset reference, not a design template.

## Original image recovery

The Astro transformation filenames led to publicly served source files. Each recovered response was checked for successful image content, decoded with Sharp to confirm intrinsic dimensions, and copied byte-for-byte. No upscaling, sharpening or recompression was performed on local originals. Next Image creates responsive delivery variants at runtime. Existing watermarks remain intact.

| Project | Local original | Dimensions | Public source |
|---|---|---|---|
| rose-cottage | /images/projects/rose-cottage-cover.jpg | 2336 ? 1744 | [Original](https://buildtonic.co.uk/_astro/cover.DnEDestF.jpg) |
| rose-cottage | /images/projects/rose-cottage-g2.jpg | 4000 ? 3000 | [Original](https://buildtonic.co.uk/_astro/g2.oKJZO6lP.jpg) |
| rose-cottage | /images/projects/rose-cottage-g3.jpg | 4000 ? 3000 | [Original](https://buildtonic.co.uk/_astro/g3.CPZIOpde.jpg) |
| rose-cottage | /images/projects/rose-cottage-g4.jpg | 3840 ? 2160 | [Original](https://buildtonic.co.uk/_astro/g4.D9CX9VSG.jpg) |
| rose-cottage | /images/projects/rose-cottage-g5.jpg | 3840 ? 2160 | [Original](https://buildtonic.co.uk/_astro/g5.BcK6uPOv.jpg) |
| guildford-quaker-meeting-house | /images/projects/guildford-quaker-meeting-house-cover.jpg | 1152 ? 1536 | [Original](https://buildtonic.co.uk/_astro/cover.D-wUuZhB.jpg) |
| guildford-quaker-meeting-house | /images/projects/guildford-quaker-meeting-house-g1.jpg | 1152 ? 1536 | [Original](https://buildtonic.co.uk/_astro/g1.DaS-Bkaz.jpg) |
| guildford-quaker-meeting-house | /images/projects/guildford-quaker-meeting-house-g2.jpg | 1152 ? 1536 | [Original](https://buildtonic.co.uk/_astro/g2.nDJ2hcVj.jpg) |
| guildford-quaker-meeting-house | /images/projects/guildford-quaker-meeting-house-g3.jpg | 768 ? 1024 | [Original](https://buildtonic.co.uk/_astro/g3.rLhpyPid.jpg) |
| the-old-thatch | /images/projects/the-old-thatch-cover.jpg | 2400 ? 1800 | [Original](https://buildtonic.co.uk/_astro/cover.BrvWKiVS.jpg) |
| the-old-thatch | /images/projects/the-old-thatch-facade.jpg | 2000 ? 1493 | [Original](https://buildtonic.co.uk/_astro/facade.BZO1TPPQ.jpg) |
| the-laurels | /images/projects/the-laurels-g6.jpg | 6000 ? 4000 | [Original](https://buildtonic.co.uk/_astro/g6.iIGs1EIa.jpg) |
| the-laurels | /images/projects/the-laurels-g1.jpg | 6000 ? 4000 | [Original](https://buildtonic.co.uk/_astro/g1.wh-58mWc.jpg) |
| the-laurels | /images/projects/the-laurels-g2.jpg | 6000 ? 4000 | [Original](https://buildtonic.co.uk/_astro/g2.CQ32EyR3.jpg) |
| the-laurels | /images/projects/the-laurels-g3.jpg | 6000 ? 4000 | [Original](https://buildtonic.co.uk/_astro/g3.o4OG-Gzg.jpg) |
| the-laurels | /images/projects/the-laurels-g4.jpg | 6000 ? 4000 | [Original](https://buildtonic.co.uk/_astro/g4.B-SasHKB.jpg) |
| the-laurels | /images/projects/the-laurels-g5.jpg | 6000 ? 4000 | [Original](https://buildtonic.co.uk/_astro/g5.Dp5ljSHS.jpg) |
| the-laurels | /images/projects/the-laurels-cover.jpg | 6000 ? 4000 | [Original](https://buildtonic.co.uk/_astro/cover.ClMYPVQw.jpg) |
| elm-park-gardens | /images/projects/elm-park-gardens-cover.jpg | 1024 ? 768 | [Original](https://buildtonic.co.uk/_astro/cover._kmQVFpK.jpg) |
| elm-park-gardens | /images/projects/elm-park-gardens-g1.jpg | 768 ? 1024 | [Original](https://buildtonic.co.uk/_astro/g1.DVi6YGd-.jpg) |
| elm-park-gardens | /images/projects/elm-park-gardens-g2.jpg | 768 ? 1024 | [Original](https://buildtonic.co.uk/_astro/g2.CgzWNclv.jpg) |
| elm-park-gardens | /images/projects/elm-park-gardens-g3.jpg | 873 ? 1536 | [Original](https://buildtonic.co.uk/_astro/g3.CTusKg5G.jpg) |
| elm-park-gardens | /images/projects/elm-park-gardens-g4.jpg | 873 ? 1536 | [Original](https://buildtonic.co.uk/_astro/g4.RY80alJC.jpg) |
| winters-hill | /images/projects/winters-hill-cover.jpg | 1392 ? 897 | [Original](https://buildtonic.co.uk/_astro/cover.QAgK3spM.jpg) |
| winters-hill | /images/projects/winters-hill-g1.png | 1025 ? 808 | [Original](https://buildtonic.co.uk/_astro/g1.CIMqqTK_.png) |
| winters-hill | /images/projects/winters-hill-g2.png | 1025 ? 808 | [Original](https://buildtonic.co.uk/_astro/g2.Dv0P5T4Z.png) |
| winters-hill | /images/projects/winters-hill-g3.jpg | 4000 ? 3000 | [Original](https://buildtonic.co.uk/_astro/g3.BFwZbTVD.jpg) |
| winters-hill | /images/projects/winters-hill-g4.jpg | 4000 ? 3000 | [Original](https://buildtonic.co.uk/_astro/g4.B-Ilnvg4.jpg) |

## Improvements and limits

- Rose Cottage: cover already 2336 ? 1744; original JPEG recovered without another lossy conversion. Gallery upgraded from 720 pixels to 4000 ? 3000, with two additional 3840 ? 2160 interiors. The interiors are softer source captures despite their pixel dimensions.
- Guildford: cover has only a small increase, 1140 to 1152 pixels wide; gallery sources reach 1152 ? 1536 and one 768 ? 1024. Retained portrait composition and restrained display sizes. No genuinely larger original found.
- Old Thatch: detail/facade rises from 720 ? 537 to 2000 ? 1493; flint photograph from 1140 ? 855 to 2400 ? 1800.
- The Laurels: all seven images recovered at 6000 ? 4000, replacing 720 ? 480 copies. Photography has natural exposure variation; no artificial sharpening.
- Elm Park Gardens: the previously 1140 ? 855 cover was an upscaled derivative of a 1024 ? 768 original. Replaced with the honest source. Other photographs are 768 ? 1024 or 873 ? 1536. More pixels cannot be recovered; layouts constrain enlargement.
- Winter?s Hill: kitchen visual 1392 ? 897, drawings 1025 ? 808, two bathroom visuals 4000 ? 3000. All remain explicitly design material. No completed-build photographs found.

## Project content and genuine media

- [rose-cottage](https://buildtonic.co.uk/projects/rose-cottage/): source for local project facts and gallery.
- [guildford-quaker-meeting-house](https://buildtonic.co.uk/projects/guildford-quaker-meeting-house/): source for local project facts and gallery.
- [the-old-thatch](https://buildtonic.co.uk/projects/the-old-thatch/): source for local project facts and gallery.
- [the-laurels](https://buildtonic.co.uk/projects/the-laurels/): source for local project facts and gallery.
- [elm-park-gardens](https://buildtonic.co.uk/projects/elm-park-gardens/): source for local project facts and gallery.
- [winters-hill](https://buildtonic.co.uk/projects/winters-hill/): source for local project facts and gallery.

Rose Cottage publishes a Ben Rivera testimonial (YouTube e38d-HDWi7Y) and Instagram before/after links DUjeKVJDJcO and DPWklRoDI6y. Old Thatch publishes a client testimonial (YouTube Ua2ZZQmmytw). The Laurels links Instagram project posts DZC4G7lDCGy and DYU_XMEMqSC and credits collaboration with Tom Howley. Guildford reproduces a Checkatrade review; the site uses a short eight-word excerpt with that attribution.

The media links were verified in original project HTML. Direct automated playback inspection was blocked by the video platform and Instagram fetch throttling. No transcript, outcome, before/after image pairing or independent account verification is claimed. Links are optional, named external media; no third-party embed or tracking script loads. Availability/sign-in is controlled by those platforms.

## Asset scope

28 recovered original files are used by the new system. The 12 earlier WebP derivatives remain unused as historical assets; application references now point to the originals. Production media usage should be confirmed by the business, including photographer and testimonial permissions. Public availability does not itself establish a licence.
