(import-all "../list")
(import-all "hash-from-entries")

(export hash-invert)

(claim hash-invert
  (polymorphic (K V)
    (-> (hash? K V)
        (hash? V K))))

(define (hash-invert hash)
  (pipe hash
    hash-entries
    (list-map (lambda (entry) (= [k v] entry) [v k]))
    hash-from-entries))
