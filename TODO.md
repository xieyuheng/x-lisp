parsing error about `assert` taking more than one arguments

# claim

examples/predicate/arrow.snapshot.lisp

`Claim` as `Stmt`
parse `(claim)`

examples/predicate/claim.test.lisp

`apply` -- `Arrow` to `Lambda` -- add claim to `Lambda` -- be careful about claim and currying
`apply` -- `Lambda` -- use `claims` during debug

# match

`Match` as `Exp`
parse `(match)`
`match(pattern, value)`

# examples

my-list -- test with `(match)`
lambda -- test with `(match)`
lambda -- parse sexp
lambda -- read sexp from file
