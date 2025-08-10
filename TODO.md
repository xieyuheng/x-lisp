[diary] 2025-08-10-function-vs-thunk.md
[prelude] `(current-working-directory)` -- be thunk
[prelude] `(current-module-directory)` `(current-module-file)`
[prelude] `aboutPath` -- `(path-join [path ...])`
[prelude] console-write console-print console-write

# module

support re-export by `include`

```scheme
(include <path>)
(include <path> :only [<name> ...])
(include <path> :except [<name> ...])
```
