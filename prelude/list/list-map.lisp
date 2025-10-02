(export list-map)

(claim list-map
  (polymorphic (A B)
    (-> (-> A B) (list? A)
        (list? B))))

(define (list-map f list)
  (if (list-empty? list)
    []
    (cons (f (car list)) (list-map f (cdr list)))))
