(import-all "hash-from-entries")

(assert-equal
  (@hash 'a 1 'b 2)
  (hash-from-entries [['a 1] ['b 2]]))
