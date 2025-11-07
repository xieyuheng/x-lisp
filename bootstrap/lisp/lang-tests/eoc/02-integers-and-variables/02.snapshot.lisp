(begin
  (= y (begin
         (= x 20)
         (iadd x (begin
                   (= x 22)
                   x))))
  y)
