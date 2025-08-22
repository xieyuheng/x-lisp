(begin
  (= x 1)
  (= y (iadd x 1))
  (assert-equal x 1)
  (assert-equal y 2)
  (assert-equal (iadd x y) 3))
