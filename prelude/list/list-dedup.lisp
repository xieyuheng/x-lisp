(export list-dedup)

(claim list-dedup
  (polymorphic (A)
    (-> (list? A)
        (list? A))))

(define (list-dedup list)
  (pipe list
    list-to-set
    set-to-list))
