[lisp] quit using `expPreferInfer` -- just try `typeInfer`
[lisp] `typeCheck` -- handle `Tuple`
[lisp] `typeCheck` -- handle `Object`
[lisp] `typeCheck` -- fix `List` case

# debug

[lisp] `(check-subtype)` as debug stmt

# type checking

[lisp] `typeInfer` -- handle `Tuple`
[lisp] avoid the use `any-t` in `builtin/index.lisp`

# pattern match

[diary] about how to implement pattern match

# any type

[lisp] fix the use of any type for functions like `equal?` and `assert-equal`
[lisp] maybe any type should generate a type variable

# optional type

[lisp] use `maybe-t` -- fix `builtin/index.lisp`
[lisp] remove `NullValue`

# later

[pass] `desugarCond` -- report `error` about mismatch -- instead of `assert`
