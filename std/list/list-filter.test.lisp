(import-all "list-filter.lisp")

(assert-equal
  (list-filter [0 1 0 2 0 3] (negate (equal? 0)))
  [1 2 3])
