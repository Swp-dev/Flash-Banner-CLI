import chalk from 'chalk';
import gradient from 'gradient-string';

function normalizeColor(c) {
  if (!c) return null;
  const v = String(c).trim();
  if (!v) return null;
  return v;
}

function applyChalkColor(text, color) {
  const c = normalizeColor(color);
  if (!c) return text;
  if (c.startsWith('#')) return chalk.hex(c)(text);
  const fn = chalk[c];
  if (typeof fn === 'function') return fn(text);
  try {
    return chalk.keyword(c)(text);
  } catch {
    return text;
  }
}

export function applyColor(text, options = {}) {
  const { mode = 'single', colors = [], bold = false } = options;
  let out = text;

  if (mode === 'rainbow') {
    out = gradient.rainbow.multiline(text);
  } else if (mode === 'pastel') {
    out = gradient.pastel.multiline(text);
  } else if (mode === 'gradient') {
    const palette = colors.filter(Boolean);
    if (palette.length >= 2) {
      out = gradient(palette).multiline(text);
    } else if (palette.length === 1) {
      out = applyChalkColor(text, palette[0]);
    }
  } else if (mode === 'neon') {
    const palette = colors.filter(Boolean);
    const neonPalette = palette.length >= 2 ? palette : ['#ff00ff', '#00ffff'];
    out = chalk.bold(gradient(neonPalette).multiline(text));
  } else {
    out = applyChalkColor(text, colors[0] ?? 'white');
  }

  if (bold && mode !== 'neon') out = chalk.bold(out);
  return out;
}

