(import-all "../list")
(import-all "record-from-entries")

(export record-upsert record-upsert!)

(define (record-upsert key f record)
  (= new-record (record-copy record))
  (record-upsert! key f new-record)
  new-record)

(define (record-upsert! key f record)
  (= value (record-get key record))
  (record-put! key (f value) record)
  record)
