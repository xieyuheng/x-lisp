(define (list-take list n)
  (if (or (equal? n 0) (list-empty? list))
    []
    (cons (car list) (list-take (cdr list) (isub n 1)))))
