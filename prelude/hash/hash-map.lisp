(import-all "../list")
(import-all "hash-from-entries")

(export
  hash-map/key
  hash-map/value)

(claim hash-map/key
  (polymorphic (K1 K2 V)
    (-> (-> K1 K2) (hash? K1 V)
        (hash? K1 V))))

(define (hash-map/key f hash)
  (pipe hash
    hash-entries
    (list-map (lambda ([k v]) [(f k) v]))
    hash-from-entries))

(claim hash-map/value
  (polymorphic (K V1 V2)
    (-> (-> V1 V2) (hash? K V1)
        (hash? K V2))))

(define (hash-map/value f hash)
  (pipe hash
    hash-entries
    (list-map (lambda ([k v]) [k (f v)]))
    hash-from-entries))
