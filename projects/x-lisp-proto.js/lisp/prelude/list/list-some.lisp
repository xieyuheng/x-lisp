(export list-some?)

(claim list-some?
  (polymorphic (A)
    (-> (-> A bool?) (list? A)
        bool?)))

(define (list-some? p list)
  (cond ((list-empty? list) false)
        ((p (car list)) true)
        (else (list-some? p (cdr list)))))
