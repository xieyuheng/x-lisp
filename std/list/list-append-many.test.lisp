(import-all "list-append-many.lisp")

(assert-equal
  (list-append-many [[1 2 3] [4 5 6]])
  [1 2 3 4 5 6])

;; the record part of the first list is kept:

(assert-equal
  (list-append-many [[1 2 3 :x 1] [4 5 6 :y 2]])
  [1 2 3 4 5 6 :x 1])
