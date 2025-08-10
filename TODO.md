`Definition` should not use own or not to test public, just use `isPublic`

[prelude] `aboutModule` -- `(current-module-directory)` `(current-module-file)` -- be `PrimitiveThunk`
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
