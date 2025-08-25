(import-all "list-filter.lisp")

(assert-equal
  (list-filter (negate (equal? 0)) [0 1 0 2 0 3])
  [1 2 3])
