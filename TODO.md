`definePrimitiveVariadicFunction`

remove `*-concat` functions

# error report

fix (validation) error report -- be more clear about args

- index or count? it is not clear
- wrap in `(the)` is not clear

# pattern

add `ThePattern` to `Pattern`

# meta

> maybe this should wait after compiler runtime design.

list all existing constructors and eliminators

support `meta`

- be careful about the meaning of `same?` now,
  even for string, it is already not just pointer equality.

wrap every value in `meta` during debug
suppor `(list? (-> A B))` by side effect
