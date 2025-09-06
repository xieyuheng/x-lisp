(export list-member?)

(claim list-member?
  (-> anything? (list? anything?)
      bool?))

(define (list-member? x list)
  (cond ((list-empty? list) false)
        ((equal? x (car list)) true)
        (else (list-member? x (cdr list)))))
