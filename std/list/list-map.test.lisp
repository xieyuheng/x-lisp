(import-all "list-map.lisp")

(assert-equal
  (list-map [1 2 3] (iadd 10))
  [11 12 13])
