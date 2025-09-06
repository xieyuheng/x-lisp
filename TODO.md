# predicate

`(enum)` -- build predicate

# testing

`(assert)` -- with optional info
`the` -- as `Exp` for better error report
`(assert-the)` -- like `(the)` but return `void`

# module

error on redefined to different `Definition` by `(import)` or `(include)`
test about redefine -- `(import)` or `(include)` same `Definition` is ok

# file system

rename `(file-read path)` to `(file-get path)`
rename `(file-write text path)` to `(file-set! path text)`

use `file-open` and `file-close`

`file-read-string`
`file-write-string`
