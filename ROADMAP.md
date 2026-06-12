# Roadmap

Planned improvements for the bracelet pattern studio.

## 1. Bead Orientation Metadata

The app should support configurable bead orientation in previews.

### User Need

Different bracelet makers may use different bead orientations. The preview should not assume a single rendering style.

### Proposed `.bead` Metadata

Add an optional metadata field:

```text
orientation: alternating
```

Supported values:

- `alternating`: current behavior. For a `6,5` band-width rule, 6-bead columns render as vertical ovals and 5-bead columns render as horizontal ovals.
- `horizontal`: all beads render as horizontal ovals.
- `vertical`: all beads render as vertical ovals.

Default:

- If `orientation:` is missing, default to `alternating`.

### App Behavior

- Parse `orientation:` from the pattern text.
- Add a UI control for orientation with `alternating`, `horizontal`, and `vertical`.
- Changing the UI control should update the `.bead` text, just like `heights:` and `align:`.
- Existing `.bead` files without `orientation:` should continue to render correctly.

## 2. Standard Letter Library For 5/6 Bracelets

The app needs a reusable character library so each letter and number has a standard representation.

### User Need

Users should not have to redesign letters like `C`, `H`, `I`, `E`, `2`, or `6` every time. The bracelet is too narrow for freehand typography to be reliable.

### Design Direction

- Build letters as compact bead glyphs learned from real 5/6 bracelet designs.
- Use a 5-row glyph core, even when the bracelet alternates 6-bead and 5-bead columns.
- For 6-bead columns, add one background/padding bead rather than stretching the glyph.
- Store glyphs in a deterministic text format so humans and AI can inspect and edit them.

### Proposed Library Shape

```text
glyph: E
width: 3
rows: 5
pattern:
N N N
N W W
N N N
N W W
N N N
```

Implementation requirements:

- Support all alphanumeric characters from the start:
  - uppercase letters `A-Z`
  - digits `0-9`
- Add punctuation needed for race designs, especially `.` and `-`.
- Support theme-specific foreground/background symbols, for example `N` on `W`.

## 3. Text Input To Generate Standard Characters

The web app should support direct text input that automatically lays out standard glyphs.

### User Need

A user should be able to type text such as:

```text
CHI.26
```

and have the app generate a maker-ready bead grid using the standard character library.

### App Behavior

- Add a text field such as `Generate text`.
- User enters text.
- User selects foreground and background bead symbols.
- App converts each character into standard glyph columns.
- App inserts the generated columns into the `.bead` pattern.
- Generated columns must still obey the active band-width rule, such as `6,5`.
- The generated output should remain editable by clicking beads in the preview.

### Important Constraints

- Text generation must not bypass validation.
- Every generated column must still list exact bead symbols.
- The `.bead` text remains the source of truth after generation.
- Unknown characters should be rejected with a clear validation message, not guessed.

## Suggested Build Order

1. Add `orientation:` parsing and preview control.
2. Create the standard glyph library for all uppercase letters `A-Z` and digits `0-9`, plus common punctuation such as `.` and `-`.
3. Add text generation for arbitrary alphanumeric input, not just one phrase.
4. Add import/export for glyph libraries if multiple maker styles emerge.
