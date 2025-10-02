(import-all "record-put-many")

(export record-from-entries)

(claim record-from-entries
  (polymorphic (A)
    (-> (list? (tau symbol? A))
        (record? A))))

(define (record-from-entries entries)
  (record-put-many entries []))
