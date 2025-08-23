(define (list-map list f)
  (if (list-empty? list)
    []
    (cons (f (car list)) (list-map (cdr list) f))))
