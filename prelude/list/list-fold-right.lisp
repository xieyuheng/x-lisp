(export list-fold-right)

(claim list-fold-right
  (polymorphic (element-p result-p)
    (-> (-> element-p result-p result-p)
        result-p (list? element-p)
        result-p)))

(define (list-fold-right op e list)
  (if (list-empty? list)
    e
    (list-fold-right
     op (op (list-last list) e)
     (list-init list))))
