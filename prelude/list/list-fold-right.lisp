(export list-fold-right)

(define (list-fold-right op e list)
  (if (list-empty? list)
    e
    (list-fold-right
     op (op (list-last list) e)
     (list-init list))))
