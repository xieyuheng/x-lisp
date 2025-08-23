(define (list-filter list p)
  (cond ((list-empty? list) list)
        ((p (car list))
         (cons (car list) (list-filter (cdr list) p)))
        (else
         (list-filter (cdr list) p))))
