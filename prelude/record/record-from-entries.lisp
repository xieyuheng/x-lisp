(import-all "record-put-many")

(export record-from-entries)

(define (record-from-entries entries)
  (record-put-many entries []))
