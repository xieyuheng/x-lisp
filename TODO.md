[prelude] `(file-read-sexp-list path)`
[prelude] `(file-write-sexp-list path list)`
[prelude] `(print value)`
[prelude] `(newline)`

# module

```scheme
(require "fs")
(import-as fs "fs")

(include <path>)
(include <path> :only [<name> ...])
(include <path> :except [<name> ...])
```
