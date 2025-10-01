(import-all "../list")
(import-all "hash-from-entries")

(export hash-map-value)

(claim hash-map-value
  (polymorphic (K V1 V2)
    (-> (-> V1 V2) (hash? K V1)
        (hash? K V2))))

(define (hash-map-value f hash)
  (pipe hash
    hash-entries
    (list-map (lambda (entry) (= [k v] entry) [k (f v)]))
    hash-from-entries))
