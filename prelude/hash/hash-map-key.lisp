(import-all "../list")
(import-all "hash-from-entries")

(export hash-map-key)

(claim hash-map-value
  (polymorphic (K1 K2 V)
    (-> (-> K1 K2) (hash? K1 V)
        (hash? K1 V))))

(define (hash-map-key f hash)
  (pipe hash
    hash-entries
    (list-map (lambda (entry) (= [k v] entry) [(f k) v]))
    hash-from-entries))
