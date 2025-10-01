[std] claim list-fold-left
[std] claim list-fold-right
[std] claim list-map-zip
[std] claim list-map
[std] claim list-append-map list-unit list-lift list-bind
[std] claim list-select list-reject
[std] claim list-unzip
[std] claim list-zip

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
