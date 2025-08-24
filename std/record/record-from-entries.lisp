(define (record-from-entries entries)
  (record-update-many [] entries))

(define (record-update-many record entries)
  (match entries
    ([] record)
    ((cons [k v] tail)
     (record-update-many (record-set record k v) tail))))
