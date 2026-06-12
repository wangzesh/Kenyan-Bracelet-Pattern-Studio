const DEFAULT_PATTERN = `# bead-pattern v1
title: Chicago Marathon 26.2
heights: 6,5
align: center
orientation: alternating

palette:
W = #f8fafc White
C = #7ec8e3 Chicago light blue
R = #d22630 Red
K = #111111 Black

pattern:
01 | W C W W C W | Chicago colors
02 | C W W C W | Chicago colors
03 | W C W W C W | Chicago colors
04 | C W W C W | Chicago colors
05 | W C W W C W | Chicago colors
06 | C W W C W | Chicago colors
07 | W C W W C W | Chicago colors
08 | C W W C W | Chicago colors
09 | W C W W C W | Chicago colors
10 | C W W C W | Chicago colors
11 | W C W W C W | Chicago colors
12 | C W W C W | Chicago colors
13 | W C W W C W | Chicago colors
14 | C W W C W | Chicago colors
15 | W C W W C W | Chicago colors
16 | C W W C W | Chicago colors
17 | W C W W C W | Chicago colors
18 | C W W C W | Chicago colors
19 | W W R W W W | red star
20 | W R R R W | red star
21 | R R R R R R | red star
22 | W R R R W | red star
23 | W W R W W W | red star
24 | W W W W W | spacer
25 | W W W W W W | spacer
26 | K W K K K | 2 column 1
27 | K W K W K W | 2 column 2
28 | K K K W K | 2 column 3
29 | W W W W W W | text spacer
30 | K K K K K | 6 column 1
31 | K W K W K W | 6 column 2
32 | K W K K K | 6 column 3
33 | W W W K K W | decimal point
34 | W W W W W | text spacer
35 | K W K K K W | 2 column 1
36 | K W K W K | 2 column 2
37 | K K K W K W | 2 column 3
38 | W W W W W | spacer
39 | W W W W W W | spacer
40 | W W W W W | spacer
41 | W W R W W W | red star
42 | W R R R W | red star
43 | R R R R R R | red star
44 | W R R R W | red star
45 | W W R W W W | red star
46 | C W W C W | Chicago colors
47 | W C W W C W | Chicago colors
48 | C W W C W | Chicago colors
49 | W C W W C W | Chicago colors
50 | C W W C W | Chicago colors
51 | W C W W C W | Chicago colors
52 | C W W C W | Chicago colors
53 | W C W W C W | Chicago colors
54 | C W W C W | Chicago colors
55 | W C W W C W | Chicago colors
56 | C W W C W | Chicago colors
57 | W C W W C W | Chicago colors
58 | C W W C W | Chicago colors
59 | W C W W C W | Chicago colors
60 | C W W C W | Chicago colors
61 | W C W W C W | Chicago colors
62 | C W W C W | Chicago colors
63 | W C W W C W | Chicago colors
`;

const SVG_NS = "http://www.w3.org/2000/svg";
const NAMED_PREVIEW_COLORS = {
  black: "#111111",
  "very dark brown black": "#1c1712",
  white: "#f8fafc",
  "off white": "#f3ead8",
  cream: "#f3ead8",
  red: "#d22630",
  "bright red": "#d71920",
  "dark red": "#8f1117",
  blue: "#174ea6",
  "royal blue": "#174ea6",
  "light blue": "#7ec8e3",
  "sky blue": "#9eddf2",
  "dark blue": "#0b1f4d",
  navy: "#0b1f4d",
  "navy blue": "#0b1f4d",
  green: "#19a64a",
  "bright green": "#19a64a",
  "dark green": "#0b5d2a",
  "olive green": "#6f7f2a",
  yellow: "#ffd51f",
  "golden yellow": "#d99a00",
  gold: "#d99a00",
  orange: "#f57c00",
  "reddish orange": "#d94b1a",
  brown: "#3b2416",
  "amber brown": "#a05a1f",
  clear: "rgba(255,255,255,0.28)",
  transparent: "rgba(255,255,255,0.28)",
  gray: "#b8c0c8",
  grey: "#b8c0c8",
  silver: "#9ca3af",
  purple: "#4b1d78",
  pink: "#f0528d",
  beige: "#ead8b8",
  tan: "#c8a46f",
  turquoise: "#00a6a6",
  teal: "#00a6a6",
};

const patternInput = byId("patternInput");
const fileInput = byId("fileInput");
const openPatternButton = byId("openPatternButton");
const lengthInput = byId("lengthInput");
const heightsInput = byId("heightsInput");
const beadSizeInput = byId("beadSizeInput");
const gapInput = byId("gapInput");
const alignInput = byId("alignInput");
const orientationInput = byId("orientationInput");
const patternTitle = byId("patternTitle");
const stats = byId("stats");
const previewSvg = byId("previewSvg");
const legend = byId("legend");
const issuesList = byId("issues");
let selectedSymbol = null;

openPatternButton.addEventListener("click", () => {
  fileInput.click();
});

byId("sampleButton").addEventListener("click", () => {
  patternInput.value = DEFAULT_PATTERN;
  render();
});

byId("copyButton").addEventListener("click", () => {
  copyPattern();
});

byId("downloadPatternButton").addEventListener("click", () => {
  const parsed = parsePattern(patternInput.value);
  downloadText(fileName(parsed.title, "bead"), "text/plain;charset=utf-8", patternInput.value);
});

byId("downloadSvgButton").addEventListener("click", () => {
  const parsed = parsePattern(patternInput.value);
  const source = new XMLSerializer().serializeToString(previewSvg);
  downloadText(fileName(parsed.title, "svg"), "image/svg+xml;charset=utf-8", source);
});

byId("addColumnButton").addEventListener("click", () => {
  const parsed = parsePattern(patternInput.value);
  const nextIndex = parsed.columns.length + 1;
  patternInput.value = appendPatternLine(patternInput.value, makeColumnLine(parsed, nextIndex));
  render();
});

byId("removeColumnButton").addEventListener("click", () => {
  patternInput.value = removeLastPatternLine(patternInput.value);
  render();
});

patternInput.addEventListener("input", render);
beadSizeInput.addEventListener("input", render);
gapInput.addEventListener("input", render);

lengthInput.addEventListener("change", () => {
  const parsed = parsePattern(patternInput.value);
  const targetLength = normalizeLength(lengthInput.value, parsed.columns.length);
  patternInput.value = resizePatternColumns(patternInput.value, targetLength);
  render();
});

heightsInput.addEventListener("change", () => {
  patternInput.value = setMeta(patternInput.value, "heights", heightsInput.value.trim() || "6,5");
  render();
});

alignInput.addEventListener("change", () => {
  patternInput.value = setMeta(patternInput.value, "align", alignInput.value);
  render();
});

orientationInput.addEventListener("change", () => {
  patternInput.value = setMeta(patternInput.value, "orientation", orientationInput.value);
  render();
});

fileInput.addEventListener("change", () => {
  const file = fileInput.files?.[0];
  if (!file) return;
  file.text().then((text) => {
    patternInput.value = text;
    fileInput.value = "";
    render();
  });
});

patternInput.value = DEFAULT_PATTERN;
render();

function byId(id) {
  const element = document.getElementById(id);
  if (!element) throw new Error(`Missing element #${id}`);
  return element;
}

function parsePattern(text) {
  const issues = [];
  const meta = new Map();
  const palette = [];
  const paletteMap = new Map();
  const columns = [];
  let section = "meta";

  text.replace(/\r\n/g, "\n").split("\n").forEach((rawLine, index) => {
    const lineNumber = index + 1;
    const line = rawLine.trim();
    if (!line || line.startsWith("#")) return;

    if (/^palette\s*:/i.test(line)) {
      section = "palette";
      return;
    }

    if (/^pattern\s*:/i.test(line)) {
      section = "pattern";
      return;
    }

    if (section === "palette") {
      const entry = parsePaletteLine(line, lineNumber, issues);
      if (!entry) return;
      palette.push(entry);
      paletteMap.set(entry.symbol, entry);
      return;
    }

    if (section === "pattern") {
      const parsedLine = parsePatternLine(line, lineNumber, columns.length + 1, Array.from(paletteMap.keys()));
      if (parsedLine) columns.push(parsedLine);
      return;
    }

    const metaMatch = line.match(/^([A-Za-z0-9_.-]+)\s*:\s*(.*)$/);
    if (metaMatch) {
      meta.set(metaMatch[1].toLowerCase(), metaMatch[2].trim());
    } else {
      issues.push({ level: "warning", message: `Line ${lineNumber}: ignored text outside a section.` });
    }
  });

  const heights = parseHeights(meta.get("heights") || meta.get("height") || "6,5", issues);
  const align = parseAlign(meta.get("align") || "center", issues);
  const orientation = parseOrientation(meta.get("orientation") || "alternating", issues);

  if (palette.length === 0) {
    issues.push({ level: "error", message: "Palette is empty." });
  }

  if (columns.length === 0) {
    issues.push({ level: "error", message: "Pattern has no columns." });
  }

  columns.forEach((column) => {
    const expected = expectedHeight(heights, column.index);
    if (column.explicitIndex !== null && column.explicitIndex !== column.index) {
      issues.push({
        level: "warning",
        message: `Column line ${column.lineNumber}: label ${column.explicitIndex} appears at position ${column.index}.`,
      });
    }

    if (column.beads.length !== expected) {
      issues.push({
        level: "error",
        message: `Column ${column.index}: expected ${expected} beads, found ${column.beads.length}.`,
      });
    }

    column.beads.forEach((symbol) => {
      if (!paletteMap.has(symbol)) {
        issues.push({
          level: "error",
          message: `Column ${column.index}: unknown bead symbol "${symbol}".`,
        });
      }
    });
  });

  return {
    title: meta.get("title") || "Untitled pattern",
    heights,
    align,
    orientation,
    palette,
    paletteMap,
    columns,
    issues,
  };
}

function parsePaletteLine(line, lineNumber, issues) {
  const match = line.match(/^([A-Za-z0-9_.-]+)\s*=\s*(.+)$/);
  if (!match) {
    issues.push({ level: "error", message: `Line ${lineNumber}: invalid palette entry.` });
    return null;
  }

  const symbol = match[1];
  const value = match[2].trim();
  const slashParts = value.split("/");
  const colorText = slashParts[0].trim();
  const description = slashParts.slice(1).join("/").trim();

  if (description) {
    return {
      symbol,
      color: normalizeColorValue(colorText),
      name: description,
    };
  }

  const tokenMatch = value.match(/^(\S+)(?:\s+(.*))?$/);
  if (!tokenMatch) {
    issues.push({ level: "error", message: `Line ${lineNumber}: palette entry "${symbol}" has no colour.` });
    return null;
  }

  const firstToken = tokenMatch[1];
  const rest = tokenMatch[2] || "";
  const wholeValueColor = normalizeColorValue(value);
  const firstTokenColor = normalizeColorValue(firstToken);
  const usesWholeValue = wholeValueColor !== value || !rest;

  return {
    symbol,
    color: usesWholeValue ? wholeValueColor : firstTokenColor,
    name: usesWholeValue ? value : rest || value,
  };
}

function normalizeColorValue(value) {
  const normalized = value.trim().toLowerCase().replace(/[-_]+/g, " ").replace(/\s+/g, " ");
  if (NAMED_PREVIEW_COLORS[normalized]) return NAMED_PREVIEW_COLORS[normalized];
  return value.trim();
}

function parsePatternLine(line, lineNumber, index, paletteSymbols) {
  const parts = line.split("|").map((part) => part.trim());
  let explicitIndex = null;
  let beadsText = parts[0] || "";
  let role = parts.slice(1).join(" | ");

  if (parts.length >= 2 && /^\d+$/.test(parts[0])) {
    explicitIndex = Number(parts[0]);
    beadsText = parts[1] || "";
    role = parts.slice(2).join(" | ");
  }

  const beads = parseBeads(beadsText, paletteSymbols);
  return { index, explicitIndex, beads, role, lineNumber };
}

function parseBeads(beadsText, paletteSymbols) {
  const text = beadsText.trim();
  if (!text) return [];
  if (/\s/.test(text)) return text.split(/\s+/).filter(Boolean);

  const symbols = paletteSymbols.slice().sort((a, b) => b.length - a.length);
  if (symbols.length === 0) return text.split("");

  const beads = [];
  let offset = 0;
  while (offset < text.length) {
    const match = symbols.find((symbol) => text.startsWith(symbol, offset));
    if (!match) return [text];
    beads.push(match);
    offset += match.length;
  }
  return beads;
}

function parseHeights(value, issues) {
  const heights = (value.match(/\d+/g) || []).map((part) => Number(part));
  const valid = heights.every((height) => Number.isInteger(height) && height > 0);
  if (heights.length === 0 || !valid) {
    issues.push({ level: "error", message: `Invalid heights value "${value}".` });
    return [6, 5];
  }
  return heights;
}

function parseAlign(value, issues) {
  if (value === "top" || value === "center" || value === "bottom") return value;
  issues.push({ level: "warning", message: `Invalid align value "${value}", using center.` });
  return "center";
}

function parseOrientation(value, issues) {
  const normalized = value.trim().toLowerCase();
  if (normalized === "alternating" || normalized === "horizontal" || normalized === "vertical") return normalized;
  issues.push({ level: "warning", message: `Invalid orientation value "${value}", using alternating.` });
  return "alternating";
}

function expectedHeight(heights, columnIndex) {
  return heights[(columnIndex - 1) % heights.length];
}

function render() {
  const parsed = parsePattern(patternInput.value);
  syncControls(parsed);
  renderStats(parsed);
  renderIssues(parsed);
  renderLegend(parsed);
  renderSvg(parsed);
}

function syncControls(parsed) {
  patternTitle.textContent = parsed.title;
  if (document.activeElement !== lengthInput) {
    lengthInput.value = String(parsed.columns.length);
  }
  if (document.activeElement !== heightsInput) {
    heightsInput.value = parsed.heights.join(",");
  }
  if (document.activeElement !== alignInput) {
    alignInput.value = parsed.align;
  }
  if (document.activeElement !== orientationInput) {
    orientationInput.value = parsed.orientation;
  }
}

function renderStats(parsed) {
  const beadCount = parsed.columns.reduce((sum, column) => sum + column.beads.length, 0);
  const maxHeight = Math.max(...parsed.heights, ...parsed.columns.map((column) => column.beads.length), 0);
  const errors = parsed.issues.filter((issue) => issue.level === "error").length;
  stats.textContent = `${parsed.columns.length} columns | ${beadCount} beads | max ${maxHeight} high | ${errors} errors`;
}

function renderIssues(parsed) {
  issuesList.replaceChildren();
  const issues = parsed.issues.length > 0 ? parsed.issues : [{ level: "ok", message: "All counts valid." }];
  issues.forEach((issue) => {
    const item = document.createElement("li");
    item.className = issue.level;
    item.textContent = issue.message;
    issuesList.appendChild(item);
  });
}

function renderLegend(parsed) {
  legend.replaceChildren();
  if (!selectedSymbol || !parsed.paletteMap.has(selectedSymbol)) {
    selectedSymbol = parsed.palette[0]?.symbol ?? null;
  }

  parsed.palette.forEach((entry) => {
    const item = document.createElement("button");
    item.type = "button";
    item.className = `legend-item${entry.symbol === selectedSymbol ? " selected" : ""}`;
    item.setAttribute("aria-pressed", entry.symbol === selectedSymbol ? "true" : "false");
    item.title = `Paint with ${entry.symbol}`;
    item.addEventListener("click", () => {
      selectedSymbol = entry.symbol;
      renderLegend(parsed);
    });
    const swatch = document.createElement("span");
    swatch.className = "swatch";
    swatch.style.background = entry.color;
    const label = document.createElement("span");
    label.textContent = `${entry.symbol} ${entry.name}`;
    item.append(swatch, label);
    legend.appendChild(item);
  });
}

function renderSvg(parsed) {
  previewSvg.replaceChildren();

  const beadSize = Number(beadSizeInput.value);
  const gap = Number(gapInput.value);
  const pitchX = beadSize + gap;
  const pitchY = beadSize + gap;
  const margin = 14;
  const labelHeight = 18;
  const maxHeight = Math.max(...parsed.heights, ...parsed.columns.map((column) => column.beads.length), 1);
  const width = Math.max(180, margin * 2 + Math.max(0, parsed.columns.length - 1) * pitchX + beadSize);
  const height = margin * 2 + maxHeight * pitchY - gap + labelHeight;

  previewSvg.setAttribute("viewBox", `0 0 ${width} ${height}`);
  previewSvg.setAttribute("width", String(width));
  previewSvg.setAttribute("height", String(height));

  parsed.columns.forEach((column, columnOffset) => {
    const yOffset = columnYOffset(parsed.align, maxHeight, column.beads.length, pitchY);
    const radii = beadRadii(beadSize, column.beads.length, parsed.orientation);
    column.beads.forEach((symbol, beadOffset) => {
      const entry = parsed.paletteMap.get(symbol);
      const bead = document.createElementNS(SVG_NS, "ellipse");
      bead.setAttribute("cx", String(margin + beadSize / 2 + columnOffset * pitchX));
      bead.setAttribute("cy", String(margin + beadSize / 2 + yOffset + beadOffset * pitchY));
      bead.setAttribute("rx", String(radii.rx));
      bead.setAttribute("ry", String(radii.ry));
      bead.setAttribute("fill", entry?.color || "#ff4da6");
      bead.setAttribute("stroke", "#334155");
      bead.setAttribute("stroke-width", "0.7");
      bead.setAttribute("class", "bead");
      bead.setAttribute("tabindex", "0");
      bead.setAttribute("role", "button");
      bead.setAttribute("aria-label", `Column ${column.index}, bead ${beadOffset + 1}: ${symbol}`);
      bead.addEventListener("click", () => {
        paintBead(parsed, column.index, beadOffset);
      });
      bead.addEventListener("keydown", (event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          paintBead(parsed, column.index, beadOffset);
        }
      });

      const title = document.createElementNS(SVG_NS, "title");
      title.textContent = `Column ${column.index}, bead ${beadOffset + 1}: ${symbol}`;
      bead.appendChild(title);
      previewSvg.appendChild(bead);
    });

    if (column.index === 1 || column.index % 5 === 0 || column.index === parsed.columns.length) {
      const label = document.createElementNS(SVG_NS, "text");
      label.setAttribute("x", String(margin + beadSize / 2 + columnOffset * pitchX));
      label.setAttribute("y", String(height - 4));
      label.setAttribute("text-anchor", "middle");
      label.setAttribute("font-size", "9");
      label.setAttribute("fill", "#64748b");
      label.textContent = String(column.index);
      previewSvg.appendChild(label);
    }
  });
}

function beadRadii(beadSize, columnHeight, orientation) {
  if (orientation === "vertical") {
    return { rx: beadSize * 0.42, ry: beadSize * 0.56 };
  }
  if (orientation === "horizontal") {
    return { rx: beadSize * 0.56, ry: beadSize * 0.42 };
  }
  if (columnHeight === 6) {
    return { rx: beadSize * 0.42, ry: beadSize * 0.56 };
  }
  if (columnHeight === 5) {
    return { rx: beadSize * 0.56, ry: beadSize * 0.42 };
  }
  return { rx: beadSize * 0.5, ry: beadSize * 0.5 };
}

function columnYOffset(align, maxHeight, columnHeight, pitchY) {
  const extra = Math.max(0, maxHeight - columnHeight) * pitchY;
  if (align === "top") return 0;
  if (align === "bottom") return extra;
  return extra / 2;
}

function setMeta(text, key, value) {
  const expression = new RegExp(`^${escapeRegExp(key)}\\s*:.*$`, "mi");
  if (expression.test(text)) {
    return text.replace(expression, `${key}: ${value}`);
  }

  const sectionStart = text.search(/^\s*(palette|pattern)\s*:/im);
  if (sectionStart >= 0) {
    return `${text.slice(0, sectionStart)}${key}: ${value}\n${text.slice(sectionStart)}`;
  }
  return `${key}: ${value}\n${text}`;
}

function appendPatternLine(text, line) {
  const trimmed = text.replace(/\s+$/g, "");
  const lines = trimmed ? trimmed.split("\n") : [];
  if (!lines.some((entry) => /^pattern\s*:/i.test(entry.trim()))) {
    lines.push("", "pattern:");
  }
  lines.push(line);
  return `${lines.join("\n")}\n`;
}

function resizePatternColumns(text, targetLength) {
  const parsed = parsePattern(text);
  const currentLength = parsed.columns.length;
  let output = text;

  if (targetLength < currentLength) {
    for (let index = currentLength; index > targetLength; index -= 1) {
      output = removeLastPatternLine(output);
    }
    return output;
  }

  for (let index = currentLength + 1; index <= targetLength; index += 1) {
    output = appendPatternLine(output, makeColumnLine(parsed, index));
  }
  return output;
}

function makeColumnLine(parsed, index) {
  const fill = parsed.paletteMap.has("W") ? "W" : parsed.palette[0]?.symbol ?? "W";
  const height = expectedHeight(parsed.heights, index);
  return `${String(index).padStart(2, "0")} | ${Array(height).fill(fill).join(" ")} | new column`;
}

function paintBead(parsed, columnIndex, beadOffset) {
  if (!selectedSymbol || !parsed.paletteMap.has(selectedSymbol)) return;
  patternInput.value = replaceBeadAt(patternInput.value, parsed, columnIndex, beadOffset, selectedSymbol);
  render();
}

function replaceBeadAt(text, parsed, columnIndex, beadOffset, symbol) {
  const column = parsed.columns[columnIndex - 1];
  if (!column || beadOffset < 0 || beadOffset >= column.beads.length) return text;

  const lines = text.replace(/\r\n/g, "\n").split("\n");
  const lineIndex = column.lineNumber - 1;
  if (lineIndex < 0 || lineIndex >= lines.length) return text;

  const beads = column.beads.slice();
  beads[beadOffset] = symbol;
  const label = String(column.explicitIndex ?? column.index).padStart(2, "0");
  const role = column.role ? ` | ${column.role}` : "";
  lines[lineIndex] = `${label} | ${beads.join(" ")}${role}`;
  return lines.join("\n");
}

function normalizeLength(value, fallback) {
  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed < 1) return Math.max(1, fallback);
  return Math.floor(parsed);
}

function removeLastPatternLine(text) {
  const lines = text.split("\n");
  let inPattern = false;
  let lastPatternLine = -1;

  lines.forEach((rawLine, index) => {
    const line = rawLine.trim();
    if (/^pattern\s*:/i.test(line)) {
      inPattern = true;
      return;
    }
    if (inPattern && line && !line.startsWith("#")) {
      lastPatternLine = index;
    }
  });

  if (lastPatternLine >= 0) {
    lines.splice(lastPatternLine, 1);
  }
  return lines.join("\n");
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function fileName(title, extension) {
  const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "bracelet-pattern";
  return `${slug}.${extension}`;
}

function downloadText(name, type, text) {
  const blob = new Blob([text], { type });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = name;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 0);
}

async function copyPattern() {
  try {
    await navigator.clipboard.writeText(patternInput.value);
  } catch {
    patternInput.focus();
    patternInput.select();
    document.execCommand("copy");
  }
}
