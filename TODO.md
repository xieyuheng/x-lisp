# tael

`record-get` -- take symbol
`record-set` -- take symbol

`RecordGet` as `Exp`
`:keyword` as function

# match

`match` support tael

# composition

`compose/fn` -- like `union/fn` and `inter/fn`
`compose` -- as a syntax keyword
`pipe` -- as a syntax keyword

# maybe

`(include)` -- support `:only` -- `(include <path> :only [<name> ...])`
`(include)` -- support `:except` -- `(include <path> :except [<name> ...])`
`(require)` -- support `:only` and `:except`
- if `(include)` support them, so should `(require)`
