(assert-equal
  (begin
    1
    2
    3)
  3)

(assert-equal
  (begin
    (= x 1)
    x)
  1)

(begin
  (= x 1)
  (assert-equal x 1))
