# Bracelets Design

Workflow for reproducible Kenyan/Maasai-style beaded bracelet patterns. The output should be a maker-ready bead grid, not a decorative generated image.

Static app entrypoint: `index.html` redirects to `web/`. This can be hosted on GitHub Pages.

## Goal

Design narrow bracelet patterns that can be counted and reproduced column by column. The primary current design is a Chicago Marathon attendee bracelet using Chicago colors, red star motifs, and `26.2`.

## Hard Constraints

- Each design must declare a band-width rule, such as `height: 7`, `height: 6`, or `height: 6,5`.
- Every column must follow the declared band-width rule exactly.
- No extra border rows. If a rim is used, it must be part of the declared bead height.
- Every column must explicitly list its beads. The column list is the source of truth.
- Do not use image generation as the final pattern format. Rendered previews are optional only after the deterministic grid exists.
- Chicago Marathon patterns must avoid Canada, Toronto, CN Tower, maple leaf, and American flag motifs.
- For marathon distance text, use `26.2`, not `42 km`.

## Notation

- Columns are listed left to right around the bracelet.
- Beads inside a column are listed top to bottom.
- Current color legend:
  - `W`: white
  - `C`: Chicago light blue
  - `R`: red
  - `K`: black

## Workflow

1. Define the concept and color rules.
2. Create a deterministic bead grid with alternating 6/5 column heights.
3. Verify every column count before treating the pattern as maker-ready.
4. Add optional previews only if they are derived from the grid.

## Local Preview Tool

Open `web/index.html` in a browser to edit `.bead` pattern text and render a deterministic preview. The app is local-only and does not require a server or AI interpretation. The hosted page includes its own usage guide for end users.

The preview can also be edited directly: select a palette swatch, then click a bead in the preview. The app updates both the rendered bead and the matching `pattern:` row in the text editor.

The preview uses configurable oriented oval beads. Set `orientation: alternating` for the current 6/5 behavior where 6-bead columns render as vertical ovals and 5-bead columns render as horizontal ovals. Constant `8` patterns default to horizontal orientation; use `orientation: horizontal` explicitly in maker-ready files.

The `.bead` format is the preferred editable source:

```text
title: Chicago Marathon 26.2
heights: 6,5
orientation: alternating

palette:
W = #f8fafc White
C = #7ec8e3 Chicago light blue
R = #d22630 Red
K = #111111 Black

pattern:
01 | W C W W C W | Chicago colors
02 | C W W C W | Chicago colors
```

- Length is the number of `pattern:` column lines, counted around the wrist.
- Band width is controlled by the `heights:` sequence, counted as beads tall per column.
- Beads in each column are listed top to bottom.
- The renderer checks every column count against the height sequence.

Recommended wording:

- `Length (columns)`: how many vertical bead columns run around the wrist.
- `Band width pattern`: how many beads tall each column is. For this bracelet style, use `6,5` to alternate 6-bead and 5-bead columns.

Supported local inputs:

- Direct typing or pasting in the pattern text editor.
- Manual preview editing by clicking beads.
- Local `.bead` files.
- Local `.txt` files that use the same text format.

Forgiving parser support:

- `height:` and `heights:` are both accepted.
- `height: 5,6 alternating` is parsed as `5,6`.
- Beads can be space-separated, such as `B W W W B`, or compact, such as `BWWWB`, when the palette symbols can be recognized.
- Palette lines can use exact preview colours, such as `W = #f8fafc white`, or plain colour descriptions, such as `L = light blue / stripe accent`.

Unsupported inputs:

- Image files, PDFs, spreadsheets, and AI-generated bracelet images.
- JSON or CSV, unless the app is extended with importers later.

## GitHub Pages

See `DEPLOY.md`. The page is static, so `.bead` upload and SVG download work from GitHub Pages through browser APIs.

## Roadmap

See `ROADMAP.md` for planned improvements, including configurable bead orientation, a standard 5/6 letter library, and text-to-pattern generation.

## Patterns

- `patterns/chicago-marathon-26_2.md`: Chicago colors, red star, `26.2`, red star, Chicago colors.
- `patterns/chicago-marathon-26_2.bead`: editable source format for the local preview tool.
- `patterns/chicago-marathon-chi_26-flag.bead`: constant-8 Chicago Marathon version with two stars, `CHI.26`, and two stars.
- `patterns/toronto-marathon-tor-42-flag.bead`: constant-8 Toronto Marathon version with `TOR`, a wide Toronto flag block, and `42`.

## Notes

- `notes/lettering-5-6-reference.md`: observations from a real 5/6 beaded bracelet showing how compact letters are built.

## Palettes

- `palettes/photo-bead-inventory.md`: bead colour families and visible variations from the reference photo.
- `palettes/photo-bead-inventory.bead`: app-compatible starter pattern with the full palette block.
