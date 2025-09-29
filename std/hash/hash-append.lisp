(import-all "hash-put-many")

(export hash-append)

(define (hash-append hash rest)
  (hash-put-many (hash-entries rest) hash))
