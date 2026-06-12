# Bracelets Design Agent Guide

Read `README.md` before editing this project.

## Pattern Rules

- The maker-ready artifact is always a deterministic column-by-column bead list.
- Prefer `.bead` files as editable source when a rendered preview is needed.
- Each design must declare its band-width rule, such as constant `7`, constant `6`, or repeating `6,5`.
- Every column must follow the declared band-width rule exactly.
- Do not add visual border rows outside the declared bead height.
- If black rim or contrast is used, count it inside each column's declared bead height.
- Bracelet length is flexible unless the user gives a target. Prioritize readable motifs over minimizing column count.
- After editing a pattern, verify every column count and state the verification result.

## Chicago Marathon Rules

- Use Chicago-related colors and symbols: white background, light blue stripes, red Chicago-style star, and black only for contrast when useful.
- Do not use Canada flag, maple leaf, Toronto, CN Tower, or American flag motifs.
- Use `26.2` for the marathon distance unless the user explicitly requests another short Chicago/marathon text such as `CHI.26`.
- Keep text minimal because the bracelet is narrow.

## Image Rules

- Do not use standalone AI-generated bracelet images as final output.
- Optional previews must be secondary and derived from the deterministic bead grid.

## Web Tool Rules

- `web/index.html` is the local entrypoint.
- `web/app.ts` is the typed source; `web/app.js` is the browser-ready file used by `index.html`.
- Keep `app.ts` and `app.js` behavior in sync when editing the tool.
