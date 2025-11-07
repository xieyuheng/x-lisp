(import-all "list-product")

(assert-equal
  [[1 1] [1 2] [1 3]
   [2 1] [2 2] [2 3]
   [3 1] [3 2] [3 3]]
  (list-product [1 2 3] [1 2 3]))
