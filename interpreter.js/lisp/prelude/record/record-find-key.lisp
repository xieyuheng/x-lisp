(import-all "../function")
(import-all "../list")

(export
  record-find-key)

(claim record-find-key
  (polymorphic (V)
    (-> (-> V bool?) (record? V)
        (optional? symbol?))))

(define (record-find-key p record)
  (= entry
     (pipe record
       record-entries
       (list-find (apply (drop p)))))
  (if (null? entry)
    null
    (list-first entry)))
