(import-all "../function")
(import-all "index")

(export list-product)

(claim list-product
  (polymorphic (A B)
    (-> (list? A) (list? B)
        (list? (tau A B)))))

(define (list-product lhs rhs)
  (list-concat
   (pipe lhs
     (list-map
      (lambda (left)
        (pipe rhs
          (list-map (lambda (right) [left right]))))))))
