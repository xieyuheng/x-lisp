(export list-append)

(define (list-append list tail)
  (if (list-empty? list)
    (list-of tail)
    (cons (car list) (list-append (cdr list) tail))))
