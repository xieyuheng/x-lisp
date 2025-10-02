record-select
record-reject

hash-select
hash-reject

hash-invert/group -- from (hash? K V) to (hash? V (set? K))

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
