(export list-fold-left)

(define (list-fold-left op e list)
  (if (list-empty? list)
    e
    (list-fold-left
     op (op e (list-head list))
     (list-tail list))))
