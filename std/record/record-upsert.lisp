(import-all "../list/index.lisp")
(import-all "../conditional/index.lisp")
(import-all "record-from-entries.lisp")

(export record-upsert record-upsert!)

(define (record-upsert fs record)
  (= new-record (record-from-entries (record-entries record)))
  (record-upsert! fs new-record)
  new-record)

(define (record-upsert! fs record)
  (list-each (lambda (entry)
               (= [key f] entry)
               (= value (record-get key record))
               (record-put! key (f value) record))
             (record-entries fs))
  record)
