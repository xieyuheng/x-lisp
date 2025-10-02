(import-all "../list")
(import-all "record-from-entries")

(export record-map-key)

(claim record-map-key
  (polymorphic (V)
    (-> (-> symbol? symbol?) (record? V)
        (record? V))))

(define (record-map-key f record)
  (pipe record
    record-entries
    (list-map
     (lambda (entry)
       (= [key value] entry)
       [(f key) value]))
    record-from-entries))
