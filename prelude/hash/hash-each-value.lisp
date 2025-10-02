(import-all "../list")

(export hash-each-value)

(claim hash-each-value
  (polymorphic (K V)
    (-> (-> V anything?) (hash? K V)
        void?)))

(define (hash-each-value f hash)
  (pipe hash
    hash-values
    (list-each f)))
