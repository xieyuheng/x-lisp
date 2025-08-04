(assert
  (equal?
   (begin
     1
     2
     3)
   3))

(assert
  (equal?
   (begin
     (= x 1)
     x)
   1))
