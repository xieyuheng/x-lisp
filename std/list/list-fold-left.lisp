(define (list-fold-left list op e)
  (if (list-empty? list)
    e
    (list-fold-left
     (list-tail list) op
     (op e (list-head list)))))
