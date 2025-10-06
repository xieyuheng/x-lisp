# repl

repl use >> and => -- so that a exp with both side effect (print) and return value can be seen easily

# pretty-print

`pretty-format`
`pretty-print`

# dependent schema

`forall` -- be like `->`-- `(forall (name arg-type) ... return-type)`
`exists` -- be like `forall` -- for list value

# meta

support `meta`

- be careful about the meaning of `same?` now,
  even for string, it is already not just pointer equality.

wrap every value in `meta` during debug
suppor `(list? (-> A B))` by side effect

# later

sort-order monad -- compose compare function
optional monad
