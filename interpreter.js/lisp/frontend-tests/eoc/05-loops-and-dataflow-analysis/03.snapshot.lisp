(if (begin
      (print 1)
      (newline)
      (print 2)
      (newline)
      (print 3)
      (newline)
      (equal? 1 2))
  (begin
    (print 111)
    (newline)
    (equal? 1 2))
  (begin
    (print 222)
    (newline)
    (equal? 1 2)))
