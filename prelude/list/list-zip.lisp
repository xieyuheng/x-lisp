(export list-zip)

(claim list-zip
  (polymorphic (A B)
    (-> (list? A) (list? B)
        (list? (tau A B)))))

(define (list-zip left right)
  (if (or (list-empty? left)
          (list-empty? right))
    []
    (cons [(car left) (car right)]
          (list-zip (cdr left) (cdr right)))))
