(import-all "list-dedup.lisp")

(assert-equal
  [1 2 3]
  (list-dedup [1 2 3 1 2 3]))
