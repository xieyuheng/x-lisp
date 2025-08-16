parse `#void`
examples/void

# optional

`aboutOptional` -- `null` and `null?`
`aboutOptional` -- `optional?`

# record

`record-empty?`
`record-get` -- take symbol
`record-has?` -- take symbol
`record-set` -- take symbol

`RecordGet` as `Exp`
`:keyword` as function

# match

`match` support tael
`match` support atom
`match` support quoted sexp

# composition

`compose/fn` -- like `union/fn` and `inter/fn`
`compose` -- as a syntax keyword
`pipe` -- as a syntax keyword

# maybe

`(include)` -- support `:only` -- `(include <path> :only [<name> ...])`
`(include)` -- support `:except` -- `(include <path> :except [<name> ...])`
`(require)` -- support `:only` and `:except`
- if `(include)` support them, so should `(require)`
