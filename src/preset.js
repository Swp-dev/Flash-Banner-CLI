export const PRESETS = {
  hacker: {
    label: 'hacker — green code-rain vibes',
    font: 'Ghost',
    color: { mode: 'gradient', colors: ['#00ff66', '#003311'] },
    effect: 'shadow',
    alignment: 'left',
  },
  neon: {
    label: 'neon — pink → purple glow',
    font: 'Slant',
    color: { mode: 'neon', colors: ['#ff3df1', '#7b2dff'], bold: true },
    effect: 'none',
    alignment: 'center',
  },
  retro: {
    label: 'retro — yellow → orange in a box',
    font: 'Chunky',
    color: { mode: 'gradient', colors: ['#ffd700', '#ff6a00'] },
    effect: 'box',
    alignment: 'left',
  },
  minimal: {
    label: 'minimal — plain white',
    font: 'Standard',
    color: { mode: 'single', colors: ['white'] },
    effect: 'none',
    alignment: 'left',
  },
  glitch: {
    label: 'glitch — corrupted doom text',
    font: 'Doom',
    color: { mode: 'rainbow' },
    effect: 'glitch',
    alignment: 'left',
  },
  ocean: {
    label: 'ocean — calming blue gradient',
    font: 'ANSI Shadow',
    color: { mode: 'gradient', colors: ['#00d4ff', '#0066ff', '#003a9b'] },
    effect: 'none',
    alignment: 'center',
  },
  fire: {
    label: 'fire — red → yellow flame',
    font: 'Big',
    color: { mode: 'gradient', colors: ['#ff0000', '#ff8800', '#ffee00'] },
    effect: 'shadow',
    alignment: 'left',
  },
};

export function getPreset(name) {
  return PRESETS[name?.toLowerCase()] ?? null;
}

export function listPresets() {
  return Object.entries(PRESETS).map(([key, p]) => ({ name: key, label: p.label }));
}
