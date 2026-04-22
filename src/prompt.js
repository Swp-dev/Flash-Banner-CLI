import inquirer from 'inquirer';
import { FONTS } from './font.js';
import { listPresets, getPreset } from './preset.js';
import { showPreview } from './preview.js';
import { t, setLang, BACK } from './i18n.js';

function backChoice() {
  return { name: t('back'), value: BACK };
}

export async function askLanguage() {
  const { lang } = await inquirer.prompt([
    {
      type: 'list',
      name: 'lang',
      message: t('select_language'),
      choices: [
        { name: 'English', value: 'en' },
        { name: 'Tiếng Việt', value: 'vi' },
      ],
    },
  ]);
  setLang(lang);
  return lang;
}

export async function askText(defaultText) {
  const { text } = await inquirer.prompt([
    {
      type: 'input',
      name: 'text',
      message: t('text_label'),
      default: defaultText,
      validate: (v) => (v && v.trim().length > 0 ? true : t('text_validate')),
    },
  ]);
  return text.trim();
}

export async function askMode() {
  const { mode } = await inquirer.prompt([
    {
      type: 'list',
      name: 'mode',
      message: t('mode_label'),
      choices: [
        { name: t('mode_quick'), value: 'quick' },
        { name: t('mode_advanced'), value: 'advanced' },
        new inquirer.Separator(),
        backChoice(),
      ],
    },
  ]);
  return mode;
}

export async function askPreset() {
  const presets = listPresets();
  const { preset } = await inquirer.prompt([
    {
      type: 'list',
      name: 'preset',
      message: t('preset_label'),
      choices: [
        ...presets.map((p) => ({ name: p.label, value: p.name })),
        new inquirer.Separator(),
        backChoice(),
      ],
    },
  ]);
  if (preset === BACK) return BACK;
  return getPreset(preset);
}

function fontChoices() {
  const choices = [];
  for (const [group, fonts] of Object.entries(FONTS)) {
    choices.push(new inquirer.Separator(`── ${group} ──`));
    for (const f of fonts) choices.push({ name: f, value: f });
  }
  choices.push(new inquirer.Separator());
  choices.push(backChoice());
  return choices;
}

export async function askFont() {
  const { font } = await inquirer.prompt([
    {
      type: 'list',
      name: 'font',
      message: t('font_label'),
      pageSize: 16,
      choices: fontChoices(),
      default: 'Standard',
    },
  ]);
  return font;
}

export async function askColorMode() {
  const { colorMode } = await inquirer.prompt([
    {
      type: 'list',
      name: 'colorMode',
      message: t('color_mode_label'),
      choices: [
        { name: t('color_single'), value: 'single' },
        { name: t('color_gradient'), value: 'gradient' },
        { name: t('color_rainbow'), value: 'rainbow' },
        { name: t('color_pastel'), value: 'pastel' },
        { name: t('color_neon'), value: 'neon' },
        new inquirer.Separator(),
        backChoice(),
      ],
    },
  ]);
  return colorMode;
}

export async function askColors(colorMode) {
  const colors = [];
  if (colorMode === 'single') {
    const { c1 } = await inquirer.prompt([
      { type: 'input', name: 'c1', message: t('color_one'), default: t('color_one_default') },
    ]);
    colors.push(c1);
  } else if (colorMode === 'gradient' || colorMode === 'neon') {
    const { c1 } = await inquirer.prompt([
      { type: 'input', name: 'c1', message: t('color1_label'), default: '#ff3df1' },
    ]);
    const { c2 } = await inquirer.prompt([
      { type: 'input', name: 'c2', message: t('color2_label'), default: '#7b2dff' },
    ]);
    const { c3 } = await inquirer.prompt([
      { type: 'input', name: 'c3', message: t('color3_label'), default: '' },
    ]);
    colors.push(c1, c2);
    if (c3 && c3.trim()) colors.push(c3.trim());
  }
  return colors;
}

export async function askEffect() {
  const { effect } = await inquirer.prompt([
    {
      type: 'list',
      name: 'effect',
      message: t('effect_label'),
      choices: [
        { name: t('eff_none'), value: 'none' },
        { name: t('eff_box'), value: 'box' },
        { name: t('eff_double'), value: 'double' },
        { name: t('eff_rounded'), value: 'rounded' },
        { name: t('eff_shadow'), value: 'shadow' },
        { name: t('eff_glitch'), value: 'glitch' },
        new inquirer.Separator(),
        backChoice(),
      ],
    },
  ]);
  return effect;
}

export async function askAlignment() {
  const { alignment } = await inquirer.prompt([
    {
      type: 'list',
      name: 'alignment',
      message: t('align_label'),
      choices: [
        { name: t('align_left'), value: 'left' },
        { name: t('align_center'), value: 'center' },
        { name: t('align_right'), value: 'right' },
        new inquirer.Separator(),
        backChoice(),
      ],
      default: 'left',
    },
  ]);
  return alignment;
}

export async function askConfirm(message) {
  const { ok } = await inquirer.prompt([
    { type: 'confirm', name: 'ok', message: message || t('confirm_default'), default: true },
  ]);
  return ok;
}

export async function askExportLanguage() {
  const { listLanguages } = await import('./codegen.js');
  const langs = listLanguages();
  const { lang } = await inquirer.prompt([
    {
      type: 'list',
      name: 'lang',
      message: t('export_lang_ask'),
      pageSize: 12,
      choices: langs.map((l) => ({ name: l.label, value: l.value })),
    },
  ]);
  return lang;
}

export async function askExportVarName() {
  const { name } = await inquirer.prompt([
    {
      type: 'input',
      name: 'name',
      message: t('export_var_ask'),
      default: 'banner',
      validate: (v) => (/^[A-Za-z_][A-Za-z0-9_]*$/.test(v) ? true : 'Use letters, digits, underscore (no leading digit)'),
    },
  ]);
  return name;
}

export { showPreview };




