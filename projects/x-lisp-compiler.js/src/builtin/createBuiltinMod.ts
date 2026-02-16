import * as L from "../lisp/index.ts"
import {
  declarePrimitiveFunction,
  declarePrimitiveVariable,
} from "../lisp/index.ts"

export function createBuiltinMod(): L.Mod {
  const url = new URL("builtin:")
  const mod = L.createMod(url, new Map())

  // int

  declarePrimitiveFunction(mod, "int?", { arity: 1 })
  declarePrimitiveFunction(mod, "ineg", { arity: 1 })
  declarePrimitiveFunction(mod, "iadd", { arity: 2 })
  declarePrimitiveFunction(mod, "isub", { arity: 2 })
  declarePrimitiveFunction(mod, "imul", { arity: 2 })
  declarePrimitiveFunction(mod, "idiv", { arity: 2 })
  declarePrimitiveFunction(mod, "imod", { arity: 2 })
  declarePrimitiveFunction(mod, "int-max", { arity: 2 })
  declarePrimitiveFunction(mod, "int-min", { arity: 2 })
  declarePrimitiveFunction(mod, "int-greater?", { arity: 2 })
  declarePrimitiveFunction(mod, "int-less?", { arity: 2 })
  declarePrimitiveFunction(mod, "int-greater-or-equal?", { arity: 2 })
  declarePrimitiveFunction(mod, "int-less-or-equal?", { arity: 2 })
  declarePrimitiveFunction(mod, "int-positive?", { arity: 1 })
  declarePrimitiveFunction(mod, "int-non-negative?", { arity: 1 })
  declarePrimitiveFunction(mod, "int-non-zero?", { arity: 1 })
  declarePrimitiveFunction(mod, "int-compare-ascending", { arity: 2 })
  declarePrimitiveFunction(mod, "int-compare-descending", { arity: 2 })
  declarePrimitiveFunction(mod, "int-to-float", { arity: 1 })

  // float

  declarePrimitiveFunction(mod, "float?", { arity: 1 })
  declarePrimitiveFunction(mod, "fneg", { arity: 1 })
  declarePrimitiveFunction(mod, "fadd", { arity: 2 })
  declarePrimitiveFunction(mod, "fsub", { arity: 2 })
  declarePrimitiveFunction(mod, "fmul", { arity: 2 })
  declarePrimitiveFunction(mod, "fdiv", { arity: 2 })
  declarePrimitiveFunction(mod, "fmod", { arity: 2 })
  declarePrimitiveFunction(mod, "float-max", { arity: 2 })
  declarePrimitiveFunction(mod, "float-min", { arity: 2 })
  declarePrimitiveFunction(mod, "float-greater?", { arity: 2 })
  declarePrimitiveFunction(mod, "float-less?", { arity: 2 })
  declarePrimitiveFunction(mod, "float-greater-or-equal?", { arity: 2 })
  declarePrimitiveFunction(mod, "float-less-or-equal?", { arity: 2 })
  declarePrimitiveFunction(mod, "float-positive?", { arity: 1 })
  declarePrimitiveFunction(mod, "float-non-negative?", { arity: 1 })
  declarePrimitiveFunction(mod, "float-non-zero?", { arity: 1 })
  declarePrimitiveFunction(mod, "float-compare-ascending", { arity: 2 })
  declarePrimitiveFunction(mod, "float-compare-descending", { arity: 2 })
  declarePrimitiveFunction(mod, "float-to-int", { arity: 1 })

  // bool

  declarePrimitiveVariable(mod, "true")
  declarePrimitiveVariable(mod, "false")
  declarePrimitiveFunction(mod, "bool?", { arity: 1 })
  declarePrimitiveFunction(mod, "not", { arity: 1 })

  // null

  declarePrimitiveVariable(mod, "null")
  declarePrimitiveFunction(mod, "null?", { arity: 1 })

  // void

  declarePrimitiveVariable(mod, "void")
  declarePrimitiveFunction(mod, "void?", { arity: 1 })

  // value

  declarePrimitiveFunction(mod, "any?", { arity: 1 })
  declarePrimitiveFunction(mod, "same?", { arity: 2 })
  declarePrimitiveFunction(mod, "equal?", { arity: 2 })
  declarePrimitiveFunction(mod, "hash-code", { arity: 1 })
  declarePrimitiveFunction(mod, "total-compare", { arity: 2 })

  // console

  declarePrimitiveFunction(mod, "newline", { arity: 0 })
  declarePrimitiveFunction(mod, "write", { arity: 1 })
  declarePrimitiveFunction(mod, "print", { arity: 1 })
  declarePrimitiveFunction(mod, "println", { arity: 1 })

  // system

  declarePrimitiveFunction(mod, "exit", { arity: 0 })

  // string

  declarePrimitiveFunction(mod, "string?", { arity: 1 })
  declarePrimitiveFunction(mod, "string-length", { arity: 1 })
  declarePrimitiveFunction(mod, "string-empty?", { arity: 1 })
  declarePrimitiveFunction(mod, "string-append", { arity: 2 })
  declarePrimitiveFunction(mod, "string-concat", { arity: 1 })
  declarePrimitiveFunction(mod, "string-join", { arity: 2 })
  declarePrimitiveFunction(mod, "string-compare-lexical", { arity: 2 })
  declarePrimitiveFunction(mod, "string-to-symbol", { arity: 1 })

  // symbol

  declarePrimitiveFunction(mod, "symbol?", { arity: 1 })
  declarePrimitiveFunction(mod, "symbol-length", { arity: 1 })
  declarePrimitiveFunction(mod, "symbol-to-string", { arity: 1 })
  declarePrimitiveFunction(mod, "symbol-append", { arity: 2 })
  declarePrimitiveFunction(mod, "symbol-concat", { arity: 1 })

  // hashtag

  declarePrimitiveFunction(mod, "hashtag?", { arity: 1 })
  declarePrimitiveFunction(mod, "hashtag-length", { arity: 1 })
  declarePrimitiveFunction(mod, "hashtag-to-string", { arity: 1 })
  declarePrimitiveFunction(mod, "hashtag-append", { arity: 2 })
  declarePrimitiveFunction(mod, "hashtag-concat", { arity: 1 })

  // list

  declarePrimitiveFunction(mod, "make-list", { arity: 0 })
  declarePrimitiveFunction(mod, "any-list?", { arity: 1 })
  declarePrimitiveFunction(mod, "list-copy", { arity: 1 })
  declarePrimitiveFunction(mod, "list-length", { arity: 1 })
  declarePrimitiveFunction(mod, "list-empty?", { arity: 1 })
  declarePrimitiveFunction(mod, "list-pop!", { arity: 1 })
  declarePrimitiveFunction(mod, "list-push!", { arity: 2 })
  declarePrimitiveFunction(mod, "list-push", { arity: 2 })
  declarePrimitiveFunction(mod, "list-shift!", { arity: 1 })
  declarePrimitiveFunction(mod, "list-unshift!", { arity: 2 })
  declarePrimitiveFunction(mod, "list-get", { arity: 2 })
  declarePrimitiveFunction(mod, "list-put!", { arity: 3 })
  declarePrimitiveFunction(mod, "list-put", { arity: 3 })
  declarePrimitiveFunction(mod, "car", { arity: 1 })
  declarePrimitiveFunction(mod, "cdr", { arity: 1 })
  declarePrimitiveFunction(mod, "cons", { arity: 2 })
  declarePrimitiveFunction(mod, "list-head", { arity: 1 })
  declarePrimitiveFunction(mod, "list-tail", { arity: 1 })
  declarePrimitiveFunction(mod, "list-init", { arity: 1 })
  declarePrimitiveFunction(mod, "list-last", { arity: 1 })
  declarePrimitiveFunction(mod, "list-reverse!", { arity: 1 })
  declarePrimitiveFunction(mod, "list-reverse", { arity: 1 })

  // record

  declarePrimitiveFunction(mod, "make-record", { arity: 0 })
  declarePrimitiveFunction(mod, "any-record?", { arity: 1 })
  declarePrimitiveFunction(mod, "record-copy", { arity: 1 })
  declarePrimitiveFunction(mod, "record-length", { arity: 1 })
  declarePrimitiveFunction(mod, "record-empty?", { arity: 1 })
  declarePrimitiveFunction(mod, "record-get", { arity: 2 })
  declarePrimitiveFunction(mod, "record-has?", { arity: 2 })
  declarePrimitiveFunction(mod, "record-put!", { arity: 3 })
  declarePrimitiveFunction(mod, "record-put", { arity: 3 })
  declarePrimitiveFunction(mod, "record-delete!", { arity: 2 })
  declarePrimitiveFunction(mod, "record-delete", { arity: 2 })
  declarePrimitiveFunction(mod, "record-append", { arity: 2 })
  declarePrimitiveFunction(mod, "record-keys", { arity: 1 })
  declarePrimitiveFunction(mod, "record-values", { arity: 1 })
  declarePrimitiveFunction(mod, "record-entries", { arity: 1 })

  // hash

  declarePrimitiveFunction(mod, "make-hash", { arity: 0 })
  declarePrimitiveFunction(mod, "any-hash?", { arity: 1 })
  declarePrimitiveFunction(mod, "hash-copy", { arity: 1 })
  declarePrimitiveFunction(mod, "hash-length", { arity: 1 })
  declarePrimitiveFunction(mod, "hash-empty?", { arity: 1 })
  declarePrimitiveFunction(mod, "hash-get", { arity: 2 })
  declarePrimitiveFunction(mod, "hash-has?", { arity: 2 })
  declarePrimitiveFunction(mod, "hash-put!", { arity: 3 })
  declarePrimitiveFunction(mod, "hash-put", { arity: 3 })
  declarePrimitiveFunction(mod, "hash-delete!", { arity: 2 })
  declarePrimitiveFunction(mod, "hash-delete", { arity: 2 })
  declarePrimitiveFunction(mod, "hash-keys", { arity: 1 })
  declarePrimitiveFunction(mod, "hash-values", { arity: 1 })
  declarePrimitiveFunction(mod, "hash-entries", { arity: 1 })

  // set

  declarePrimitiveFunction(mod, "make-set", { arity: 0 })
  declarePrimitiveFunction(mod, "any-set?", { arity: 1 })
  declarePrimitiveFunction(mod, "set-copy", { arity: 1 })
  declarePrimitiveFunction(mod, "set-size", { arity: 1 })
  declarePrimitiveFunction(mod, "set-empty?", { arity: 1 })
  declarePrimitiveFunction(mod, "set-member?", { arity: 2 })
  declarePrimitiveFunction(mod, "set-add!", { arity: 2 })
  declarePrimitiveFunction(mod, "set-add", { arity: 2 })
  declarePrimitiveFunction(mod, "set-delete!", { arity: 2 })
  declarePrimitiveFunction(mod, "set-delete", { arity: 2 })
  declarePrimitiveFunction(mod, "set-clear!", { arity: 1 })
  declarePrimitiveFunction(mod, "set-union", { arity: 2 })
  declarePrimitiveFunction(mod, "set-inter", { arity: 2 })
  declarePrimitiveFunction(mod, "set-difference", { arity: 2 })
  declarePrimitiveFunction(mod, "set-subset?", { arity: 2 })
  declarePrimitiveFunction(mod, "set-disjoint?", { arity: 2 })
  declarePrimitiveFunction(mod, "set-to-list", { arity: 1 })

  // random

  declarePrimitiveFunction(mod, "random-dice", { arity: 0 })

  // assert

  declarePrimitiveFunction(mod, "assert", { arity: 1 })
  declarePrimitiveFunction(mod, "assert-not", { arity: 1 })
  declarePrimitiveFunction(mod, "assert-equal", { arity: 2 })
  declarePrimitiveFunction(mod, "assert-not-equal", { arity: 2 })

  // schema

  declarePrimitiveFunction(mod, "valid?", { arity: 2 })

  return mod
}
