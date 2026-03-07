# type checking

[lisp] `typeCheck` -- handle `Tuple`
[lisp] `typeCheck` -- handle `Object`

[lisp] `typeInfer` -- handle `Tuple`
[lisp] `typeInfer` -- handle `Object`

# optional type vs maybe type

[lisp] remove `NullValue`

functions currently return `NullValue`:

```scheme
hash-get
list-pop!
list-unshift!
```

# any type

[lisp] remove any type

[lisp] type eliminator apply to any type should return any type

- https://chat.deepseek.com/a/chat/s/a05d91f5-b301-445f-b736-f8e6c04729a1

# cond

[lisp] `(cond)` should not be desugared to `(assert false)` -- use `(error)` instead
[lisp] `desugar` -- keep `meta` of `Exp`

# pattern match

compile `(match)` to `(which)`

# tuple

tuple-cons
tuple-head
tuple-tail
