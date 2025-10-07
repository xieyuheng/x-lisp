# meta

list all existing constructors and eliminators

support `meta`

- be careful about the meaning of `same?` now,
  even for string, it is already not just pointer equality.

wrap every value in `meta` during debug
suppor `(list? (-> A B))` by side effect

# pattern

add `ThePattern` to `Pattern`

# later

sort-order monad -- compose compare function

# generic

```scheme
(define-generic add :arity 2)

(define-case add (-> int? int? int?)
  (lamnda (x y) (iadd x y)))
```
