(import-all "record-find-key")

(begin
  (= record [:a 1 :b 2])
  (assert-equal 'a (record-find-key (equal? 1) record))
  (assert-equal 'b (record-find-key (equal? 2) record))
  (assert-equal null (record-find-key (equal? 3) record)))

;; find the first key
(begin
  (= record [:a 1 :b 1])
  (assert-equal 'a (record-find-key (equal? 1) record)))
