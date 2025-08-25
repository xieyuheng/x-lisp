(claim list-take
  (-> int-non-negative? (list? anything?)
      (list? anything?)))

(define (list-take n list)
  (if (or (equal? n 0) (list-empty? list))
    []
    (cons (car list) (list-take (isub n 1) (cdr list)))))
