[prelude] this-directory this-file
[prelude] console-write console-print console-write

# module

```scheme
(require "fs")
(import-as fs "fs")

(include <path>)
(include <path> :only [<name> ...])
(include <path> :except [<name> ...])
```
