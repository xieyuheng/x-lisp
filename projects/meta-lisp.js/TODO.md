# pattern match

`Which` as `Exp` -- `typeInfer` like `If`
parse `(which)`
`evaluate` -- supported `Which`

`Match` as `Exp`
parse `(match)`

`desugarMatch` -- compile `(match)` with nested patterns to simple `(match)`
`desugarMatch` -- compile simple `(match)` to `(which)`

# tuple

tuple-cons
tuple-head
tuple-tail
