#!/usr/bin/env node
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import chalk from 'chalk';
import ora from 'ora';
import gradient from 'gradient-string';
chalk.level = Math.max(chalk.level, 3);
import {
  askLanguage,
  askText,
  askMode,
  askPreset,
  askFont,
  askColorMode,
  askColors,
  askEffect,
  askAlignment,
  askConfirm,
  askExportLanguage,
  askExportVarName,
  showPreview,
} from './prompt.js';
import { renderBanner, warnIfTooWide } from './preview.js';
import { getPreset } from './preset.js';
import { exportBannerAsCode } from './file.js';
import { LANGUAGES } from './codegen.js';
import { setLang, t, isBack } from './i18n.js';

function parseArgs(argv) {
  const args = {
    _: [],
    style: null,
    font: null,
    color: null,
    effect: null,
    align: null,
    config: null,
    export: false,
    help: false,
    lang: null,
  };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--help' || a === '-h') args.help = true;
    else if (a === '--style' || a === '-s') args.style = argv[++i];
    else if (a === '--font' || a === '-f') args.font = argv[++i];
    else if (a === '--color' || a === '-c') args.color = argv[++i];
    else if (a === '--effect' || a === '-e') args.effect = argv[++i];
    else if (a === '--align' || a === '-a') args.align = argv[++i];
    else if (a === '--config') args.config = argv[++i];
    else if (a === '--lang' || a === '-l') args.lang = argv[++i];
    else if (a === '--export') args.export = true;
    else if (a === '--export-lang') args.exportLang = argv[++i];
    else if (a === '--export-var') args.exportVar = argv[++i];
    else args._.push(a);
  }
  return args;
}

function printHelp() {
  const banner = gradient(['#ff3df1', '#7b2dff'])('banner-cli');
  console.log(`
${banner} — modern ASCII banner generator

${chalk.bold('Usage')}
  banner-cli                          Interactive mode
  banner-cli "TEXT"                   Quick interactive with text preset
  banner-cli "TEXT" --style hacker    Apply preset directly
  banner-cli "TEXT" --font Slant --color "#ff00ff,#00ffff" --effect box

${chalk.bold('Options')}
  --lang, -l    Language: en | vi (skips interactive language picker)
  --style, -s   Preset name (hacker, neon, retro, minimal, glitch, ocean, fire)
  --font, -f    Figlet font name
  --color, -c   Color(s), comma-separated. 1=single, 2-3=gradient
  --effect, -e  none | box | double | rounded | shadow | glitch
  --align, -a   left | center | right
  --config        Path to a banner.config.json
  --export        Export the colored banner as a code file
  --export-lang   Output language for --export (default: javascript)
                  Supported: ${Object.keys(LANGUAGES).join(', ')}
  --export-var    Variable / constant name in the exported file (default: banner)
  --help, -h      Show this help
`);
}

async function loadConfigFile(p) {
  const full = path.resolve(process.cwd(), p);
  const data = await readFile(full, 'utf8');
  return JSON.parse(data);
}

function configFromFlags(args) {
  if (!args.font && !args.color && !args.effect && !args.align) return null;
  const colors = args.color ? args.color.split(',').map((c) => c.trim()).filter(Boolean) : ['white'];
  const mode = colors.length >= 2 ? 'gradient' : 'single';
  return {
    font: args.font || 'Standard',
    color: { mode, colors },
    effect: args.effect || 'none',
    alignment: args.align || 'left',
  };
}

async function runInteractive(initialText) {
  let state = initialText ? 'MODE' : 'TEXT';
  let text = initialText || 'hello';
  let mode = null;
  let font = null;
  let colorMode = null;
  let colors = [];
  let effect = null;
  let alignment = null;

  while (true) {
    if (state === 'TEXT') {
      text = await askText(text);
      state = 'MODE';
    } else if (state === 'MODE') {
      const m = await askMode();
      if (isBack(m)) {
        state = initialText ? 'MODE' : 'TEXT';
        if (initialText) {
          // No previous step to go back to — re-ask mode
          continue;
        }
        continue;
      }
      mode = m;
      state = mode === 'quick' ? 'QUICK_PRESET' : 'ADV_FONT';
    } else if (state === 'QUICK_PRESET') {
      const p = await askPreset();
      if (isBack(p)) {
        state = 'MODE';
        continue;
      }
      return p;
    } else if (state === 'ADV_FONT') {
      const f = await askFont();
      if (isBack(f)) {
        state = 'MODE';
        continue;
      }
      font = f;
      await showPreview(
        text,
        { font, color: { mode: 'single', colors: ['white'] }, effect: 'none', alignment: 'left' },
        `${t('font_preview')}: ${font}`,
      );
      state = 'ADV_COLOR_MODE';
    } else if (state === 'ADV_COLOR_MODE') {
      const cm = await askColorMode();
      if (isBack(cm)) {
        state = 'ADV_FONT';
        continue;
      }
      colorMode = cm;
      state = 'ADV_COLORS';
    } else if (state === 'ADV_COLORS') {
      colors = await askColors(colorMode);
      state = 'ADV_EFFECT';
    } else if (state === 'ADV_EFFECT') {
      const e = await askEffect();
      if (isBack(e)) {
        state = 'ADV_COLOR_MODE';
        continue;
      }
      effect = e;
      state = 'ADV_ALIGN';
    } else if (state === 'ADV_ALIGN') {
      const a = await askAlignment();
      if (isBack(a)) {
        state = 'ADV_EFFECT';
        continue;
      }
      alignment = a;
      return {
        font,
        color: { mode: colorMode, colors },
        effect,
        alignment,
      };
    }
  }
}

async function run() {
  const args = parseArgs(process.argv.slice(2));
  if (args.help) {
    printHelp();
    return;
  }

  if (args.lang) {
    setLang(args.lang);
  } else if (process.stdout.isTTY && !args.style && !args.font && !args.config) {
    await askLanguage();
  }

  const intro = gradient(['#ff3df1', '#7b2dff', '#00d4ff'])('✦ banner-cli ✦');
  console.log('\n' + intro + chalk.gray('  ' + t('intro_tagline') + '\n'));

  const cliText = args._[0];

  let config = null;
  let text = cliText;

  if (args.config) {
    try {
      config = await loadConfigFile(args.config);
    } catch (err) {
      console.log(chalk.red(t('err_config', err.message)));
      process.exitCode = 1;
      return;
    }
    if (!text) text = await askText('hello');
  } else if (args.style) {
    const preset = getPreset(args.style);
    if (!preset) {
      console.log(chalk.red(t('err_unknown_preset', args.style)));
      process.exitCode = 1;
      return;
    }
    config = preset;
    if (!text) text = await askText('hello');
  } else {
    const flagConfig = configFromFlags(args);
    if (flagConfig) {
      config = flagConfig;
      if (!text) text = await askText('hello');
    } else {
      if (!text && process.stdout.isTTY) {
        text = await askText('hello');
      } else if (!text) {
        text = 'hello';
      }
      config = await runInteractive(text);
    }
  }

  const spinner = ora({ text: t('spinner'), spinner: 'dots' }).start();
  const { colored, asciiWidth } = await renderBanner(text, config);
  spinner.succeed(t('success'));

  console.log('');
  console.log(colored);
  console.log('');
  warnIfTooWide(asciiWidth);

  let shouldExport = args.export;
  let exportLang = args.exportLang || null;
  let exportVar = args.exportVar || 'banner';

  if (!shouldExport && process.stdout.isTTY) {
    shouldExport = await askConfirm(t('export_ask'));
  }

  if (shouldExport) {
    if (!exportLang && process.stdout.isTTY) {
      exportLang = await askExportLanguage();
      exportVar = await askExportVarName();
    }
    if (!exportLang) exportLang = 'javascript';
    if (!LANGUAGES[exportLang]) {
      console.log(
        chalk.red(`Unsupported export language: ${exportLang}. Supported: ${Object.keys(LANGUAGES).join(', ')}`),
      );
      process.exitCode = 1;
      return;
    }
    const filePath = await exportBannerAsCode({
      coloredBanner: colored,
      language: exportLang,
      varName: exportVar,
    });
    console.log(chalk.green(t('wrote')));
    console.log('  ' + chalk.cyan(filePath) + chalk.gray(`  (${LANGUAGES[exportLang].label})`));
  }
}

run().catch((err) => {
  console.error(chalk.red('\nError:'), err?.message ?? err);
  process.exit(1);
});


