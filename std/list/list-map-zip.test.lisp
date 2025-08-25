(import-all "list-map-zip.lisp")

(assert-equal
  (list-map-zip iadd [1 2 3] [10 20 30])
  [11 22 33])
