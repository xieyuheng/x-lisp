test `(file-set! path text)`

# predicate

`(enum)` -- build predicate -- for `reg-name?` in eoc

# testing

`the` -- as `Exp` for better error report
`(assert-the)` -- like `(the)` but return `void`

# module

error on redefined to different `Definition` by `(import)` or `(include)`
test about redefine -- `(import)` or `(include)` same `Definition` is ok

# file system

use `file-open` and `file-close`

`file-read-string`
`file-write-string`
