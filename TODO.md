# match

`expFreeNames` -- remove `effectUnion`
`expFreeNames` -- rename `effectUnionMany` to `effectUnion`

fix the order of `Exp` sum types
fix the order of `Value` sum types
fix the order of `Data` sum types
fix the order of `value/Atom` sum types
fix the order of `exp/Atom` sum types

load -- use stage1 stage2 stage3 -- instead of handle*

test `expFreeNames` -- `Match`
`pattern/` -- setup `Pattern`
`patternize`
parse `(match)`
`match(pattern, value)`
`evaluate` -- `Match`

# examples

my-list -- test with `(match)`
lambda -- test with `(match)`
lambda -- parse sexp
lambda -- `read-list` from file
lambda -- `write-list` to file
