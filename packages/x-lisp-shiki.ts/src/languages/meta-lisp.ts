import type { LanguageInput } from "shiki"

import {
  alternation,
  commentRule,
  name,
  numberRule,
  qualifiedName,
  stringRule,
} from "../shared/regexp.ts"

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

const builtinConstants = ["true", "false", "void", "真", "假", "空", "空值"]

const valueDefinitionKeywords = [
  "define",
  "定义",
  "claim",
  "声明",
  "claim-type",
  "声明类型",
  "define-test",
  "定义测试",
  "admit",
  "承认",
  "declare-primitive-function",
  "声明基本函数",
  "declare-primitive-variable",
  "声明基本变量",
]

const typeDefinitionKeywords = [
  "define-type",
  "定义类型",
  "define-enum",
  "定义枚举",
  "define-struct",
  "定义结构",
  "define-struct-type",
  "定义结构类型",
  "define-opaque-type",
  "定义黑盒类型",
  "define-algebraic-type",
  "定义代数类型",
]

export const MetaLisp = {
  name: "meta-lisp",
  scopeName: "source.meta-lisp",
  fileTypes: [".meta"],

  patterns: [
    { include: "#comments" },
    { include: "#strings" },
    { include: "#value-definitions" },
    { include: "#type-definitions" },
    { include: "#module-declarations" },
    { include: "#at-comment" },
    { include: "#at-forms" },
    { include: "#special-forms" },
    { include: "#cond-else" },
    { include: "#quoted-symbols" },
    { include: "#keywords" },
    { include: "#builtin-constants" },
    { include: "#module-prefix" },
    { include: "#types" },
    { include: "#numbers" },
  ],

  repository: {
    comments: commentRule("meta-lisp"),
    strings: stringRule("meta-lisp"),

    // (define foo ...)
    // (define (foo args...) ...)
    // (claim foo ...)
    // (声明 foo ...)
    "value-definitions": {
      match: String.raw`(\()\s*(${alternation(valueDefinitionKeywords)})(?=\s)\s*(?:\(\s*)?(${qualifiedName})`,
      captures: {
        "1": { name: "punctuation.section.list.begin.meta-lisp" },
        "2": { name: "keyword.control.meta-lisp" },
        "3": { name: "entity.name.function.meta-lisp" },
      },
    },

    // (define-type point-t ...)
    // (define-struct (pair-t A B) ...)
    // (定义枚举 exp-t ...)
    "type-definitions": {
      match: String.raw`(\()\s*(${alternation(typeDefinitionKeywords)})(?=\s)\s*(?:\(\s*)?(${qualifiedName})`,
      captures: {
        "1": { name: "punctuation.section.list.begin.meta-lisp" },
        "2": { name: "keyword.control.meta-lisp" },
        "3": { name: "entity.name.type.meta-lisp" },
      },
    },

    // (module sample) / (模块 示例)
    "module-declarations": {
      match: String.raw`(\()\s*(module|模块)(?=\s)\s*(${qualifiedName})`,
      captures: {
        "1": { name: "punctuation.section.list.begin.meta-lisp" },
        "2": { name: "keyword.control.meta-lisp" },
        "3": { name: "entity.name.namespace.meta-lisp" },
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

    // else / 否则 in cond clauses
    "cond-else": {
      match: String.raw`(?<!${name})(else|否则)(?!${name})`,
      name: "keyword.control.meta-lisp",
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

    numbers: numberRule("meta-lisp"),
  },
} satisfies LanguageInput

export default MetaLisp
