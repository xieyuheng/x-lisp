(import-all "list-map.lisp")

(assert-equal
  (list-map (iadd 10) [1 2 3])
  [11 12 13])
