(export list-take)

(claim list-take
  (polymorphic (A)
    (-> int-non-negative? (list? A)
        (list? A))))

(define (list-take n list)
  (if (or (equal? n 0) (list-empty? list))
    []
    (cons (car list) (list-take (isub n 1) (cdr list)))))
