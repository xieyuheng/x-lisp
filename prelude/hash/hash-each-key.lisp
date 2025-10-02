(import-all "../list")

(export hash-each-key)

(claim hash-each-key
  (polymorphic (K V)
    (-> (-> K anything?) (hash? K V)
        void?)))

(define (hash-each-key f hash)
  (pipe hash
    hash-keys
    (list-each f)))
