import type { LanguageInput } from "shiki"

const escapeRegExp = (value: string) =>
  value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")

const alternation = (values: string[]) => values.map(escapeRegExp).join("|")

// Keep these lists in sync with
// /home/xyh/.emacs.d/deps/meta-lisp-mode/meta-lisp-font-lock.el.
const specialForms = [
  "define",
  "lambda",
  "let",
  "letrec",
  "if",
  "cond",
  "when",
  "unless",
  "and",
  "or",
  "else",
  "begin",
  "match",
  "multi-match",
  "=",
  "module",
  "import",
  "import-as",
  "import-all",
  "private",
  "exempt",
  "claim",
  "claim-type",
  "admit",
  "the",
  "all",
  "->",
  "define-algebraic-type",
  "define-struct",
  "define-struct-type",
  "define-enum",
  "define-type",
  "define-opaque-type",
  "define-test",
  "declare-primitive-function",
  "declare-primitive-variable",
  "assert",
  "assert-not",
  "assert-equal",
  "assert-not-equal",
  // Chinese counterparts
  "定义",
  "定义测试",
  "定义类型",
  "定义枚举",
  "定义代数类型",
  "定义结构",
  "定义结构类型",
  "定义黑盒类型",
  "声明",
  "声明类型",
  "承认",
  "声明基本函数",
  "声明基本变量",
  "模块",
  "导入",
  "导入为",
  "全导入",
  "私有",
  "免检",
  "函",
  "若",
  "若则",
  "当",
  "除非",
  "且",
  "或",
  "循序",
  "令",
  "递归令",
  "匹配",
  "多元匹配",
  "型例",
  "泛型",
  "否则",
]

const atForms = [
  "@list",
  "@set",
  "@hash",
  "@quote",
  "@sexp",
  "@text",
  "@array",
  "@列表",
  "@集合",
  "@散列",
  "@文本",
  "@引用",
  "@符号算式",
  "@数组",
]

const builtinConstants = ["true", "false", "void", "真", "假", "空"]

const valueDefinitionKeywords = [
  "define",
  "定义",
  "claim",
  "声明",
  "define-test",
  "定义测试",
  "claim-type",
  "声明类型",
  "admit",
  "承认",
  "declare-primitive-function",
  "声明基本函数",
  "declare-primitive-variable",
  "声明基本变量",
]

// Meta-lisp symbols may contain a wide range of punctuation, but not
// parentheses, quotes, semicolons, or whitespace.
const name = String.raw`[\p{L}\p{N}_$%&*+\-.<=>!?@#|]+`
const qualifiedName = String.raw`${name}(?:/${name})*`

export const MetaLisp = {
  name: "meta-lisp",
  scopeName: "source.meta-lisp",
  fileTypes: [".meta"],
  // VitePress loads `languageAlias` values as bundled Shiki language
  // names. Aliases for this custom grammar therefore live here.
  aliases: ["basic-lisp", "xvm-lisp", "x86-lisp"],

  patterns: [
    { include: "#comments" },
    { include: "#strings" },
    { include: "#definitions" },
    { include: "#at-comment" },
    { include: "#at-forms" },
    { include: "#special-forms" },
    { include: "#quoted-symbols" },
    { include: "#keywords" },
    { include: "#builtin-constants" },
    { include: "#module-prefix" },
    { include: "#types" },
    { include: "#numbers" },
  ],

  repository: {
    comments: {
      match: ";.*$",
      name: "comment.line.semicolon.meta-lisp",
    },

    strings: {
      begin: '"',
      end: '"',
      name: "string.quoted.double.meta-lisp",
      patterns: [
        {
          match: String.raw`\\.`,
          name: "constant.character.escape.meta-lisp",
        },
      ],
    },

    // (define foo ...)
    // (define (foo args...) ...)
    // (claim foo ...)
    // (声明 foo ...)
    definitions: {
      match: String.raw`(\()\s*(${alternation(valueDefinitionKeywords)})(?=\s)\s*(?:\(\s*)?(${qualifiedName})`,
      captures: {
        "1": { name: "punctuation.section.list.begin.meta-lisp" },
        "2": { name: "keyword.control.meta-lisp" },
        "3": { name: "entity.name.function.meta-lisp" },
      },
    },

    // (@comment ...) / (@注释 ...)
    "at-comment": {
      match: String.raw`(\()\s*(@comment|@注释)(?=[\s)])`,
      captures: {
        "1": { name: "punctuation.section.list.begin.meta-lisp" },
        "2": { name: "comment.block.meta-lisp" },
      },
    },

    // (@list ...) / (@列表 ...)
    "at-forms": {
      match: String.raw`(\()\s*(${alternation(atForms)})(?=[\s)])`,
      captures: {
        "1": { name: "punctuation.section.list.begin.meta-lisp" },
        "2": { name: "keyword.other.at-form.meta-lisp" },
      },
    },

    // Highlight special forms only in list-head position.
    "special-forms": {
      match: String.raw`(\()\s*(${alternation(specialForms)})(?=[\s)])`,
      captures: {
        "1": { name: "punctuation.section.list.begin.meta-lisp" },
        "2": { name: "keyword.control.meta-lisp" },
      },
    },

    // 'foo / 'text-t
    "quoted-symbols": {
      match: String.raw`'${qualifiedName}`,
      name: "constant.other.symbol.meta-lisp",
    },

    // :host / :端口
    keywords: {
      match: String.raw`:${name}`,
      name: "constant.other.keyword.meta-lisp",
    },

    "builtin-constants": {
      match: String.raw`(?<!${name})(?:${alternation(builtinConstants)})(?!${name})`,
      name: "support.constant.meta-lisp",
    },

    // module/name / 内置/列表长度
    "module-prefix": {
      match: String.raw`(?<!${name})${name}/`,
      name: "entity.name.namespace.meta-lisp",
    },

    // int-t / 整数型
    types: {
      match: String.raw`(?<!${name})(?:${qualifiedName}-t|${qualifiedName}型)(?!${name})`,
      name: "entity.name.type.meta-lisp",
    },

    numbers: {
      match: String.raw`(?<!${name})-?\d+(?:\.\d+)?(?!${name})`,
      name: "constant.numeric.meta-lisp",
    },
  },
} satisfies LanguageInput
