# Themes

Lantern ships with three themes. Set one in `lantern.config.js`:

```js
export default {
  theme: 'harbour',   // or 'paper', 'night'
};
```

| Theme     | Feel                              | Best for              |
| --------- | --------------------------------- | --------------------- |
| `paper`   | Cream page, serif type            | Long letters          |
| `harbour` | Wide photos, quiet sans-serif     | Photo-heavy trips     |
| `night`   | Dark, high contrast               | Night skies, cities   |

## Your own colours

Every theme reads its colours from CSS variables, so a few lines in `theme.css` are enough to make it yours.
