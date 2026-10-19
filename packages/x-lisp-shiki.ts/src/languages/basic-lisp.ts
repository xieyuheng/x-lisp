import type { LanguageInput } from "shiki"

import {
  alternation,
  commentRule,
  name,
  numberRule,
  qualifiedName,
  stringRule,
} from "../shared/regexp.ts"

const formKeywords = ["block", "=", "->"]

const functionDefinitionKeywords = [
  "claim",
  "define-function",
  "extern-function",
]

const variableDefinitionKeywords = ["define-variable", "extern-variable"]

const instructionNames = [
  // binary operations
  "iadd",
  "isub",
  "imul",
  "idiv",
  "fadd",
  "fsub",
  "fmul",
  "fdiv",
  "shl",
  "shr",
  "bitand",
  "bitor",
  "bitxor",
  "padd",
  "and",
  "or",
  "xor",
  // comparisons
  "icmp-eq",
  "icmp-ne",
  "icmp-lt",
  "icmp-le",
  "icmp-gt",
  "icmp-ge",
  "fcmp-eq",
  "fcmp-ne",
  "fcmp-lt",
  "fcmp-le",
  "fcmp-gt",
  "fcmp-ge",
  "bool-eq",
  "bool-ne",
  "pointer-eq",
  "pointer-ne",
  "value-eq",
  "value-ne",
  // unary operations
  "not",
  "tag-int",
  "tag-float",
  "tag-bool",
  "to-int64",
  "to-float64",
  "to-bool",
  "copy",
  // literals and constants
  "int64",
  "float64",
  "bool",
  "address",
  "symbol",
  "string",
  "symbol-value",
  "text-value",
  // memory
  "load",
  "store",
  "size-of",
  "offset-of",
  // control flow
  "return",
  "goto",
  "branch",
  // calls
  "call",
  "tail-call",
  "apply",
  "tail-apply",
  "argument",
  // dynamic value operations
  "use",
  "provide",
]

const dataForms = ["address", "struct", "pointer", "array"]

const builtinTypes = [
  "int64-t",
  "float64-t",
  "bool-t",
  "void-t",
  "pointer-t",
  "value-t",
]

export const BasicLisp = {
  name: "basic-lisp",
  scopeName: "source.basic-lisp",
  fileTypes: [".basic"],

  patterns: [
    { include: "#comments" },
    { include: "#strings" },
    { include: "#function-definitions" },
    { include: "#variable-definitions" },
    { include: "#struct-definitions" },
    { include: "#form-keywords" },
    { include: "#boolean-forms" },
    { include: "#data-forms" },
    { include: "#instructions" },
    { include: "#attributes" },
    { include: "#builtin-types" },
    { include: "#types" },
    { include: "#numbers" },
    { include: "#labels" },
  ],

  repository: {
    comments: commentRule("basic-lisp"),
    strings: stringRule("basic-lisp"),

    // (define-function (foo args...) ...)
    // (claim foo <type>)
    "function-definitions": {
      match: String.raw`(\()\s*(${alternation(functionDefinitionKeywords)})(?=\s)\s*(?:\(\s*)?(${qualifiedName})`,
      captures: {
        "1": { name: "punctuation.section.list.begin.basic-lisp" },
        "2": { name: "keyword.control.basic-lisp" },
        "3": { name: "entity.name.function.basic-lisp" },
      },
    },

    // (define-variable foo ...) / (extern-variable foo)
    "variable-definitions": {
      match: String.raw`(\()\s*(${alternation(variableDefinitionKeywords)})(?=\s)\s*(${qualifiedName})`,
      captures: {
        "1": { name: "punctuation.section.list.begin.basic-lisp" },
        "2": { name: "keyword.control.basic-lisp" },
        "3": { name: "variable.other.constant.basic-lisp" },
      },
    },

    // (define-struct point-t (x int64-t) ...)
    "struct-definitions": {
      match: String.raw`(\()\s*(define-struct)(?=\s)\s*(${qualifiedName})`,
      captures: {
        "1": { name: "punctuation.section.list.begin.basic-lisp" },
        "2": { name: "keyword.control.basic-lisp" },
        "3": { name: "entity.name.type.basic-lisp" },
      },
    },

    // (block body ...) / (= output (op ...)) / (-> arg... ret)
    "form-keywords": {
      match: String.raw`(\()\s*(${alternation(formKeywords)})(?=[\s)])`,
      captures: {
        "1": { name: "punctuation.section.list.begin.basic-lisp" },
        "2": { name: "keyword.control.basic-lisp" },
      },
    },

    // (true) / (false)
    "boolean-forms": {
      match: String.raw`(\()\s*(true|false)(?=[\s)])`,
      captures: {
        "1": { name: "punctuation.section.list.begin.basic-lisp" },
        "2": { name: "support.constant.basic-lisp" },
      },
    },

    // (address name) / (struct name ...) / (pointer data) / (array data...)
    "data-forms": {
      match: String.raw`(\()\s*(${alternation(dataForms)})(?=[\s)])`,
      captures: {
        "1": { name: "punctuation.section.list.begin.basic-lisp" },
        "2": { name: "keyword.other.data.basic-lisp" },
      },
    },

    // Instruction heads, for example (iadd a b) and (branch cond ...).
    instructions: {
      match: String.raw`(\()\s*(${alternation(instructionNames)})(?=[\s)])`,
      captures: {
        "1": { name: "punctuation.section.list.begin.basic-lisp" },
        "2": { name: "support.function.basic-lisp" },
      },
    },

    // :index / :then-label / :type
    attributes: {
      match: String.raw`:${name}`,
      name: "constant.other.keyword.basic-lisp",
    },

    "builtin-types": {
      match: String.raw`(?<!${name})(?:${alternation(builtinTypes)})(?!${name})`,
      name: "entity.name.type.basic-lisp",
    },

    types: {
      match: String.raw`(?<!${name})${name}-t(?!${name})`,
      name: "entity.name.type.basic-lisp",
    },

    numbers: numberRule("basic-lisp"),

    // Basic blocks are introduced by labels, which are bare symbols.
    labels: {
      match: String.raw`^\s*(${name})(?=\s*(?:;.*)?$)`,
      captures: {
        "1": { name: "entity.name.label.basic-lisp" },
      },
    },
  },
} satisfies LanguageInput

export default BasicLisp
