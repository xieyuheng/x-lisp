(export
  list-select
  list-reject)

(define (list-select p list)
  (cond ((list-empty? list) list)
        ((p (car list))
         (cons (car list) (list-select p (cdr list))))
        (else
         (list-select p (cdr list)))))

(define (list-reject p list)
  (list-select (negate p) list))
