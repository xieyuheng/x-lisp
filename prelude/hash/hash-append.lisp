(import-all "hash-put-many")

(export hash-append)

(claim hash-append
  (polymorphic (K V)
    (-> (hash? K V) (hash? K V)
        (hash? K V))))

(define (hash-append hash rest)
  (hash-put-many (hash-entries rest) hash))
