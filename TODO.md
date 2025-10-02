[prelude] claim functions about sort-order

hash-map -- key and value

hash-each-value
hash-each-key
hash-each

hash-invert/group -- from (hash? K V) to (hash? V (set? K))

record-map-key
record-map -- key and value

record-each-value
record-each-key
record-each

list-group -- by the hash key returned by function
list-foremost -- first after sort
list-rearmost -- last after sort

# schema for builtin

move `checkExported` from `runSexps` to `load`

`aboutInt` -- add claim

# dependent schema

to claim `record-update`
to claim `record-upsert`

# later

sort-order monad -- compose compare function
optional monad
