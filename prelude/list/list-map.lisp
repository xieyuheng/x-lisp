(export list-map)

(define (list-map f list)
  (if (list-empty? list)
    []
    (cons (f (car list)) (list-map f (cdr list)))))
