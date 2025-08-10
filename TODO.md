[prelude] `sexp?` -- with the help of `isSexp`

[prelude] `(file-read-sexp-list path)`
[prelude] `(file-write-sexp-list path list)`

[prelude] `(read-sexp-list path)`
[prelude] `(write-sexp-list/append path list)`

# module

```scheme
(require "fs")
(import-as fs "fs")

(include <path>)
(include <path> :only [<name> ...])
(include <path> :except [<name> ...])
```
