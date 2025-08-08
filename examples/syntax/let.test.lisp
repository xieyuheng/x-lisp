(let ((id (lambda (x) x)))
  (id id))

(assert
  (equal?
   (let ((x 1)
         (y 1))
     (iadd x y))
   2))

(let ((x 1)
      (y 1))
  (assert (equal? x 1))
  (assert (equal? y 1))
  (assert (equal? (iadd x y) 2)))
