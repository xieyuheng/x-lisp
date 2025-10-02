(import-all "../list")

(export
  hash-each-value
  hash-each-key
  hash-each)

(claim hash-each-value
  (polymorphic (K V)
    (-> (-> V anything?) (hash? K V)
        void?)))

(define (hash-each-value f hash)
  (pipe hash
    hash-values
    (list-each f)))

(claim hash-each-key
  (polymorphic (K V)
    (-> (-> K anything?) (hash? K V)
        void?)))

(define (hash-each-key f hash)
  (pipe hash
    hash-keys
    (list-each f)))

(claim hash-each
  (polymorphic (K V)
    (-> (-> K V anything?) (hash? K V)
        void?)))

(define (hash-each f hash)
  (pipe hash
    hash-entries
    (list-each (apply f))))
