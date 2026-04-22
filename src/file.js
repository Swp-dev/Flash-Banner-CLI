import { writeFile } from 'node:fs/promises';
import path from 'node:path';
import { generateCode } from './codegen.js';

export async function exportBannerAsCode({
  coloredBanner,
  language,
  varName = 'banner',
  dir = process.cwd(),
}) {
  const { code, ext } = generateCode(language, coloredBanner, varName);
  const filePath = path.join(dir, `banner.${ext}`);
  await writeFile(filePath, code, 'utf8');
  return filePath;
}
