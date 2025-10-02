record-upsert -- should take simple input -- not record

[prelude] claim record-update & record-upsert

[prelude] claim optional?

[prelude] claim identity constant swap

[prelude] claim set-select set-reject

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

# schema

move `checkExported` from `runSexps` to `load`

`aboutInt` -- add claim

# later

sort-order monad -- compose compare function
optional monad
