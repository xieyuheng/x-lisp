(import-all "../list")
(import-all "record-from-entries")

(export record-update record-update!)

(define (record-update key f record)
  (= new-record (record-copy record))
  (record-update! key f new-record)
  new-record)

(define (record-update! key f record)
  (= value (record-get key record))
  (record-put! key (f value) record)
  record)
