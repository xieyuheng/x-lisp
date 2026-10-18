export type Lang = "zh" | "en"

// 输出语言 —— 使用者（运行编译器的人）偏好的语言，
// 由根包 `meta-package.json` 的 `language` 字段在 main.ts 中设置。
// 与 `Stmt.lang` 共用同一个 `Lang` 类型：两者值域相同，
// 但语义不同 —— `Stmt.lang` 是源码语言（写语句时用的语法），
// 在 desugar 后即被丢弃。
export let lang: Lang = "en"

export function setLang(value: Lang): void {
  lang = value
}

// 语法关键字与字面量的语言选择。
// 映射来自 docs/元语/中英对照表.md。
export function langKeyword(en: string, zh: string): string {
  if (lang === "zh") {
    return zh
  } else {
    return en
  }
}
