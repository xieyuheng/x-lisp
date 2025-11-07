(import-all "hash-invert")

(assert-equal
  (@hash 2 1 4 3)
  (hash-invert (@hash 1 2 3 4)))

(assert-equal
  (@hash 2 {1 2}
         4 {3 4})
  (hash-invert-group
   (@hash 1 2
          3 4
          2 2
          4 4)))
