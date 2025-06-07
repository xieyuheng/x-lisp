(claim sum-list (-> (list-t number-t) number-t))
(define (sum-list list)
  (match list
    ([] 0)
    ([head . tail]
     (add head (sum-list tail)))))

(define-type (maybe-t A) (union nothing-t (just-t A)))
(define-type nothing-t (tau 'nothing))
(define-type (just-t A) (tau 'just A))

(claim find
  (-> number-t (list-t number-t)
      (maybe-t number-t)))
(define (find value list)
  (match list
    ([] '(nothing))
    ([head . tail]
     (if (equal? head value)
       ['just value]
       (find value tail)))))

(claim list-length
  (nu (A) (-> (list-t A) integer-t)))
(define (list-length list)
  (match list
    ([] 0)
    ([head . tail]
     (add1 (list-length tail)))))

(claim sum
  (->* (list-t number-t) number-t))
(claim sum
  (fn-t :arg-types (list-t number-t)
        :return-type number-t))
(define (sum . list)
  (match list
    ([] 0)
    ([head . tail]
     (add head (apply sum tail)))))
