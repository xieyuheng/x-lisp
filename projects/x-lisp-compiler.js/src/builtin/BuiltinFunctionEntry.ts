export type BuiltinFunctionEntry = {
  arity: number
}

export const builtinFunctionEntries: Record<string, BuiltinFunctionEntry> = {
  // int

  "int?": { arity: 1 },
  ineg: { arity: 1 },
  iadd: { arity: 2 },
  isub: { arity: 2 },
  imul: { arity: 2 },
  idiv: { arity: 2 },
  imod: { arity: 2 },
  "int-max": { arity: 2 },
  "int-min": { arity: 2 },
  "int-greater?": { arity: 2 },
  "int-less?": { arity: 2 },
  "int-greater-or-equal?": { arity: 2 },
  "int-less-or-equal?": { arity: 2 },
  "int-positive?": { arity: 1 },
  "int-non-negative?": { arity: 1 },
  "int-non-zero?": { arity: 1 },
  "int-compare-ascending": { arity: 2 },
  "int-compare-descending": { arity: 2 },
  "int-to-float": { arity: 1 },

  // float

  "float?": { arity: 1 },
  fneg: { arity: 1 },
  fadd: { arity: 2 },
  fsub: { arity: 2 },
  fmul: { arity: 2 },
  fdiv: { arity: 2 },
  fmod: { arity: 2 },
  "float-max": { arity: 2 },
  "float-min": { arity: 2 },
  "float-greater?": { arity: 2 },
  "float-less?": { arity: 2 },
  "float-greater-or-equal?": { arity: 2 },
  "float-less-or-equal?": { arity: 2 },
  "float-positive?": { arity: 1 },
  "float-non-negative?": { arity: 1 },
  "float-non-zero?": { arity: 1 },
  "float-compare-ascending": { arity: 2 },
  "float-compare-descending": { arity: 2 },
  "float-to-int": { arity: 1 },

  // bool

  // define_variable(mod, "true", x_true);
  // define_variable(mod, "false", x_false);
  "bool?": { arity: 1 },
  not: { arity: 1 },

  // null

  // define_variable(mod, "null", x_null);
  "null?": { arity: 1 },

  // void

  // define_variable(mod, "void", x_void);
  "void?": { arity: 1 },

  // value

  "any?": { arity: 1 },
  "same?": { arity: 2 },
  "equal?": { arity: 2 },
  "hash-code": { arity: 1 },
  "total-compare": { arity: 2 },

  // console

  newline: { arity: 0 },
  write: { arity: 1 },
  print: { arity: 1 },
  println: { arity: 1 },
  "println-non-void": { arity: 1 },

  // system

  exit: { arity: 0 },

  // string

  "string?": { arity: 1 },
  "string-length": { arity: 1 },
  "string-empty?": { arity: 1 },
  "string-append": { arity: 2 },
  // (string-concat list)
  // (string-join separator list)
  // (string-chars string)
  // (string-compare-lexical x y)
  // (string-to-symbol string)

  // symbol

  "symbol?": { arity: 1 },
  "symbol-length": { arity: 1 },
  "symbol-to-string": { arity: 1 },
  "symbol-append": { arity: 2 },

  // hashtag

  "hashtag?": { arity: 1 },
  "hashtag-length": { arity: 1 },
  "hashtag-to-string": { arity: 1 },
  "hashtag-append": { arity: 2 },

  // list

  "make-list": { arity: 0 },
  "any-list?": { arity: 1 },
  "list-copy": { arity: 1 },
  "list-length": { arity: 1 },
  "list-empty?": { arity: 1 },
  "list-pop!": { arity: 1 },
  "list-push!": { arity: 2 },
  "list-push": { arity: 2 },
  "list-shift!": { arity: 1 },
  "list-unshift!": { arity: 2 },
  "list-get": { arity: 2 },
  "list-put!": { arity: 3 },
  "list-put": { arity: 3 },
  car: { arity: 1 },
  cdr: { arity: 1 },
  cons: { arity: 2 },
  "list-head": { arity: 1 },
  "list-tail": { arity: 1 },
  "list-init": { arity: 1 },
  "list-last": { arity: 1 },
  "list-reverse!": { arity: 1 },
  "list-reverse": { arity: 1 },

  // record

  "make-record": { arity: 0 },
  "any-record?": { arity: 1 },
  "record-copy": { arity: 1 },
  "record-length": { arity: 1 },
  "record-empty?": { arity: 1 },
  "record-get": { arity: 2 },
  "record-has?": { arity: 2 },
  "record-put!": { arity: 3 },
  "record-put": { arity: 3 },
  "record-delete!": { arity: 2 },
  "record-delete": { arity: 2 },
  "record-append": { arity: 2 },
  "record-keys": { arity: 1 },
  "record-values": { arity: 1 },
  "record-entries": { arity: 1 },

  // hash

  "make-hash": { arity: 0 },
  "any-hash?": { arity: 1 },
  "hash-copy": { arity: 1 },
  "hash-length": { arity: 1 },
  "hash-empty?": { arity: 1 },
  "hash-get": { arity: 2 },
  "hash-has?": { arity: 2 },
  "hash-put!": { arity: 3 },
  "hash-put": { arity: 3 },
  "hash-delete!": { arity: 2 },
  "hash-delete": { arity: 2 },
  "hash-keys": { arity: 1 },
  "hash-values": { arity: 1 },
  "hash-entries": { arity: 1 },

  // set

  "make-set": { arity: 0 },
  "any-set?": { arity: 1 },
  "set-copy": { arity: 1 },
  "set-size": { arity: 1 },
  "set-empty?": { arity: 1 },
  "set-member?": { arity: 2 },
  "set-add!": { arity: 2 },
  "set-add": { arity: 2 },
  "set-delete!": { arity: 2 },
  "set-delete": { arity: 2 },
  "set-clear!": { arity: 1 },
  "set-union": { arity: 2 },
  "set-inter": { arity: 2 },
  "set-difference": { arity: 2 },
  "set-subset?": { arity: 2 },
  "set-disjoint?": { arity: 2 },
  "set-to-list": { arity: 1 },

  // random
  "random-dice": { arity: 0 },
}
