(export
  record-put-entries
  record-put-entries!)

(claim record-put-entries
  (polymorphic (A)
    (-> (list? (tau symbol? A)) (record? A)
        (record? A))))

(define (record-put-entries entries record)
  (match entries
    ([] record)
    ((cons [k v] tail)
     (record-put-entries tail (record-put k v record)))))

(claim record-put-entries!
  (polymorphic (A)
    (-> (list? (tau symbol? A)) (record? A)
        (record? A))))

(define (record-put-entries! entries record)
  (match entries
    ([] record)
    ((cons [k v] tail)
     (record-put! k v record)
     (record-put-entries! tail record))))
