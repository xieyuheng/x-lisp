`evaluate` -- use combinators -- with the help of `Effect` type
`evaluate` -- handle `Begin`
begin.test.lisp
`Lambda` -- `body` should be `Array<Exp>` instead of `Exp`
`Assert` -- should be an `Exp` -- return the value asserted
`Assign` -- as an `Exp` -- use `=` as concrete syntax
`Let` -- has `body` instead of `exp`
`LetStar` --  has `body`
`let` test -- use `assert` as `Exp` -- instead of `Stmt`

fix `expFreeNames` for `Assign` in `body`

# conditional

`Exp` -- `If` -- if then else
`Exp` -- `If` -- if then

`Exp` -- `Cond`

`Exp` -- `And` -- lazy
`Exp` -- `Or` -- lazy

# list processing

list-length
list-append

# record processing

record-length
record-append

# tael

combine

# define-data

data predicate
data constructor
data constructor predicate

# equal

[maybe] `equal/` -- `equal` handle `CurriedLambda`
