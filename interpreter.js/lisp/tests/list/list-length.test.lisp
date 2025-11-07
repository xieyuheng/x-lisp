(assert-equal (list-length []) 0)
(assert-equal (list-length [1 2 3]) 3)
(assert-equal
  (list-length [[1 2 3]
                [4 5 6]
                [7 8 9]])
  3)
