(import-all "../schema")
(import-all "list-find-index")

(export list-index)

(claim list-index
  (polymorphic (A)
    (-> A (list? A)
        (union int? null?))))

(define (list-index e list)
  (list-find-index (equal? e) list))
