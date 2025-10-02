(import-all "../list")
(import-all "record-from-entries")

(export record-each-value)

(claim record-each-value
  (polymorphic (V)
    (-> (-> V anything?) (record? V)
        void?)))

(define (record-each-value f record)
  (pipe record
    record-values
    (list-each f)))
