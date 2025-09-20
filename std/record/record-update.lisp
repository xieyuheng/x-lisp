(import-all "../list/index.lisp")
(import-all "../conditional/index.lisp")
(import-all "record-from-entries.lisp")

(export record-update record-update!)

(define (record-update fs record)
  (record-from-entries
   (list-map (lambda (entry)
               (= [key value] entry)
               (= f (record-get key fs))
               (if (null? f)
                 [key value]
                 [key (f value)]))
             (record-entries record))))

(define (record-update! fs record)
  (list-each (lambda (entry)
               (= [key f] entry)
               (= value (record-get key record))
               (unless (null? value)
                 (record-put! key (f value) record)))
             (record-entries fs))
  record)
