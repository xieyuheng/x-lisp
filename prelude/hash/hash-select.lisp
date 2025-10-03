(import-all "../list")
(import-all "../function")
(import-all "hash-from-entries")

(export
  hash-select
  hash-select/key
  hash-select/value
  hash-reject
  hash-reject/key
  hash-reject/value)

(claim hash-select
  (polymorphic (K V)
    (-> (-> K V bool?) (hash? K V)
        (hash? K V))))

(define (hash-select p hash)
  (pipe hash
    hash-entries
    (list-select (apply p))
    hash-from-entries))

(claim hash-select/key
  (polymorphic (K V)
    (-> (-> K bool?) (hash? K V)
        (hash? K V))))

(define (hash-select/key p hash)
  (pipe hash
    hash-entries
    (list-select (apply (swap (drop p))))
    hash-from-entries))

(claim hash-select/value
  (polymorphic (K V)
    (-> (-> V bool?) (hash? K V)
        (hash? K V))))

(define (hash-select/value p hash)
  (pipe hash
    hash-entries
    (list-select (apply (drop p)))
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

(claim hash-reject/key
  (polymorphic (K V)
    (-> (-> K bool?) (hash? K V)
        (hash? K V))))

(define (hash-reject/key p hash)
  (pipe hash
    hash-entries
    (list-reject (apply (swap (drop p))))
    hash-from-entries))

(claim hash-reject/value
  (polymorphic (K V)
    (-> (-> V bool?) (hash? K V)
        (hash? K V))))

(define (hash-reject/value p hash)
  (pipe hash
    hash-entries
    (list-reject (apply (drop p)))
    hash-from-entries))
