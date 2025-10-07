(export
  hash-update
  hash-update!)

(claim hash-update
  (polymorphic (K V)
    (-> K (-> (optional? V) V) (hash? K V)
        (hash? K V))))

(define (hash-update key f hash)
  (= new-hash (hash-copy hash))
  (hash-update! key f new-hash)
  new-hash)

(claim hash-update!
  (polymorphic (K V)
    (-> K (-> (optional? V) V) (hash? K V)
        (hash? K V))))

(define (hash-update! key f hash)
  (= value (hash-get key hash))
  (hash-put! key (f value) hash))
