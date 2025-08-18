# match

`match` -- handle `ConsStarPattern`
`patternize` -- `(cons)` to `ConsStarPattern`
`patternize` -- `(cons*)` to `ConsStarPattern`

# match

`(eval)` as `EvalPattern` to use `evaluate` in pattern

# quasiquote

`Quasiquote` as `Exp`
`Unquote` as `Exp`
maybe remove `expFreeNames`

# match

`patternize` -- `Unquote` to `LiteralPattern`
`patternize` -- `Quasiquote` to `TaelPattern`

# composition

`compose/fn` -- like `union/fn` and `inter/fn`
`compose` -- as a syntax keyword
`pipe` -- as a syntax keyword

# maybe

`(include)` -- support `:only` -- `(include <path> :only [<name> ...])`
`(include)` -- support `:except` -- `(include <path> :except [<name> ...])`
`(require)` -- support `:only` and `:except`
- if `(include)` support them, so should `(require)`
