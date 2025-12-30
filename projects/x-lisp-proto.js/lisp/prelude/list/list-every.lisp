(export list-every?)

(claim list-every?
  (polymorphic (A)
    (-> (-> A bool?) (list? A)
        bool?)))

(define (list-every? p list)
  (cond ((list-empty? list) true)
        ((not (p (car list))) false)
        (else (list-every? p (cdr list)))))
