(import-all "hash-map-key")

(assert-equal
  (@hash 2 2 4 4)
  (hash-map-key (iadd 1) (@hash 1 2 3 4)))
