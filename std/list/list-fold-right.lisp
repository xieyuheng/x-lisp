(define (list-fold-right list op e)
  (if (list-empty? list)
    e
    (list-fold-right
     (list-init list) op
     (op (list-last list) e))))
