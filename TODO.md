[prelude] `aboutModule` -- `(current-module-directory)` `(current-module-file)` -- be `PrimitiveThunk`

- this group of definitions are not part of prelude mod
- `load` call `aboutModule`

[prelude] `aboutPath` -- `(path-join [path ...])`
[prelude] `aboutSexp` -- `format-sexp`
[prelude] `aboutConsole` -- `print` and `println` for value

# module

support re-export by `include`

```scheme
(include <path>)
(include <path> :only [<name> ...])
(include <path> :except [<name> ...])
```
