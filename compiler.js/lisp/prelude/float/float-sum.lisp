(export float-sum)

(claim float-sum
  (-> (list? float?)
      float?))

(define (float-sum xs)
  (if (list-empty? xs)
    0.0
    (fadd (car xs) (float-sum (cdr xs)))))
