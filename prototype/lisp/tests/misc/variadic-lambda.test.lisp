(assert-equal
  [1 2 3]
  ((lambda args args) 1 2 3))
