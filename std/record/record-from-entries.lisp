(export record-from-entries record-put-many)

(define (record-from-entries entries)
  (record-put-many entries []))

(define (record-put-many entries record)
  (match entries
    ([] record)
    ((cons [k v] tail)
     (record-put-many tail (record-put k v record)))))
