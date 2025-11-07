(begin
  (= x 1)
  (iadd x (begin
            (= x (begin
                   (= x 5)
                   (iadd x x)))
            (iadd x 100))))
