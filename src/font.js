import figlet from 'figlet';

function figletAsync(text, options) {
  return new Promise((resolve, reject) => {
    figlet.text(text, options, (err, data) => {
      if (err) reject(err);
      else resolve(data);
    });
  });
}

export const FONTS = {
  Readable: ['Standard', 'Small', 'Big', 'Mini'],
  'Modern / Slanted': ['Slant', 'Speed', 'Ivrit'],
  'Hacker / Dark': ['Ghost', 'Doom', 'Bloody', 'ANSI Shadow'],
  'Retro / Pixel': ['Chunky', 'Block', 'Banner', 'Digital'],
  Fancy: ['Univers', 'Roman', '3-D', 'Lean'],
};

export const ALL_FONTS = Object.values(FONTS).flat();

export async function renderFont(text, font = 'Standard') {
  try {
    const ascii = await figletAsync(text, { font, horizontalLayout: 'default' });
    if (!ascii || !ascii.trim()) {
      const fallback = await figletAsync(text, { font: 'Standard' });
      return fallback ?? text;
    }
    return ascii.replace(/\s+$/g, '');
  } catch {
    const fallback = await figletAsync(text, { font: 'Standard' });
    return fallback ?? text;
  }
}

export function maxLineWidth(text) {
  return Math.max(...text.split('\n').map((l) => l.length));
}
