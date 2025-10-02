(import-all "../list")
(import-all "record-from-entries")

(export record-update record-update!)

(define (record-update key f record)
  (= value (record-get key record))
  (if (null? value)
    record
    (record-put key (f value) record)))

(define (record-update! key f record)
  (= value (record-get key record))
  (unless (null? value)
    (record-put! key (f value) record))
  record)
