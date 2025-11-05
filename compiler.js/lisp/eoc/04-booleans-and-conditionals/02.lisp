(let ((x (random-dice)))
  (let ((y (random-dice)))
    (iadd
     (if (if (lt? x 1) (equal? x 0) (equal? x 2))
       (iadd y 2)
       (iadd y 10))
     (if (if (lt? x 1) (equal? x 0) (equal? x 2))
       (iadd y 2)
       (iadd y 10)))))
