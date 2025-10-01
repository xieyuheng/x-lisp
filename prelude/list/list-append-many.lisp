(import-all "list-append")

(export list-append-many)

(claim list-append-many
  (polymorphic (A)
    (-> (list? (list? A))
        (list? A))))

(define (list-append-many lists)
  (if (list-empty? lists)
    []
    (list-append
     (car lists)
     (list-append-many (cdr lists)))))
