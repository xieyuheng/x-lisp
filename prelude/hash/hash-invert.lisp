(import-all "../list")
(import-all "hash-from-entries")

(export hash-invert)

(define (hash-invert hash)
  (pipe hash
    hash-entries
    (list-map (lambda (entry) (= [k v] entry) [v k]))
    hash-from-entries))
