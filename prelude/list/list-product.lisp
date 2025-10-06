(import-all "index")

(export
  list-product
  list-product-without-diagonal)

(claim list-product
  (polymorphic (A B)
    (-> (list? A) (list? B)
        (list? (tau A B)))))

(define (list-product lhs rhs)
  (list-append-many
   (pipe lhs
     (list-map
      (lambda (left)
        (pipe rhs
          (list-map (lambda (right) [left right]))))))))

(claim list-product-without-diagonal
  (polymorphic (A B)
    (-> (list? A) (list? B)
        (list? (tau A B)))))

(define (list-product-without-diagonal lhs rhs)
  (list-append-many
   (pipe lhs
     (list-map
      (lambda (left)
        (pipe rhs
          (list-select (negate (equal? left)))
          (list-map (lambda (right) [left right]))))))))
