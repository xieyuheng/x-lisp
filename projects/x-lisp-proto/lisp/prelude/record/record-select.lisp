(import-all "../function")
(import-all "../list")
(import-all "record-from-entries")

(export
  record-select
  record-select-key
  record-select-value
  record-reject
  record-reject-key
  record-reject-value)

(claim record-select
  (polymorphic (V)
    (-> (-> symbol? V bool?) (record? V)
        (record? V))))

(define (record-select p record)
  (pipe record
    record-entries
    (list-select (apply p))
    record-from-entries))

(claim record-select-key
  (polymorphic (V)
    (-> (-> symbol? bool?) (record? V)
        (record? V))))

(define (record-select-key p record)
  (pipe record
    record-entries
    (list-select (apply (swap (drop p))))
    record-from-entries))

(claim record-select-value
  (polymorphic (V)
    (-> (-> V bool?) (record? V)
        (record? V))))

(define (record-select-value p record)
  (pipe record
    record-entries
    (list-select (apply (drop p)))
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

(claim record-reject-key
  (polymorphic (V)
    (-> (-> symbol? bool?) (record? V)
        (record? V))))

(define (record-reject-key p record)
  (pipe record
    record-entries
    (list-reject (apply (swap (drop p))))
    record-from-entries))

(claim record-reject-value
  (polymorphic (V)
    (-> (-> V bool?) (record? V)
        (record? V))))

(define (record-reject-value p record)
  (pipe record
    record-entries
    (list-reject (apply (drop p)))
    record-from-entries))
