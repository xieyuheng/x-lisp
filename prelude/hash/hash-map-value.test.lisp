(import-all "hash-map-value")

(assert-equal
  (@hash 1 2 3 4)
  (hash-map-value (iadd 1) (@hash 1 1 3 3)))
