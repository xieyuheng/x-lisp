record-map
hash-map
hash-from-map

# graph

graph-add-vertices!

# repl

repl use >> and => -- so that a exp with both side effect (print) and return value can be seen easily

[maybe] run and debug -- support no-echo option -- to not print top-level values

- write note about this in diary
- maybe not, because it will too many options, and this default behavior is good enough given that we have void

# print/pretty

`format/pretty`
`print/pretty`

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
