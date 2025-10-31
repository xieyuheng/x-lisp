(export int-product)

(claim int-product
  (-> (list? int?)
      int?))

(define (int-product xs)
  (if (list-empty? xs)
    1
    (imul (car xs) (int-product (cdr xs)))))
