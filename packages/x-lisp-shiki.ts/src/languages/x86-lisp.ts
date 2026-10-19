import type { LanguageInput } from "shiki"

import {
  alternation,
  commentRule,
  name,
  numberRule,
  qualifiedName,
  stringRule,
} from "../shared/regexp.ts"

const formKeywords = [
  "define-code",
  "define-data",
  "define-struct",
  "define-space",
]

const instructionNames = [
  "mov",
  "add",
  "or",
  "and",
  "sub",
  "xor",
  "cmp",
  "shl",
  "shr",
  "sar",
  "push",
  "pop",
  "call",
  "ret",
  "jmp",
  "j",
  "lea",
  "test",
  "imul",
  "idiv",
  "cqo",
  "nop",
  "syscall",
  "set",
  "movzx",
]

const operandForms = [
  "reg",
  "label",
  "address",
  "mem",
  "cc",
  "var",
  "extern",
  "fixup",
  "struct",
  "pointer",
  "array",
  "offset-of",
]

const sizes = ["byte", "word", "dword", "qword"]

const registers = [
  // 64-bit
  "rax",
  "rcx",
  "rdx",
  "rbx",
  "rsp",
  "rbp",
  "rsi",
  "rdi",
  "r8",
  "r9",
  "r10",
  "r11",
  "r12",
  "r13",
  "r14",
  "r15",
  // 32-bit
  "eax",
  "ecx",
  "edx",
  "ebx",
  "esp",
  "ebp",
  "esi",
  "edi",
  "r8d",
  "r9d",
  "r10d",
  "r11d",
  "r12d",
  "r13d",
  "r14d",
  "r15d",
  // 16-bit
  "ax",
  "cx",
  "dx",
  "bx",
  "sp",
  "bp",
  "si",
  "di",
  "r8w",
  "r9w",
  "r10w",
  "r11w",
  "r12w",
  "r13w",
  "r14w",
  "r15w",
  // 8-bit
  "al",
  "cl",
  "dl",
  "bl",
  "spl",
  "bpl",
  "sil",
  "dil",
  "r8b",
  "r9b",
  "r10b",
  "r11b",
  "r12b",
  "r13b",
  "r14b",
  "r15b",
  "ah",
  "ch",
  "dh",
  "bh",
]

const conditionCodes = [
  "o",
  "no",
  "b",
  "nae",
  "c",
  "ae",
  "nb",
  "nc",
  "e",
  "z",
  "ne",
  "nz",
  "be",
  "na",
  "a",
  "nbe",
  "s",
  "ns",
  "p",
  "pe",
  "np",
  "po",
  "l",
  "nge",
  "ge",
  "nl",
  "le",
  "ng",
  "g",
  "nle",
]

const builtinTypes = [
  "pointer-t",
  "int8-t",
  "int16-t",
  "int32-t",
  "int64-t",
  "uint8-t",
  "uint16-t",
  "uint32-t",
  "uint64-t",
  "string-t",
]

export const X86Lisp = {
  name: "x86-lisp",
  scopeName: "source.x86-lisp",
  fileTypes: [".x86"],

  patterns: [
    { include: "#comments" },
    { include: "#strings" },
    { include: "#function-definitions" },
    { include: "#type-definitions" },
    { include: "#variable-definitions" },
    { include: "#form-keywords" },
    { include: "#register-operands" },
    { include: "#condition-code-operands" },
    { include: "#memory-sizes" },
    { include: "#operand-forms" },
    { include: "#instructions" },
    { include: "#size-keywords" },
    { include: "#builtin-types" },
    { include: "#types" },
    { include: "#numbers" },
    { include: "#labels" },
  ],

  repository: {
    comments: commentRule("x86-lisp"),
    strings: stringRule("x86-lisp"),

    // (define-code main ...)
    "function-definitions": {
      match: String.raw`(\()\s*(define-code)(?=\s)\s*(${qualifiedName})`,
      captures: {
        "1": { name: "punctuation.section.list.begin.x86-lisp" },
        "2": { name: "keyword.control.x86-lisp" },
        "3": { name: "entity.name.function.x86-lisp" },
      },
    },

    // (define-struct point-t ...)
    "type-definitions": {
      match: String.raw`(\()\s*(define-struct)(?=\s)\s*(${qualifiedName})`,
      captures: {
        "1": { name: "punctuation.section.list.begin.x86-lisp" },
        "2": { name: "keyword.control.x86-lisp" },
        "3": { name: "entity.name.type.x86-lisp" },
      },
    },

    // (define-data origin ...) / (define-space buffer 4096)
    "variable-definitions": {
      match: String.raw`(\()\s*(define-data|define-space)(?=\s)\s*(${qualifiedName})`,
      captures: {
        "1": { name: "punctuation.section.list.begin.x86-lisp" },
        "2": { name: "keyword.control.x86-lisp" },
        "3": { name: "variable.other.constant.x86-lisp" },
      },
    },

    "form-keywords": {
      match: String.raw`(\()\s*(${alternation(formKeywords)})(?=[\s)])`,
      captures: {
        "1": { name: "punctuation.section.list.begin.x86-lisp" },
        "2": { name: "keyword.control.x86-lisp" },
      },
    },

    // (reg rax)
    "register-operands": {
      match: String.raw`(\()\s*(reg)(?=\s)\s*(${alternation(registers)})(?=[\s)])`,
      captures: {
        "1": { name: "punctuation.section.list.begin.x86-lisp" },
        "2": { name: "keyword.other.operand.x86-lisp" },
        "3": { name: "variable.language.register.x86-lisp" },
      },
    },

    // (cc g)
    "condition-code-operands": {
      match: String.raw`(\()\s*(cc)(?=\s)\s*(${alternation(conditionCodes)})(?=[\s)])`,
      captures: {
        "1": { name: "punctuation.section.list.begin.x86-lisp" },
        "2": { name: "keyword.other.operand.x86-lisp" },
        "3": { name: "constant.other.condition-code.x86-lisp" },
      },
    },

    // (mem byte ...)
    "memory-sizes": {
      match: String.raw`(\()\s*(mem)(?=\s)\s*(${alternation(sizes)})(?=[\s)])`,
      captures: {
        "1": { name: "punctuation.section.list.begin.x86-lisp" },
        "2": { name: "keyword.other.operand.x86-lisp" },
        "3": { name: "storage.modifier.size.x86-lisp" },
      },
    },

    // (label name) / (address name) / (var name) / (offset-of type ...)
    "operand-forms": {
      match: String.raw`(\()\s*(${alternation(operandForms)})(?=[\s)])`,
      captures: {
        "1": { name: "punctuation.section.list.begin.x86-lisp" },
        "2": { name: "keyword.other.operand.x86-lisp" },
      },
    },

    instructions: {
      match: String.raw`(\()\s*(${alternation(instructionNames)})(?=[\s)])`,
      captures: {
        "1": { name: "punctuation.section.list.begin.x86-lisp" },
        "2": { name: "support.function.x86-lisp" },
      },
    },

    "size-keywords": {
      match: String.raw`(?<!${name})(?:${alternation(sizes)})(?!${name})`,
      name: "storage.modifier.size.x86-lisp",
    },

    "builtin-types": {
      match: String.raw`(?<!${name})(?:${alternation(builtinTypes)})(?!${name})`,
      name: "entity.name.type.x86-lisp",
    },

    types: {
      match: String.raw`(?<!${name})${name}-t(?!${name})`,
      name: "entity.name.type.x86-lisp",
    },

    numbers: numberRule("x86-lisp"),

    // Bare symbols in code position are labels.
    labels: {
      match: String.raw`^\s*(${name})(?=\s*(?:;.*)?$)`,
      captures: {
        "1": { name: "entity.name.label.x86-lisp" },
      },
    },
  },
} satisfies LanguageInput

export default X86Lisp
