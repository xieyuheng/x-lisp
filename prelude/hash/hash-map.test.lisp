(import-all "hash-map")

(assert-equal
  (@hash 2 2 4 4)
  (hash-map/key (iadd 1) (@hash 1 2 3 4)))

(assert-equal
  (@hash 1 3 3 5)
  (hash-map/value (iadd 1) (@hash 1 2 3 4)))
