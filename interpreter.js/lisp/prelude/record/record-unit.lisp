(export record-unit)

(claim record-unit
  (polymorphic (A)
    (-> symbol? A
        (record? A))))

(define (record-unit key value)
  (record-put key value []))
