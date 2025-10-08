(import-all "hash-put-entries")

(export hash-from-entries)

(claim hash-from-entries
  (polymorphic (K V)
    (-> (list? (tau K V))
        (hash? K V))))

(define (hash-from-entries entries)
  (hash-put-entries entries (@hash)))
