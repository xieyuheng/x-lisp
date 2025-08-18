# match

`patternize` -- `Atom` to `LiteralPattern`
test atom

`patternize` -- `Quote` to `LiteralPattern`
test quote

# match

`ConsStarPattern`
`match` -- handle `ConsStarPattern`
`patternize` -- `(cons)` to `ConsStarPattern`
`patternize` -- `(cons*)` to `ConsStarPattern`

# composition

`compose/fn` -- like `union/fn` and `inter/fn`
`compose` -- as a syntax keyword
`pipe` -- as a syntax keyword

# maybe

`(include)` -- support `:only` -- `(include <path> :only [<name> ...])`
`(include)` -- support `:except` -- `(include <path> :except [<name> ...])`
`(require)` -- support `:only` and `:except`
- if `(include)` support them, so should `(require)`
