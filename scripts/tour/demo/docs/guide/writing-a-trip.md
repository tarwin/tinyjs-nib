# Writing a trip

A trip is a Markdown file with a little front matter on top:

```yaml
---
title: Three days in Lisbon
date: 2026-05-14
where: Lisbon, Portugal
cover: tram-28.jpg
---
```

## Photos in the text

Mention a picture and Lantern places it there. A line on its own becomes a full-width photo; two in a row become a pair.

![Tram 28 climbing to the castle](../public/images/tram.svg)

Captions come from the alt text, so write them for people.

![The harbour at dusk](../public/images/harbour.jpg)

## Days and places

Start a day with a level-two heading. Lantern adds the date and, if you name a place in the heading, a pin on the trip's map.

---

## Drafts

A trip with `draft: true` in its front matter shows in `npm run dev` but is left out of the published site.
