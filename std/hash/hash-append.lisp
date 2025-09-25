(import-all "hash-put-many.lisp")

(export hash-append)

(define (hash-append hash rest)
  (hash-put-many (hash-entries rest) hash))
