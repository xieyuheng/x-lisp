`(define)` support `Thunk`

`PrimitiveThunk` as `Value`
[prelude] `(current-working-directory)` -- be `PrimitiveThunk`

`Definition` should not use own or not to test public, just use `isPublic`

[prelude] `(current-directory)` `(current-file)` -- be `PrimitiveThunk`
[prelude] `aboutPath` -- `(path-join [path ...])`
[prelude] `format-sexp`

[prelude] `print` and `println` for value
[prelude] `write` for string

# module

support re-export by `include`

```scheme
(include <path>)
(include <path> :only [<name> ...])
(include <path> :except [<name> ...])
```
