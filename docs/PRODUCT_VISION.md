# Product Vision

## Why RootMap Play exists

RootMap helps parents support children's growth through meaningful
real-world experiences. RootMap Play is a new, playful, beautiful, and
shareable collection of interactive digital experiences for families with
children aged 0–6. It is **not a separate brand** — every experience must
clearly belong to RootMap, acting as a delightful, low-friction front door
to the broader RootMap product.

## Business goals

1. **Attract parents** through delightful, personalized experiences.
2. **Encourage sharing** — users create, download, and share their results
   (especially on Xiaohongshu and WeChat, where the primary audience is
   active).
3. **Understand what resonates** through anonymous product analytics (never
   fabricated — see [ANALYTICS_EVENTS.md](ANALYTICS_EVENTS.md)).
4. **Collect optional feedback and community interest**, always opt-in.
5. **Introduce interested parents to the main RootMap application**, over
   time and without being pushy.

## Audience

Primary audience: **Chinese parents** of children aged 0–6. The interface is
Simplified Chinese first. The i18n architecture
(see [ARCHITECTURE.md](ARCHITECTURE.md#internationalisation)) supports adding
English later without restructuring components.

The experience should appeal to young parents who enjoy beautiful, creative
products and sharing personalized results — so the bar for visual and
editorial quality is high, closer to a boutique design studio than a
generic SaaS product.

## Design direction

**Do:**

- Whimsical illustrated worlds, original SVG artwork.
- Beautiful typography (serif display + humanist Chinese sans body).
- Warm, sophisticated colors (cream, terracotta, pine green, gold — not a
  generic SaaS blue/purple).
- Soft textures and subtle animation.
- High-quality collectible digital keepsakes.
- Editorial-quality layouts.
- Excellent mobile usability (mobile-first).

**Avoid:**

- Generic SaaS dashboard styling on the public website.
- Excessive gradients.
- Cheap-looking AI-generated aesthetics.
- Generic emoji used as primary illustrations.
- Cluttered interfaces.
- Childish designs that look unappealing to adults.

## The three initial product experiences

### A. Pocket Universe (宝宝的口袋宇宙)

Parents select five things their child loves (e.g. dinosaurs, trains, cats,
strawberries, stars) and the site composes a personalized illustrated
miniature world from original SVG elements — no external image-generation
API. Output is a downloadable, mobile-friendly PNG with small RootMap
branding. **Planned for Phase 2** (first creation experience to be built).

### B. Little Hero Card (宝宝的隐藏角色)

Parents answer a few playful questions about their child's interests and
everyday habits. The site generates a collectible character card: a creative
character title, a playful "superpower," a unique illustration, and a
personalized description. Downloadable PNG. Explicitly entertainment, not a
psychological or developmental assessment. **Planned for Phase 2.**

### C. Family Universe (我们家的亲戚关系宇宙)

Parents build a beautiful illustrated family relationship map: select family
members, customize names/relationship labels, and support common Chinese
family relationship terms. Downloadable PNG. First version intentionally
simple and expandable. **Planned for Phase 2.**

## Non-goals (for now)

- No required account creation anywhere on the public site.
- No psychological/developmental claims — Little Hero Card is entertainment.
- No automatic identification of a visitor's WeChat/Xiaohongshu account.
- No cross-linking to a "main RootMap app" URL until a real, confirmed
  destination exists (a placeholder/fabricated link would violate the "no
  placeholder buttons pretending to work" quality bar).
