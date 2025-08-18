# match

> `match` support tael

`matchAttributes`
`match` support `TaelPattern`
`patternize` support `TaelPattern`

> `match` support atom

`LiteralPattern`

> `match` support quoted sexp

# composition

`compose/fn` -- like `union/fn` and `inter/fn`
`compose` -- as a syntax keyword
`pipe` -- as a syntax keyword

# maybe

`(include)` -- support `:only` -- `(include <path> :only [<name> ...])`
`(include)` -- support `:except` -- `(include <path> :except [<name> ...])`
`(require)` -- support `:only` and `:except`
- if `(include)` support them, so should `(require)`
