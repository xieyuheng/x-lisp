[prelude] hash-update & hash-update!

# meta

support `meta`

- be careful about the meaning of `same?` now,
  even for string, it is already not just pointer equality.

wrap every value in `meta` during debug
suppor `(list? (-> A B))` by side effect

# later

sort-order monad -- compose compare function
optional monad
