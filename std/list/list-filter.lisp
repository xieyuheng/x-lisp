(export list-filter)

(define (list-filter p list)
  (cond ((list-empty? list) list)
        ((p (car list))
         (cons (car list) (list-filter p (cdr list))))
        (else
         (list-filter p (cdr list)))))
