(import-all "../list")
(import-all "../function")
(import-all "hash-from-entries")
(import-all "hash-each")
(import-all "hash-select")

(export
  hash-invert
  hash-invert/group)

(claim hash-invert
  (polymorphic (K V)
    (-> (hash? K V)
        (hash? V K))))

(define (hash-invert hash)
  (pipe hash
    hash-entries
    (list-map (lambda (entry) (= [k v] entry) [v k]))
    hash-from-entries))

(claim hash-invert/group
  (polymorphic (K V)
    (-> (hash? K V)
        (hash? V (list? K)))))

(define (hash-invert/group hash)
  (= new-hash (@hash))
  (pipe hash
    hash-values
    list-dedup
    (list-each
     (lambda (value)
       (= keys (hash-keys (hash-select (drop (equal? value)) hash)))
       (hash-put! value keys new-hash))))
  new-hash)
