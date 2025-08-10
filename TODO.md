syntax error for zero argument lambda
`Thunk` as `Value`
`force` -- handle `Thunk`
[prelude] `(current-working-directory)` -- be thunk
[prelude] [maybe] `(current-module-directory)` `(current-module-file)` -- be thunk
[prelude] [maybe] `module-directory` `module-file` -- be string
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
