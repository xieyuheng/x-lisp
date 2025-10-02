(import-all "../function")
(import-all "../list")
(import-all "record-from-entries")

(export
  record-select
  record-reject)

(claim record-select
  (polymorphic (V)
    (-> (-> symbol? V bool?) (record? V)
        (record? V))))

(define (record-select p record)
  (pipe record
    record-entries
    (list-select (apply p))
    record-from-entries))

(claim record-reject
  (polymorphic (V)
    (-> (-> symbol? V bool?) (record? V)
        (record? V))))

(define (record-reject p record)
  (pipe record
    record-entries
    (list-reject (apply p))
    record-from-entries))
