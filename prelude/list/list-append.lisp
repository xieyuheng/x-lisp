(export list-append)

(claim list-append
  (polymorphic (A)
    (-> (list? A) (list? A)
        (list? A))))

(define (list-append list tail)
  (if (list-empty? list)
    (list-copy tail)
    (cons (car list) (list-append (cdr list) tail))))
