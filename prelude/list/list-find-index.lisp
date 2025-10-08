(import-all "../schema")

(export list-find-index)

(claim list-find-index
  (polymorphic (A)
    (-> (-> A bool?) (list? A)
        (union int? null?))))

(define (list-find-index p list)
  (list-find-index-aux p list 0))

(define (list-find-index-aux p list index)
  (cond ((list-empty? list) null)
        ((p (car list)) index)
        (else (list-find-index-aux p (cdr list) (iadd 1 index)))))
