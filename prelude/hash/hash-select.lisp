(import-all "../list")
(import-all "hash-from-entries")

(export
  hash-select
  hash-reject)

(claim hash-select
  (polymorphic (K V)
    (-> (-> K V bool?) (hash? K V)
        (hash? K V))))

(define (hash-select p hash)
  (pipe hash
    hash-entries
    (list-select (apply p))
    hash-from-entries))

(claim hash-reject
  (polymorphic (K V)
    (-> (-> K V bool?) (hash? K V)
        (hash? K V))))

(define (hash-reject p hash)
  (pipe hash
    hash-entries
    (list-reject (apply p))
    hash-from-entries))
