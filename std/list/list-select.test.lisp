(import-all "list-select.lisp")

(assert-equal
  (list-select (negate (equal? 0)) [0 1 0 2 0 3])
  [1 2 3])

(assert-equal
  (list-reject (equal? 0) [0 1 0 2 0 3])
  [1 2 3])
