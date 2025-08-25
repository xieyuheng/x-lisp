(begin
  (= record [:a 0])
  (assert-equal (record-get 'a record) 0)
  (= record (record-set 'a 1 record))
  (assert-equal (record-get 'a record) 1)
  (= record (record-set 'b 2 record))
  (assert-equal (record-get 'b record) 2))

;; about insertion order:

(begin
  (= record [])
  (= record (record-set 'a 1 record))
  (= record (record-set 'b 2 record))
  (assert-equal (record-entries record) [['a 1] ['b 2]]))
