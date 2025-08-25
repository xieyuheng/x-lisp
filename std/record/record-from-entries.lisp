(define (record-from-entries entries)
  (record-set-many entries []))

(define (record-set-many entries record)
  (match entries
    ([] record)
    ((cons [k v] tail)
     (record-set-many tail (record-set k v record)))))
