aboutSexp -- add claim
aboutFile -- add claim
aboutPath -- add claim
aboutProcess -- add claim
aboutConsole -- add claim
aboutVoid -- add claim
aboutNull -- add claim
aboutFunction -- add claim
aboutFormat -- add claim
aboutRandom -- add claim
aboutSystem -- add claim
aboutSet -- add claim
aboutHashtag -- add claim
aboutHash -- add claim

# container schema

add `list-of` schema -- `ListOf` as `Value`

- when applied wrap elements in `(the <schema> ...)`
- fix the problem that `list?` can not be used with arraw argument

```scheme
(claim union-fn (polymorphic (A) (-> (list-of (-> A bool?)) (-> A bool?))))
(claim inter-fn (polymorphic (A) (-> (list-of (-> A bool?)) (-> A bool?))))
```

# dependent schema

to claim `record-update`
to claim `record-upsert`

# later

sort-order monad -- compose compare function
optional monad
