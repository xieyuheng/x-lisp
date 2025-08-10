syntax error for zero argument lambda
`Thunk` as `Value`
`force` -- handle `Thunk`
[prelude] `(current-working-directory)` -- be thunk

`Def` should not use own or not to test public, just use `isPublic`

[prelude] `(current-directory)` `(current-file)` -- be thunk
[prelude] `aboutPath` -- `(path-join [path ...])`
[prelude] `format-sexp`
[prelude] console-write console-print console-write

# module

support re-export by `include`

```scheme
(include <path>)
(include <path> :only [<name> ...])
(include <path> :except [<name> ...])
```
