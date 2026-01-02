import * as L from "../lisp/index.ts"
import { definePrimitive } from "../lisp/index.ts"

export function createBuiltinMod(): L.Mod {
  const url = new URL("builtin:")
  const mod = L.createMod(url, new Map())

  // int

  definePrimitive(mod, "int?", { arity: 1 })
  definePrimitive(mod, "ineg", { arity: 1 })
  definePrimitive(mod, "iadd", { arity: 2 })
  definePrimitive(mod, "isub", { arity: 2 })
  definePrimitive(mod, "imul", { arity: 2 })
  definePrimitive(mod, "idiv", { arity: 2 })
  definePrimitive(mod, "imod", { arity: 2 })
  definePrimitive(mod, "int-max", { arity: 2 })
  definePrimitive(mod, "int-min", { arity: 2 })
  definePrimitive(mod, "int-greater?", { arity: 2 })
  definePrimitive(mod, "int-less?", { arity: 2 })
  definePrimitive(mod, "int-greater-or-equal?", { arity: 2 })
  definePrimitive(mod, "int-less-or-equal?", { arity: 2 })
  definePrimitive(mod, "int-positive?", { arity: 1 })
  definePrimitive(mod, "int-non-negative?", { arity: 1 })
  definePrimitive(mod, "int-non-zero?", { arity: 1 })
  definePrimitive(mod, "int-compare-ascending", { arity: 2 })
  definePrimitive(mod, "int-compare-descending", { arity: 2 })
  definePrimitive(mod, "int-to-float", { arity: 1 })

  // float

  definePrimitive(mod, "float?", { arity: 1 })
  definePrimitive(mod, "fneg", { arity: 1 })
  definePrimitive(mod, "fadd", { arity: 2 })
  definePrimitive(mod, "fsub", { arity: 2 })
  definePrimitive(mod, "fmul", { arity: 2 })
  definePrimitive(mod, "fdiv", { arity: 2 })
  definePrimitive(mod, "fmod", { arity: 2 })
  definePrimitive(mod, "float-max", { arity: 2 })
  definePrimitive(mod, "float-min", { arity: 2 })
  definePrimitive(mod, "float-greater?", { arity: 2 })
  definePrimitive(mod, "float-less?", { arity: 2 })
  definePrimitive(mod, "float-greater-or-equal?", { arity: 2 })
  definePrimitive(mod, "float-less-or-equal?", { arity: 2 })
  definePrimitive(mod, "float-positive?", { arity: 1 })
  definePrimitive(mod, "float-non-negative?", { arity: 1 })
  definePrimitive(mod, "float-non-zero?", { arity: 1 })
  definePrimitive(mod, "float-compare-ascending", { arity: 2 })
  definePrimitive(mod, "float-compare-descending", { arity: 2 })
  definePrimitive(mod, "float-to-int", { arity: 1 })

  // bool

  // define_variable(mod, "true", x_true);
  // define_variable(mod, "false", x_false);
  definePrimitive(mod, "bool?", { arity: 1 })
  definePrimitive(mod, "not", { arity: 1 })

  // null

  // define_variable(mod, "null", x_null);
  definePrimitive(mod, "null?", { arity: 1 })

  // void

  // define_variable(mod, "void", x_void);
  definePrimitive(mod, "void?", { arity: 1 })

  // value

  definePrimitive(mod, "any?", { arity: 1 })
  definePrimitive(mod, "same?", { arity: 2 })
  definePrimitive(mod, "equal?", { arity: 2 })
  definePrimitive(mod, "hash-code", { arity: 1 })
  definePrimitive(mod, "total-compare", { arity: 2 })

  // console

  definePrimitive(mod, "newline", { arity: 0 })
  definePrimitive(mod, "write", { arity: 1 })
  definePrimitive(mod, "print", { arity: 1 })
  definePrimitive(mod, "println", { arity: 1 })

  // system

  definePrimitive(mod, "exit", { arity: 0 })

  // string

  definePrimitive(mod, "string?", { arity: 1 })
  definePrimitive(mod, "string-length", { arity: 1 })
  definePrimitive(mod, "string-empty?", { arity: 1 })
  definePrimitive(mod, "string-append", { arity: 2 })
  // (string-concat list)
  // (string-join separator list)
  // (string-chars string)
  // (string-compare-lexical x y)
  // (string-to-symbol string)

  // symbol

  definePrimitive(mod, "symbol?", { arity: 1 })
  definePrimitive(mod, "symbol-length", { arity: 1 })
  definePrimitive(mod, "symbol-to-string", { arity: 1 })
  definePrimitive(mod, "symbol-append", { arity: 2 })

  // hashtag

  definePrimitive(mod, "hashtag?", { arity: 1 })
  definePrimitive(mod, "hashtag-length", { arity: 1 })
  definePrimitive(mod, "hashtag-to-string", { arity: 1 })
  definePrimitive(mod, "hashtag-append", { arity: 2 })

  // list

  definePrimitive(mod, "make-list", { arity: 0 })
  definePrimitive(mod, "any-list?", { arity: 1 })
  definePrimitive(mod, "list-copy", { arity: 1 })
  definePrimitive(mod, "list-length", { arity: 1 })
  definePrimitive(mod, "list-empty?", { arity: 1 })
  definePrimitive(mod, "list-pop!", { arity: 1 })
  definePrimitive(mod, "list-push!", { arity: 2 })
  definePrimitive(mod, "list-push", { arity: 2 })
  definePrimitive(mod, "list-shift!", { arity: 1 })
  definePrimitive(mod, "list-unshift!", { arity: 2 })
  definePrimitive(mod, "list-get", { arity: 2 })
  definePrimitive(mod, "list-put!", { arity: 3 })
  definePrimitive(mod, "list-put", { arity: 3 })
  definePrimitive(mod, "car", { arity: 1 })
  definePrimitive(mod, "cdr", { arity: 1 })
  definePrimitive(mod, "cons", { arity: 2 })
  definePrimitive(mod, "list-head", { arity: 1 })
  definePrimitive(mod, "list-tail", { arity: 1 })
  definePrimitive(mod, "list-init", { arity: 1 })
  definePrimitive(mod, "list-last", { arity: 1 })
  definePrimitive(mod, "list-reverse!", { arity: 1 })
  definePrimitive(mod, "list-reverse", { arity: 1 })

  // record

  definePrimitive(mod, "make-record", { arity: 0 })
  definePrimitive(mod, "any-record?", { arity: 1 })
  definePrimitive(mod, "record-copy", { arity: 1 })
  definePrimitive(mod, "record-length", { arity: 1 })
  definePrimitive(mod, "record-empty?", { arity: 1 })
  definePrimitive(mod, "record-get", { arity: 2 })
  definePrimitive(mod, "record-has?", { arity: 2 })
  definePrimitive(mod, "record-put!", { arity: 3 })
  definePrimitive(mod, "record-put", { arity: 3 })
  definePrimitive(mod, "record-delete!", { arity: 2 })
  definePrimitive(mod, "record-delete", { arity: 2 })
  definePrimitive(mod, "record-append", { arity: 2 })
  definePrimitive(mod, "record-keys", { arity: 1 })
  definePrimitive(mod, "record-values", { arity: 1 })
  definePrimitive(mod, "record-entries", { arity: 1 })

  // hash

  definePrimitive(mod, "make-hash", { arity: 0 })
  definePrimitive(mod, "any-hash?", { arity: 1 })
  definePrimitive(mod, "hash-copy", { arity: 1 })
  definePrimitive(mod, "hash-length", { arity: 1 })
  definePrimitive(mod, "hash-empty?", { arity: 1 })
  definePrimitive(mod, "hash-get", { arity: 2 })
  definePrimitive(mod, "hash-has?", { arity: 2 })
  definePrimitive(mod, "hash-put!", { arity: 3 })
  definePrimitive(mod, "hash-put", { arity: 3 })
  definePrimitive(mod, "hash-delete!", { arity: 2 })
  definePrimitive(mod, "hash-delete", { arity: 2 })
  definePrimitive(mod, "hash-keys", { arity: 1 })
  definePrimitive(mod, "hash-values", { arity: 1 })
  definePrimitive(mod, "hash-entries", { arity: 1 })

  // set

  definePrimitive(mod, "make-set", { arity: 0 })
  definePrimitive(mod, "any-set?", { arity: 1 })
  definePrimitive(mod, "set-copy", { arity: 1 })
  definePrimitive(mod, "set-size", { arity: 1 })
  definePrimitive(mod, "set-empty?", { arity: 1 })
  definePrimitive(mod, "set-member?", { arity: 2 })
  definePrimitive(mod, "set-add!", { arity: 2 })
  definePrimitive(mod, "set-add", { arity: 2 })
  definePrimitive(mod, "set-delete!", { arity: 2 })
  definePrimitive(mod, "set-delete", { arity: 2 })
  definePrimitive(mod, "set-clear!", { arity: 1 })
  definePrimitive(mod, "set-union", { arity: 2 })
  definePrimitive(mod, "set-inter", { arity: 2 })
  definePrimitive(mod, "set-difference", { arity: 2 })
  definePrimitive(mod, "set-subset?", { arity: 2 })
  definePrimitive(mod, "set-disjoint?", { arity: 2 })
  definePrimitive(mod, "set-to-list", { arity: 1 })

  // random
  definePrimitive(mod, "random-dice", { arity: 0 })

  return mod
}
