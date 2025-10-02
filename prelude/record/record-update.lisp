(import-all "../list")
(import-all "record-from-entries")

(export record-update record-update!)

;; TODO we need dependent schema to claim record-update

;; (claim record-update
;;   (polymorphic (A V)
;;     (forall (key (symbol?))
;;       (-> (-> A B)
;;           (TODO record with optional A value under key)
;;           (TODO record with optional B value under key)))))

(define (record-update key f record)
  (= value (record-get key record))
  (if (null? value)
    record
    (record-put key (f value) record)))

(define (record-update! key f record)
  (= value (record-get key record))
  (unless (null? value)
    (record-put! key (f value) record))
  record)
