(export list-first
        list-second
        list-third)

(define (list-first list) (car list))
(define (list-second list) (car (cdr list)))
(define (list-third list) (car (cdr (cdr list))))
