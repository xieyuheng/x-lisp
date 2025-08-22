(assert-equal (record-get [:x 1 :y 2] 'x) 1)
(assert-equal (record-get [:x 1 :y 2] 'y) 2)
(assert-equal (record-get [:x 1 :y 2] 'z) null)

(assert-equal (:x [:x 1 :y 2]) 1)
(assert-equal (:y [:x 1 :y 2]) 2)
(assert-equal (:z [:x 1 :y 2]) null)

(assert (record-has? [:x 1 :y 2] 'x))
(assert (record-has? [:x 1 :y 2] 'y))
(assert-not (record-has? [:x 1 :y 2] 'z))
(assert-not (record-has? [:x 1 :y 2 :z null] 'z))

(begin
  (= record [:x 0])
  (= record (record-set record 'x 1))
  (assert-equal (record-get record 'x) 1)
  (= record (record-set record 'y 2))
  (assert-equal (record-get record 'y) 2))
