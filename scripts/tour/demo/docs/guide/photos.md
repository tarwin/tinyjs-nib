# Photos and maps

Lantern resizes every photo for the web when it builds: a 1600-pixel WebP for the page, and a small blurred placeholder that shows while it loads.

## Where photos go

Keep each trip's photos in a folder named after the trip, beside it:

```text
trips/
  lisbon.md
  lisbon/
    tram-28.jpg
    alfama.jpg
```

## The map

Every `where:` and every place named in a day heading is pinned on the journal's map. Lantern looks places up once and keeps the answers in `.lantern/places.json`, so builds stay offline.

$$
\text{distance} = 2r \arcsin\sqrt{\sin^2\tfrac{\Delta\varphi}{2} + \cos\varphi_1\cos\varphi_2\sin^2\tfrac{\Delta\lambda}{2}}
$$

That's the great-circle distance Lantern prints under each trip.
