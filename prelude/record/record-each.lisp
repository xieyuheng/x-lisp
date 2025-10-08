(import-all "../function")
(import-all "../list")

(export
  record-each-value
  record-each-key
  record-each)

(claim record-each-value
  (polymorphic (V)
    (-> (-> V anything?) (record? V)
        void?)))

(define (record-each-value f record)
  (pipe record
    record-values
    (list-each f)))

(claim record-each-key
  (polymorphic (V)
    (-> (-> symbol? anything?) (record? V)
        void?)))

(define (record-each-key f record)
  (pipe record
    record-keys
    (list-each f)))

(claim record-each
  (polymorphic (V)
    (-> (-> symbol? V anything?) (record? V)
        void?)))

(define (record-each f record)
  (pipe record
    record-entries
    (list-each (apply f))))
