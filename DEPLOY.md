# Deploy To GitHub Pages

This project is a static site. It can be hosted by GitHub Pages without a backend.

## What Still Works On GitHub Pages

- Open `.bead` or `.txt` files through the browser file picker.
- Edit pattern text directly.
- Paint beads by selecting a palette colour and clicking the preview.
- Save edited pattern text with `Save .bead`.
- Save the rendered preview with `Save SVG`.

These actions use browser APIs only. GitHub Pages does not need to store uploaded files.

## GitHub Pages Setup

Recommended repository shape:

```text
index.html
web/
patterns/
palettes/
notes/
README.md
```

In GitHub:

1. Create a repository for this folder.
2. Push this folder to the repository.
3. Go to Settings -> Pages.
4. Set the source to deploy from the main branch root.
5. Open the published Pages URL.

The root `index.html` redirects visitors to `web/`.

## Command-Line Publish

From this folder:

```sh
git add .
git commit -m "Publish bracelet pattern studio"
git remote add origin git@github.com:YOUR_USER/YOUR_REPO.git
git push -u origin main
```

Then enable Pages in GitHub:

```text
Settings -> Pages -> Build and deployment -> Source: Deploy from a branch
Branch: main
Folder: /root
```

The published URL will usually be:

```text
https://YOUR_USER.github.io/YOUR_REPO/
```

## Notes About Upload And Save

On the hosted page, `Open .bead` does not upload files to GitHub. It reads the selected file locally in the visitor's browser.

`Save .bead` and `Save SVG` create downloads in the visitor's browser. GitHub Pages does not receive or store those edited files.
