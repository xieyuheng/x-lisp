(export
  hash-put-entries
  hash-put-entries!)

(claim hash-put-entries
  (polymorphic (K V)
    (-> (list? (tau K V)) (hash? K V)
        (hash? K V))))

(define (hash-put-entries entries hash)
  (hash-put-entries! entries (hash-copy hash)))

(claim hash-put-entries!
  (polymorphic (K V)
    (-> (list? (tau K V)) (hash? K V)
        (hash? K V))))

(define (hash-put-entries! entries hash)
  (match entries
    ([] hash)
    ((cons [k v] tail)
     (hash-put! k v hash)
     (hash-put-entries! tail hash))))
