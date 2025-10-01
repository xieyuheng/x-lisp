(import-all "../list")
(import-all "hash-from-entries")

(export hash-map-key)

(define (hash-map-key f hash)
  (pipe hash
    hash-entries
    (list-map (lambda (entry) (= [k v] entry) [(f k) v]))
    hash-from-entries))
