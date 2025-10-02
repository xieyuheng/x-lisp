(export
  record-put-many
  record-put-many!)

(claim record-put-many
  (polymorphic (A)
    (-> (list? (tau symbol? A)) (record? A)
        (record? A))))

(define (record-put-many entries record)
  (match entries
    ([] record)
    ((cons [k v] tail)
     (record-put-many tail (record-put k v record)))))

(claim record-put-many!
  (polymorphic (A)
    (-> (list? (tau symbol? A)) (record? A)
        (record? A))))

(define (record-put-many! entries record)
  (match entries
    ([] record)
    ((cons [k v] tail)
     (record-put! k v record)
     (record-put-many! tail record))))
