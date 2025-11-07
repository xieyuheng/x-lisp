(import-all "../function")
(import-all "../list")
(import-all "record-from-entries")

(export
  record-map
  record-map-key
  record-map-value)

(claim record-map
  (polymorphic (V)
    (-> (-> symbol? V (tau symbol? V)) (record? V)
        (record? V))))

(define (record-map f record)
  (pipe record
    record-entries
    (list-map (apply f))
    record-from-entries))

(claim record-map-key
  (polymorphic (V)
    (-> (-> symbol? symbol?) (record? V)
        (record? V))))

(define (record-map-key f record)
  (pipe record
    record-entries
    (list-map (lambda ([k v]) [(f k) v]))
    record-from-entries))

(claim record-map-value
  (polymorphic (V1 V2)
    (-> (-> V1 V2) (record? V1)
        (record? V2))))

(define (record-map-value f record)
  (pipe record
    record-entries
    (list-map (lambda ([k v]) [k (f v)]))
    record-from-entries))
