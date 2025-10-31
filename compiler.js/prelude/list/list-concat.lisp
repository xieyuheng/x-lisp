(import-all "list-append")

(export list-concat)

(claim list-concat
  (polymorphic (A)
    (-> (list? (list? A))
        (list? A))))

(define (list-concat lists)
  (if (list-empty? lists)
    []
    (list-append
     (car lists)
     (list-concat (cdr lists)))))
