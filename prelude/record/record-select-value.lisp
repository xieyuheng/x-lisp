(import-all "../function")
(import-all "../list")
(import-all "record-from-entries")

(export
  record-select-value
  record-reject-value)

(claim record-select-value
  (polymorphic (A)
    (-> (-> A bool?) (record? A)
        (record? A))))

(define (record-select-value p record)
  (pipe record
    record-entries
    (list-select (compose p list-second))
    record-from-entries))

(define (record-reject-value p record)
  (record-select-value (negate p) record))
