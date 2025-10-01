(import-all "hash-invert")

(assert-equal
  (@hash 2 1 4 3)
  (hash-invert (@hash 1 2 3 4)))
