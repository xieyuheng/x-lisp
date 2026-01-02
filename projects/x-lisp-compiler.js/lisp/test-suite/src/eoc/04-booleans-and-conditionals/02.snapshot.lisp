(begin
  (= x (random-dice))
  (= y (random-dice))
  (iadd
   (if (if (int-less? x 1) (equal? x 0) (equal? x 2))
     (iadd y 2)
     (iadd y 10))
   (if (if (int-less? x 1) (equal? x 0) (equal? x 2))
     (iadd y 2)
     (iadd y 10))))
