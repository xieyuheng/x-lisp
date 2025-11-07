(begin
  (= y (begin
         (= x 20)
         (begin
           (= z 22)
           (iadd x z))))
  y)
