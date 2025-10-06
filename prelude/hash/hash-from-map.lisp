(import-all "../list")
(import-all "hash-from-entries")

(export hash-from-map)

(claim hash-from-map
  (polymorphic (K V)
    (-> (-> K V) (list? K)
        (hash? K V))))

(define (hash-from-map f keys)
  (pipe keys
    (list-map (lambda (k) [k (f k)]))
    hash-from-entries))
