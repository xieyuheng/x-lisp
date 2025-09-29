(export list-any?)

(claim list-any?
  (polymorphic (A)
    (-> (-> A bool?) (list? A)
        bool?)))

(define (list-any? p list)
  (cond ((list-empty? list) false)
        ((p (car list)) true)
        (else (list-any? p (cdr list)))))
