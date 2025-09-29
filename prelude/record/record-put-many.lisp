(export
  record-put-many
  record-put-many!)

(define (record-put-many entries record)
  (match entries
    ([] record)
    ((cons [k v] tail)
     (record-put-many tail (record-put k v record)))))

(define (record-put-many! entries record)
  (match entries
    ([] record)
    ((cons [k v] tail)
     (record-put! k v record)
     (record-put-many! tail record))))
