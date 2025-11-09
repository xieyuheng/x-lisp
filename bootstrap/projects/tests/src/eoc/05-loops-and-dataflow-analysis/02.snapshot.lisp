(begin
  (= x (begin
         (print 1)
         (newline)
         (print 2)
         (newline)
         (print 3)
         (newline)
         6))
  (begin
    (print 4)
    (newline)
    (print 5)
    (newline)
    (print 6)
    (newline)
    (iadd x x)))
