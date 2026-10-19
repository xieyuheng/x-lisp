import type { LanguageInput } from "shiki"

import {
  alternation,
  commentRule,
  name,
  numberRule,
  qualifiedName,
  stringRule,
} from "../shared/regexp.ts"

const numberedInstructions = (prefix: string) =>
  Array.from({ length: 7 }, (_, index) => `${prefix}-${index}`)

const instructionNames = [
  "move",
  "load-int",
  "load-float",
  "load-string",
  "load-symbol",
  "load-closure",
  "make-closure",
  "store-closure-arg",
  "load-result",
  "load-global",
  "store-global",
  ...["call", "call-prim", "tail-call", "tail-call-prim"].flatMap(
    numberedInstructions,
  ),
  ...["apply", "tail-apply"].flatMap(numberedInstructions),
  "goto",
  "branch",
  "return",
  "return-void",
  "gc",
  "iadd",
  "isub",
  "imul",
  "idiv",
  "imod",
  "ineg",
  "int-greater",
  "int-less",
  "int-greater-or-equal",
  "int-less-or-equal",
  "int-is-positive",
  "int-is-non-negative",
  "int-is-non-zero",
  "fadd",
  "fsub",
  "fmul",
  "fdiv",
  "fneg",
  "float-greater",
  "float-less",
  "float-greater-or-equal",
  "float-less-or-equal",
  "float-is-positive",
  "float-is-non-negative",
  "float-is-non-zero",
]

const functionDefinitionKeywords = [
  "define-function",
  "declare-primitive-function",
]

const variableDefinitionKeywords = [
  "declare-variable",
  "declare-primitive-variable",
]

const operandForms = ["fn", "prim", "global", "label", "u16", "@quote"]

export const XvmLisp = {
  name: "xvm-lisp",
  scopeName: "source.xvm-lisp",
  fileTypes: [".xvm"],

  patterns: [
    { include: "#comments" },
    { include: "#strings" },
    { include: "#function-definitions" },
    { include: "#variable-definitions" },
    { include: "#instructions" },
    { include: "#operand-forms" },
    { include: "#quoted-symbols" },
    { include: "#numbers" },
    { include: "#labels" },
  ],

  repository: {
    comments: commentRule("xvm-lisp"),
    strings: stringRule("xvm-lisp"),

    // (define-function (foo args...) ...)
    // (declare-primitive-function foo)
    "function-definitions": {
      match: String.raw`(\()\s*(${alternation(functionDefinitionKeywords)})(?=\s)\s*(?:\(\s*)?(${qualifiedName})`,
      captures: {
        "1": { name: "punctuation.section.list.begin.xvm-lisp" },
        "2": { name: "keyword.control.xvm-lisp" },
        "3": { name: "entity.name.function.xvm-lisp" },
      },
    },

    // (declare-variable foo) / (declare-primitive-variable foo)
    "variable-definitions": {
      match: String.raw`(\()\s*(${alternation(variableDefinitionKeywords)})(?=\s)\s*(${qualifiedName})`,
      captures: {
        "1": { name: "punctuation.section.list.begin.xvm-lisp" },
        "2": { name: "keyword.control.xvm-lisp" },
        "3": { name: "variable.other.constant.xvm-lisp" },
      },
    },

    instructions: {
      match: String.raw`(\()\s*(${alternation(instructionNames)})(?=[\s)])`,
      captures: {
        "1": { name: "punctuation.section.list.begin.xvm-lisp" },
        "2": { name: "support.function.xvm-lisp" },
      },
    },

    // (fn name) / (prim name) / (global name) / (label name) / (u16 n)
    "operand-forms": {
      match: String.raw`(\()\s*(${alternation(operandForms)})(?=[\s)])`,
      captures: {
        "1": { name: "punctuation.section.list.begin.xvm-lisp" },
        "2": { name: "keyword.other.operand.xvm-lisp" },
      },
    },

    // 'foo
    "quoted-symbols": {
      match: String.raw`'${name}`,
      name: "constant.other.symbol.xvm-lisp",
    },

    numbers: numberRule("xvm-lisp"),

    // Bare symbols in instruction position are labels.
    labels: {
      match: String.raw`^\s*(${name})(?=\s*(?:;.*)?$)`,
      captures: {
        "1": { name: "entity.name.label.xvm-lisp" },
      },
    },
  },
} satisfies LanguageInput

export default XvmLisp
