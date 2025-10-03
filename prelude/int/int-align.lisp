(export int-align)

(claim int-align (-> int? int? int?))

(define (int-align alignment n)
  (= remainder (imod n alignment))
  (if (equal? 0 remainder)
    n
    (iadd (isub n remainder) alignment)))
