(begin
  (= record [:a 0])
  (assert-equal (record-get 'a record) 0)
  (= record (record-set record 'a 1))
  (assert-equal (record-get 'a record) 1)
  (= record (record-set record 'b 2))
  (assert-equal (record-get 'b record) 2))

;; about insertion order:

(begin
  (= record [])
  (= record (record-set record 'a 1))
  (= record (record-set record 'b 2))
  (assert-equal (record-entries record) [['a 1] ['b 2]]))
