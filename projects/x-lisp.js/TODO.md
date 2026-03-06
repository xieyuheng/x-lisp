`loadDependencyGraph`

- fix the use of `loadModuleProject` -- `loadModuleProject` + `projectCheck` will check twice

# type checking

[lisp] `typeCheck` -- handle `Tuple`
[lisp] `typeCheck` -- handle `Object`

[lisp] `typeInfer` -- handle `Tuple`
[lisp] `typeInfer` -- handle `Object`

# builtin types

fix the type of `equal?` and `assert-equal` -- lhs and rhs should have the same type

# pattern match

[diary] about how to implement pattern match

# optional type vs maybe type

[lisp] use `maybe-t` -- fix `builtin/index.lisp`
[lisp] remove `NullValue`

functions currently return `NullValue`:

```scheme
hash-get
list-pop!
list-unshift!
```

# cond

[lisp] `(cond)` should not be desugared to `(assert false)` -- use `(error)` instead
[lisp] `desugar` -- keep `meta` of `Exp`

# any type

[lisp] type eliminator apply to any type should return any type

- https://chat.deepseek.com/a/chat/s/a05d91f5-b301-445f-b736-f8e6c04729a1

# tuple

tuple-cons
tuple-head
tuple-tail
