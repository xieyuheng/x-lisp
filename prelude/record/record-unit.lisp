(export record-unit)

(define (record-unit key value)
  (record-put key value []))
