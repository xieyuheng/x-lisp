(import-all "../schema")

(export
  list-select
  list-reject)

(claim list-select
  (polymorphic (A)
    (-> (-> A bool?) (list? A)
        (list? A))))

(define (list-select p list)
  (cond ((list-empty? list) list)
        ((p (car list))
         (cons (car list) (list-select p (cdr list))))
        (else
         (list-select p (cdr list)))))

(claim list-reject
  (polymorphic (A)
    (-> (-> A bool?) (list? A)
        (list? A))))

(define (list-reject p list)
  (list-select (negate p) list))
