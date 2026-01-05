import * as L from "../lisp/index.ts"
import { declarePrimitive } from "../lisp/index.ts"

export function createBuiltinMod(): L.Mod {
  const url = new URL("builtin:")
  const mod = L.createMod(url, new Map())

  // int

  declarePrimitive(mod, "int?", { arity: 1 })
  declarePrimitive(mod, "ineg", { arity: 1 })
  declarePrimitive(mod, "iadd", { arity: 2 })
  declarePrimitive(mod, "isub", { arity: 2 })
  declarePrimitive(mod, "imul", { arity: 2 })
  declarePrimitive(mod, "idiv", { arity: 2 })
  declarePrimitive(mod, "imod", { arity: 2 })
  declarePrimitive(mod, "int-max", { arity: 2 })
  declarePrimitive(mod, "int-min", { arity: 2 })
  declarePrimitive(mod, "int-greater?", { arity: 2 })
  declarePrimitive(mod, "int-less?", { arity: 2 })
  declarePrimitive(mod, "int-greater-or-equal?", { arity: 2 })
  declarePrimitive(mod, "int-less-or-equal?", { arity: 2 })
  declarePrimitive(mod, "int-positive?", { arity: 1 })
  declarePrimitive(mod, "int-non-negative?", { arity: 1 })
  declarePrimitive(mod, "int-non-zero?", { arity: 1 })
  declarePrimitive(mod, "int-compare-ascending", { arity: 2 })
  declarePrimitive(mod, "int-compare-descending", { arity: 2 })
  declarePrimitive(mod, "int-to-float", { arity: 1 })

  // float

  declarePrimitive(mod, "float?", { arity: 1 })
  declarePrimitive(mod, "fneg", { arity: 1 })
  declarePrimitive(mod, "fadd", { arity: 2 })
  declarePrimitive(mod, "fsub", { arity: 2 })
  declarePrimitive(mod, "fmul", { arity: 2 })
  declarePrimitive(mod, "fdiv", { arity: 2 })
  declarePrimitive(mod, "fmod", { arity: 2 })
  declarePrimitive(mod, "float-max", { arity: 2 })
  declarePrimitive(mod, "float-min", { arity: 2 })
  declarePrimitive(mod, "float-greater?", { arity: 2 })
  declarePrimitive(mod, "float-less?", { arity: 2 })
  declarePrimitive(mod, "float-greater-or-equal?", { arity: 2 })
  declarePrimitive(mod, "float-less-or-equal?", { arity: 2 })
  declarePrimitive(mod, "float-positive?", { arity: 1 })
  declarePrimitive(mod, "float-non-negative?", { arity: 1 })
  declarePrimitive(mod, "float-non-zero?", { arity: 1 })
  declarePrimitive(mod, "float-compare-ascending", { arity: 2 })
  declarePrimitive(mod, "float-compare-descending", { arity: 2 })
  declarePrimitive(mod, "float-to-int", { arity: 1 })

  // bool

  // define_variable(mod, "true", x_true);
  // define_variable(mod, "false", x_false);
  declarePrimitive(mod, "bool?", { arity: 1 })
  declarePrimitive(mod, "not", { arity: 1 })

  // null

  // define_variable(mod, "null", x_null);
  declarePrimitive(mod, "null?", { arity: 1 })

  // void

  // define_variable(mod, "void", x_void);
  declarePrimitive(mod, "void?", { arity: 1 })

  // value

  declarePrimitive(mod, "any?", { arity: 1 })
  declarePrimitive(mod, "same?", { arity: 2 })
  declarePrimitive(mod, "equal?", { arity: 2 })
  declarePrimitive(mod, "hash-code", { arity: 1 })
  declarePrimitive(mod, "total-compare", { arity: 2 })

  // console

  declarePrimitive(mod, "newline", { arity: 0 })
  declarePrimitive(mod, "write", { arity: 1 })
  declarePrimitive(mod, "print", { arity: 1 })
  declarePrimitive(mod, "println", { arity: 1 })

  // system

  declarePrimitive(mod, "exit", { arity: 0 })

  // string

  declarePrimitive(mod, "string?", { arity: 1 })
  declarePrimitive(mod, "string-length", { arity: 1 })
  declarePrimitive(mod, "string-empty?", { arity: 1 })
  declarePrimitive(mod, "string-append", { arity: 2 })
  // (string-concat list)
  // (string-join separator list)
  // (string-chars string)
  // (string-compare-lexical x y)
  // (string-to-symbol string)

  // symbol

  declarePrimitive(mod, "symbol?", { arity: 1 })
  declarePrimitive(mod, "symbol-length", { arity: 1 })
  declarePrimitive(mod, "symbol-to-string", { arity: 1 })
  declarePrimitive(mod, "symbol-append", { arity: 2 })

  // hashtag

  declarePrimitive(mod, "hashtag?", { arity: 1 })
  declarePrimitive(mod, "hashtag-length", { arity: 1 })
  declarePrimitive(mod, "hashtag-to-string", { arity: 1 })
  declarePrimitive(mod, "hashtag-append", { arity: 2 })

  // list

  declarePrimitive(mod, "make-list", { arity: 0 })
  declarePrimitive(mod, "any-list?", { arity: 1 })
  declarePrimitive(mod, "list-copy", { arity: 1 })
  declarePrimitive(mod, "list-length", { arity: 1 })
  declarePrimitive(mod, "list-empty?", { arity: 1 })
  declarePrimitive(mod, "list-pop!", { arity: 1 })
  declarePrimitive(mod, "list-push!", { arity: 2 })
  declarePrimitive(mod, "list-push", { arity: 2 })
  declarePrimitive(mod, "list-shift!", { arity: 1 })
  declarePrimitive(mod, "list-unshift!", { arity: 2 })
  declarePrimitive(mod, "list-get", { arity: 2 })
  declarePrimitive(mod, "list-put!", { arity: 3 })
  declarePrimitive(mod, "list-put", { arity: 3 })
  declarePrimitive(mod, "car", { arity: 1 })
  declarePrimitive(mod, "cdr", { arity: 1 })
  declarePrimitive(mod, "cons", { arity: 2 })
  declarePrimitive(mod, "list-head", { arity: 1 })
  declarePrimitive(mod, "list-tail", { arity: 1 })
  declarePrimitive(mod, "list-init", { arity: 1 })
  declarePrimitive(mod, "list-last", { arity: 1 })
  declarePrimitive(mod, "list-reverse!", { arity: 1 })
  declarePrimitive(mod, "list-reverse", { arity: 1 })

  // record

  declarePrimitive(mod, "make-record", { arity: 0 })
  declarePrimitive(mod, "any-record?", { arity: 1 })
  declarePrimitive(mod, "record-copy", { arity: 1 })
  declarePrimitive(mod, "record-length", { arity: 1 })
  declarePrimitive(mod, "record-empty?", { arity: 1 })
  declarePrimitive(mod, "record-get", { arity: 2 })
  declarePrimitive(mod, "record-has?", { arity: 2 })
  declarePrimitive(mod, "record-put!", { arity: 3 })
  declarePrimitive(mod, "record-put", { arity: 3 })
  declarePrimitive(mod, "record-delete!", { arity: 2 })
  declarePrimitive(mod, "record-delete", { arity: 2 })
  declarePrimitive(mod, "record-append", { arity: 2 })
  declarePrimitive(mod, "record-keys", { arity: 1 })
  declarePrimitive(mod, "record-values", { arity: 1 })
  declarePrimitive(mod, "record-entries", { arity: 1 })

  // hash

  declarePrimitive(mod, "make-hash", { arity: 0 })
  declarePrimitive(mod, "any-hash?", { arity: 1 })
  declarePrimitive(mod, "hash-copy", { arity: 1 })
  declarePrimitive(mod, "hash-length", { arity: 1 })
  declarePrimitive(mod, "hash-empty?", { arity: 1 })
  declarePrimitive(mod, "hash-get", { arity: 2 })
  declarePrimitive(mod, "hash-has?", { arity: 2 })
  declarePrimitive(mod, "hash-put!", { arity: 3 })
  declarePrimitive(mod, "hash-put", { arity: 3 })
  declarePrimitive(mod, "hash-delete!", { arity: 2 })
  declarePrimitive(mod, "hash-delete", { arity: 2 })
  declarePrimitive(mod, "hash-keys", { arity: 1 })
  declarePrimitive(mod, "hash-values", { arity: 1 })
  declarePrimitive(mod, "hash-entries", { arity: 1 })

  // set

  declarePrimitive(mod, "make-set", { arity: 0 })
  declarePrimitive(mod, "any-set?", { arity: 1 })
  declarePrimitive(mod, "set-copy", { arity: 1 })
  declarePrimitive(mod, "set-size", { arity: 1 })
  declarePrimitive(mod, "set-empty?", { arity: 1 })
  declarePrimitive(mod, "set-member?", { arity: 2 })
  declarePrimitive(mod, "set-add!", { arity: 2 })
  declarePrimitive(mod, "set-add", { arity: 2 })
  declarePrimitive(mod, "set-delete!", { arity: 2 })
  declarePrimitive(mod, "set-delete", { arity: 2 })
  declarePrimitive(mod, "set-clear!", { arity: 1 })
  declarePrimitive(mod, "set-union", { arity: 2 })
  declarePrimitive(mod, "set-inter", { arity: 2 })
  declarePrimitive(mod, "set-difference", { arity: 2 })
  declarePrimitive(mod, "set-subset?", { arity: 2 })
  declarePrimitive(mod, "set-disjoint?", { arity: 2 })
  declarePrimitive(mod, "set-to-list", { arity: 1 })

  // random
  declarePrimitive(mod, "random-dice", { arity: 0 })

  return mod
}
