(import-all "hash-map.lisp")

(assert-equal
  (@hash 1 2 3 4)
  (hash-map (iadd 1) (@hash 1 1 3 3)))
