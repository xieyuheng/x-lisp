(import-all "../schema")

(export list-find)

(claim list-find
  (polymorphic (A)
    (-> (-> A bool?) (list? A)
        (union A null?))))

(define (list-find p list)
  (cond ((list-empty? list) null)
        ((p (car list)) (car list))
        (else (list-find p (cdr list)))))
