# type system

`modExempt`
`setupExempt`

remove `(define-type)`

# optional type vs maybe type

[lisp] remove `NullValue`

functions currently return `NullValue`:

```scheme
hash-get
list-pop!
list-unshift!
```

# any type

[lisp] rename `AnyType` to `TypeType` -- used for type definitions

# type checking

[lisp] `typeCheck` -- handle `Tuple`
[lisp] `typeCheck` -- handle `Object`

[lisp] `typeInfer` -- handle `Tuple`
[lisp] `typeInfer` -- handle `Object`

# cond

[lisp] `(cond)` should not be desugared to `(assert false)` -- use `(error)` instead
[lisp] `desugar` -- keep `meta` of `Exp`

# pattern match

compile `(match)` to `(which)`

# tuple

tuple-cons
tuple-head
tuple-tail
