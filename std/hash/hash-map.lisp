(import-all "../list")
(import-all "hash-from-entries.lisp")

(export hash-map)

(define (hash-map f hash)
  (pipe hash
    hash-entries
    (list-map (lambda (entry) (= [k v] entry) [k (f v)]))
    hash-from-entries))
