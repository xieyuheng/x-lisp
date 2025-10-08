sort-order -- `compose-compare`
remove `*-concat` functions

# later

ambr put-many put-entries

# error report

fix (validation) error report -- be more clear

# define-object or define-record

[maybe] `define-data` with single clause

- record this idea in diary

define-record

# pattern

add `ThePattern` to `Pattern`

# generic

need to be able to use arrow as predicates to check arguments one by one.

```scheme
(define-generic add :arity 2)

(define-case add (-> int? int? int?)
  (lambda (x y) (iadd x y)))
```

# meta

> maybe this should wait after compiler runtime design.

list all existing constructors and eliminators

support `meta`

- be careful about the meaning of `same?` now,
  even for string, it is already not just pointer equality.

wrap every value in `meta` during debug
suppor `(list? (-> A B))` by side effect
