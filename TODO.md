# error

learn from lisp and scheme error
`exit`
maybe just use combinnator and`(result? V E)` with `ok` and `error`

# tael

`list-get`
`list-set`
`record-get`
`record-set`

# match

`match` support tael

# composition

`compose` -- as a syntax keyword
`pipe` -- as a syntax keyword

# maybe

`(include)` -- support `:only` -- `(include <path> :only [<name> ...])`
`(include)` -- support `:except` -- `(include <path> :except [<name> ...])`
`(require)` -- support `:only` and `:except`
- if `(include)` support them, so should `(require)`
