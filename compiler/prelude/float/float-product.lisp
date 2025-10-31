(export float-product)

(claim float-product
  (-> (list? float?)
      float?))

(define (float-product xs)
  (if (list-empty? xs)
    1.0
    (fmul (car xs) (float-product (cdr xs)))))
