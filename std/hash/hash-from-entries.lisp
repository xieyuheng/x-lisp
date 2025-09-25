(import-all "hash-put-many.lisp")

(export hash-from-entries)

(define (hash-from-entries entries)
  (hash-put-many entries (@hash)))
