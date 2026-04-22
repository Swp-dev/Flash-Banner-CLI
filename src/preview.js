import chalk from 'chalk';
import { renderFont, maxLineWidth } from './font.js';
import { applyColor } from './color.js';
import {
  alignText,
  applyStructuralEffect,
  applyDecorationEffect,
  STRUCTURAL_EFFECTS,
  DECORATION_EFFECTS,
} from './effect.js';

export async function renderBanner(text, config) {
  const ascii = await renderFont(text, config.font);

  const effect = config.effect || 'none';
  const structural = STRUCTURAL_EFFECTS.has(effect)
    ? applyStructuralEffect(ascii, effect)
    : ascii;

  const colored = applyColor(structural, config.color || { mode: 'single', colors: ['white'] });

  const decorated = DECORATION_EFFECTS.has(effect)
    ? applyDecorationEffect(colored, structural, effect)
    : colored;

  const aligned =
    config.alignment && config.alignment !== 'left'
      ? alignText(decorated, config.alignment)
      : decorated;

  const plain =
    config.alignment && config.alignment !== 'left'
      ? alignText(structural, config.alignment)
      : structural;

  return { plain, colored: aligned, asciiWidth: maxLineWidth(structural) };
}

export function warnIfTooWide(width) {
  const cols = process.stdout.columns ?? 80;
  if (width > cols) {
    console.log(
      chalk.yellow(
        `\n⚠  Banner width is ${width} columns but your terminal is ${cols}. The output may wrap. Try a smaller font (Standard, Small, Mini) or shorter text.`,
      ),
    );
  }
}

export async function showPreview(text, config, label = 'Preview') {
  const { colored, asciiWidth } = await renderBanner(text, config);
  const bar = '─'.repeat(Math.min(60, process.stdout.columns ?? 60));
  console.log('\n' + bar);
  console.log(`  ${label}`);
  console.log(bar);
  console.log(colored);
  console.log(bar);
  warnIfTooWide(asciiWidth);
  console.log('');
}


