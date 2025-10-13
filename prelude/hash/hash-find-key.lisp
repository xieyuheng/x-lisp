(import-all "../function")
(import-all "../list")

(export
  hash-find-key)

(claim hash-find-key
  (polymorphic (K V)
    (-> (-> V bool?) (hash? K V)
        (optional? K))))

(define (hash-find-key p hash)
  (= entry
     (pipe hash
       hash-entries
       (list-find (apply (drop p)))))
  (if (null? entry)
    null
    (list-first entry)))
