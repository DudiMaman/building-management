# Server-side PDF fonts

Drop the following TrueType font files here for full Hebrew PDF rendering:

- `Heebo-Regular.ttf`
- `Heebo-Bold.ttf`
- `Rubik-Regular.ttf` (optional, used for invoice headers)

Source: https://fonts.google.com/specimen/Heebo and https://fonts.google.com/specimen/Rubik

Without these files the PDF service falls back to the built-in Helvetica family,
which does NOT support Hebrew glyphs — Hebrew text will appear as missing-glyph
boxes. The service still produces a valid PDF in that case (no crash); only
the visual rendering of Hebrew strings is degraded.

The fonts are intentionally not committed to the repo (licensing + repo size).
In production / staging, mount them at build time (Dockerfile `COPY assets/fonts`,
or pull from object storage on container start).
