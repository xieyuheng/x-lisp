(export list-fold-left)

(claim list-fold-left
  (polymorphic (element-p result-p)
    (-> (-> result-p element-p result-p)
        result-p (list? element-p)
        result-p)))

(define (list-fold-left op e list)
  (if (list-empty? list)
    e
    (list-fold-left
     op (op e (list-head list))
     (list-tail list))))
