(import-all "../list")
(import-all "record-from-entries")

(export record-map-value)

(claim record-map-value
  (polymorphic (V1 V2)
    (-> (-> V1 V2) (record? V1)
        (record? V2))))

(define (record-map-value f record)
  (pipe record
    record-entries
    (list-map
     (lambda (entry)
       (= [key value] entry)
       [key (f value)]))
    record-from-entries))
