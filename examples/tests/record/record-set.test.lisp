(begin
  (= record [:a 0])
  (assert-equal (record-get record 'a) 0)
  (= record (record-set record 'a 1))
  (assert-equal (record-get record 'a) 1)
  (= record (record-set record 'b 2))
  (assert-equal (record-get record 'b) 2))

;; about insertion order:

(begin
  (= record [])
  (= record (record-set record 'a 1))
  (= record (record-set record 'b 2))
  (assert-equal (record-entries record) [['a 1] ['b 2]]))
