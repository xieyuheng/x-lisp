(begin
  (= record [:a 0 :b 0])
  (= record (record-put 'a 1 record))
  (= record (record-put 'b 2 record))
  (assert-equal record [:a 1 :b 2]))

;; about insertion order:

(begin
  (= record [])
  (= record (record-put 'a 1 record))
  (= record (record-put 'b 2 record))
  (assert-equal (record-entries record) [['a 1] ['b 2]]))

;; record-put has NO side effect:

(begin
  (= record [:a 0 :b 0])
  (record-put 'a 1 record)
  (record-put 'b 2 record)
  (assert-equal record [:a 0 :b 0]))

;; record-put! has side effect:

(begin
  (= record [:a 0 :b 0])
  (record-put! 'a 1 record)
  (record-put! 'b 2 record)
  (assert-equal record [:a 1 :b 2]))
