[prelude] `aboutFile` -- `(print value)` `(println value)` `(newline)`
[prelude] this-directory this-file
[prelude] `aboutFile` -- `(file-write path list)`

# module

```scheme
(require "fs")
(import-as fs "fs")

(include <path>)
(include <path> :only [<name> ...])
(include <path> :except [<name> ...])
```
