(begin
  (= x 1)
  (iadd x (begin
            (= x (begin
                   (= y 5)
                   (iadd y x)))
            (iadd x 100))))
