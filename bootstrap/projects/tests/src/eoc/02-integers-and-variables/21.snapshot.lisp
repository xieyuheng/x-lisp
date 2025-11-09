(begin
  (= y 6)
  (begin
    (= x (begin
           (= y (ineg 42))
           y))
    (iadd x y)))
