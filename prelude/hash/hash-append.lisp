(import-all "hash-put-entries")

(export hash-append)

(claim hash-append
  (polymorphic (K V)
    (-> (hash? K V) (hash? K V)
        (hash? K V))))

(define (hash-append hash rest)
  (hash-put-entries (hash-entries rest) hash))
