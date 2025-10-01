(export
  hash-put-many
  hash-put-many!)

(claim hash-put-many
  (polymorphic (K V)
    (-> (list? (tau K V)) (hash? K V)
        (hash? K V))))

(define (hash-put-many entries hash)
  (hash-put-many! entries (hash-copy hash)))

(claim hash-put-many!
  (polymorphic (K V)
    (-> (list? (tau K V)) (hash? K V)
        (hash? K V))))

(define (hash-put-many! entries hash)
  (match entries
    ([] hash)
    ((cons [k v] tail)
     (hash-put! k v hash)
     (hash-put-many! tail hash))))
