import chalk from 'chalk';

const GLITCH_CHARS = '!@#$%^&*<>/\\|?+=~`'.split('');
const ANSI_RE = /\x1b\[[0-9;]*m/g;

const GLITCH_PALETTE = [
  chalk.redBright,
  chalk.magentaBright,
  chalk.cyanBright,
  chalk.yellowBright,
];

export function stripAnsi(s) {
  return s.replace(ANSI_RE, '');
}

export function visibleWidth(line) {
  return stripAnsi(line).length;
}

function padLines(text) {
  const lines = text.split('\n');
  const max = Math.max(...lines.map(visibleWidth));
  return lines.map((l) => l + ' '.repeat(max - visibleWidth(l)));
}

export function alignText(text, alignment = 'left', width) {
  const lines = padLines(text);
  const max = Math.max(...lines.map(visibleWidth));
  const cols = width ?? process.stdout.columns ?? max;
  return lines
    .map((line) => {
      const w = visibleWidth(line);
      if (alignment === 'center') {
        const pad = Math.max(0, Math.floor((cols - w) / 2));
        return ' '.repeat(pad) + line;
      }
      if (alignment === 'right') {
        const pad = Math.max(0, cols - w);
        return ' '.repeat(pad) + line;
      }
      return line;
    })
    .join('\n');
}

export function addPadding(text, { top = 1, left = 2 } = {}) {
  const padLeft = ' '.repeat(left);
  const lines = text.split('\n').map((l) => padLeft + l);
  const blank = '';
  const topLines = Array(top).fill(blank);
  return [...topLines, ...lines, ...topLines].join('\n');
}

export function boxify(text, style = 'simple') {
  const lines = padLines(text);
  const inner = Math.max(...lines.map(visibleWidth));
  const padded = lines.map((l) => ` ${l} `);

  const presets = {
    simple: { tl: '+', tr: '+', bl: '+', br: '+', h: '-', v: '|' },
    double: { tl: '╔', tr: '╗', bl: '╚', br: '╝', h: '═', v: '║' },
    rounded: { tl: '╭', tr: '╮', bl: '╰', br: '╯', h: '─', v: '│' },
  };
  const p = presets[style] ?? presets.simple;
  const top = p.tl + p.h.repeat(inner + 2) + p.tr;
  const bot = p.bl + p.h.repeat(inner + 2) + p.br;
  const body = padded.map((l) => p.v + l + p.v).join('\n');
  return [top, body, bot].join('\n');
}

export function applyShadowAfterColor(coloredText, plainText) {
  const plainLines = plainText.split('\n');
  const width = Math.max(...plainLines.map((l) => l.length));

  const shadowRows = plainLines.map((line) =>
    line
      .padEnd(width, ' ')
      .split('')
      .map((c) => (c === ' ' ? ' ' : '░'))
      .join('')
      .trimEnd(),
  );

  const out = coloredText.split('\n');
  for (const row of shadowRows) {
    if (row.length === 0) continue;
    out.push(' ' + chalk.gray(row));
  }
  return out.join('\n');
}

export function applyGlitchAfterColor(coloredText, intensity = 0.1) {
  let out = '';
  let i = 0;
  while (i < coloredText.length) {
    if (coloredText[i] === '\x1b') {
      const m = coloredText.slice(i).match(/^\x1b\[[0-9;]*m/);
      if (m) {
        out += m[0];
        i += m[0].length;
        continue;
      }
    }
    const ch = coloredText[i];
    if (ch !== ' ' && ch !== '\n' && Math.random() < intensity) {
      const g = GLITCH_CHARS[Math.floor(Math.random() * GLITCH_CHARS.length)];
      const colorFn = GLITCH_PALETTE[Math.floor(Math.random() * GLITCH_PALETTE.length)];
      out += colorFn(g);
    } else {
      out += ch;
    }
    i++;
  }
  return out;
}

export function applyStructuralEffect(text, effect = 'none') {
  switch (effect) {
    case 'box':
      return boxify(text, 'simple');
    case 'double':
    case 'double box':
      return boxify(text, 'double');
    case 'rounded':
      return boxify(text, 'rounded');
    default:
      return text;
  }
}

export function applyDecorationEffect(coloredText, plainText, effect = 'none') {
  switch (effect) {
    case 'shadow':
      return applyShadowAfterColor(coloredText, plainText);
    case 'glitch':
      return applyGlitchAfterColor(coloredText);
    default:
      return coloredText;
  }
}

export const STRUCTURAL_EFFECTS = new Set(['box', 'double', 'double box', 'rounded']);
export const DECORATION_EFFECTS = new Set(['shadow', 'glitch']);
