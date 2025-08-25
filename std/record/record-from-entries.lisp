(define (record-from-entries entries)
  (record-append-many [] entries))

(define (record-append-many record entries)
  (match entries
    ([] record)
    ((cons [k v] tail)
     (record-append-many (record-set record k v) tail))))
