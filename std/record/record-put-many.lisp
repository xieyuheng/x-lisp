(export record-put-many)

(define (record-put-many entries record)
  (match entries
    ([] record)
    ((cons [k v] tail)
     (record-put-many tail (record-put k v record)))))
