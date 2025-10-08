[diary] note about variadic function -- 关于为什么要少用

[diary] add note about meta to container schema note

> maybe this should wait after compiler runtime design.

list all existing constructors and eliminators

support `meta`

- be careful about the meaning of `same?` now,
  even for string, it is already not just pointer equality.

wrap every value in `meta` during debug
suppor `(list? (-> A B))` by side effect

# prelude

int-sum -- take list
int-product -- take list

float-sum -- take list
float-product -- take list

# error report

fix (validation) error report -- be more clear about args

- index or count? it is not clear
- wrap in `(the)` is not clear

# pattern

add `ThePattern` to `Pattern`

# schema

`->` use `validate` instead of `apply` -- to support non predicate schema
