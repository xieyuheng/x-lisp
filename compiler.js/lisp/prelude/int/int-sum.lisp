(export int-sum)

(claim int-sum
  (-> (list? int?)
      int?))

(define (int-sum xs)
  (if (list-empty? xs)
    0
    (iadd (car xs) (int-sum (cdr xs)))))
