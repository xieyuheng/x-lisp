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

add `record-of`
add `hash-of`

[problem] but this is not scalable!

- because how about `optional?` and other user defined container predicates?

- solution A: during debug, every value has meta data,
  and arraw schema do side effect on meta data of function,
  which should be used like `(the)` when applying the data.

  - preserve `:debug` as special scope for debugging meta data

# dependent schema

to claim `record-update`
to claim `record-upsert`

# later

sort-order monad -- compose compare function
optional monad
