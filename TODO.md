[prelude] `aboutFile` -- `(file-read path)` -- remove `file-read-sexp-list`
[prelude] this-directory this-file
[prelude] `aboutFile` -- `(print value)`
[prelude] `aboutFile` -- `(newline)`
[prelude] `aboutFile` -- `(file-write path list)`

# module

```scheme
(require "fs")
(import-as fs "fs")

(include <path>)
(include <path> :only [<name> ...])
(include <path> :except [<name> ...])
```
