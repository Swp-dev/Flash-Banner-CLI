// xl chứ bố m dùng gg dịch...
const STRINGS = {
  en: {
    intro_tagline: 'modern ASCII banner generator',
    select_language: 'Select your language / Chọn ngôn ngữ của bạn:',
    lang_en: 'English',
    lang_vi: 'Tiếng Việt',
    back: '← Back',
    text_label: 'Banner text:',
    text_validate: 'Please enter some text',
    mode_label: 'How would you like to style it?',
    mode_quick: 'Quick — pick a preset',
    mode_advanced: 'Advanced — customize everything',
    preset_label: 'Choose a preset:',
    font_label: 'Choose a font:',
    font_preview: 'Font preview',
    color_mode_label: 'Color mode:',
    color_single: 'Single color',
    color_gradient: 'Gradient (2–3 colors)',
    color_rainbow: 'Rainbow',
    color_pastel: 'Pastel',
    color_neon: 'Neon (bold + bright)',
    color_one: 'Color (name or #hex):',
    color_one_default: 'cyan',
    color1_label: 'Color 1 (required):',
    color2_label: 'Color 2 (required):',
    color3_label: 'Color 3 (optional, blank to skip):',
    effect_label: 'Effect:',
    eff_none: 'None',
    eff_box: 'Box (simple +--+)',
    eff_double: 'Box (double ╔══╗)',
    eff_rounded: 'Box (rounded ╭──╮)',
    eff_shadow: 'Shadow',
    eff_glitch: 'Glitch',
    align_label: 'Alignment:',
    align_left: 'Left',
    align_center: 'Center',
    align_right: 'Right',
    confirm_default: 'Looks good?',
    spinner: 'Generating banner...',
    success: 'Banner generated successfully',
    width_warn: (w, c) =>
      `⚠  Banner width is ${w} columns but your terminal is ${c}. The output may wrap. Try a smaller font (Standard, Small, Mini) or shorter text.`,
    export_ask: 'Export to a code file?',
    export_lang_ask: 'Choose the output language:',
    export_var_ask: 'Variable / constant name:',
    wrote: '✔ Wrote:',
    err_unknown_preset: (p) => `Unknown preset: ${p}`,
    err_config: (m) => `Could not read config: ${m}`,
  },
  vi: {
    intro_tagline: 'trình tạo biểu ngữ ASCII hiện đại',
    select_language: 'Select your language / Chọn ngôn ngữ của bạn:',
    lang_en: 'English',
    lang_vi: 'Tiếng Việt',
    back: '← Quay lại',
    text_label: 'Nội dung biểu ngữ:',
    text_validate: 'Vui lòng nhập nội dung',
    mode_label: 'Bạn muốn tạo kiểu như thế nào?',
    mode_quick: 'Nhanh — chọn mẫu có sẵn',
    mode_advanced: 'Nâng cao — tuỳ chỉnh mọi thứ',
    preset_label: 'Chọn một mẫu:',
    font_label: 'Chọn một phông chữ:',
    font_preview: 'Xem trước phông chữ',
    color_mode_label: 'Chế độ màu:',
    color_single: 'Một màu',
    color_gradient: 'Chuyển màu (2–3 màu)',
    color_rainbow: 'Cầu vồng',
    color_pastel: 'Pastel',
    color_neon: 'Neon (đậm + sáng rực)',
    color_one: 'Màu (tên hoặc mã #hex):',
    color_one_default: 'cyan',
    color1_label: 'Màu 1 (bắt buộc):',
    color2_label: 'Màu 2 (bắt buộc):',
    color3_label: 'Màu 3 (tuỳ chọn, để trống để bỏ qua):',
    effect_label: 'Hiệu ứng:',
    eff_none: 'Không',
    eff_box: 'Khung (đơn giản +--+)',
    eff_double: 'Khung (đôi ╔══╗)',
    eff_rounded: 'Khung (bo tròn ╭──╮)',
    eff_shadow: 'Đổ bóng',
    eff_glitch: 'Nhiễu (Glitch)',
    align_label: 'Căn lề:',
    align_left: 'Trái',
    align_center: 'Giữa',
    align_right: 'Phải',
    confirm_default: 'Trông ổn chứ?',
    spinner: 'Đang tạo biểu ngữ...',
    success: 'Đã tạo biểu ngữ thành công',
    width_warn: (w, c) =>
      `⚠  Biểu ngữ rộng ${w} cột nhưng cửa sổ của bạn chỉ ${c} cột. Nội dung có thể bị xuống dòng. Hãy thử phông nhỏ hơn (Standard, Small, Mini) hoặc rút gọn nội dung.`,
    export_ask: 'Xuất ra tệp mã nguồn?',
    export_lang_ask: 'Chọn ngôn ngữ xuất ra:',
    export_var_ask: 'Tên biến / hằng số:',
    wrote: '✔ Đã ghi:',
    err_unknown_preset: (p) => `Không tìm thấy mẫu: ${p}`,
    err_config: (m) => `Không đọc được tệp cấu hình: ${m}`,
  },
};

let currentLang = 'en';

export function setLang(lang) {
  if (STRINGS[lang]) currentLang = lang;
}

export function getLang() {
  return currentLang;
}

export function t(key, ...args) {
  const v = STRINGS[currentLang]?.[key] ?? STRINGS.en[key] ?? key;
  return typeof v === 'function' ? v(...args) : v;
}

export const BACK = Symbol('BACK');
export function isBack(v) {
  return v === BACK;
}
