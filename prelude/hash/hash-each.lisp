(import-all "../list")

(export hash-each)

(claim hash-each
  (polymorphic (K V)
    (-> (-> K V anything?) (hash? K V)
        void?)))

(define (hash-each f hash)
  (pipe hash
    hash-entries
    (list-each (apply f))))
