(export
  hash-put-many
  hash-put-many!)

(define (hash-put-many entries hash)
  (hash-put-many! entries (hash-copy hash)))

(define (hash-put-many! entries hash)
  (match entries
    ([] hash)
    ((cons [k v] tail)
     (hash-put! k v hash)
     (hash-put-many! tail hash))))
