(assert-equal (record-delete 'x [:x 1 :y 2]) [:y 2])
(assert-equal (record-delete 'y [:x 1 :y 2]) [:x 1])
(assert-equal (record-delete 'z [:x 1 :y 2]) [:x 1 :y 2])

;; record-delete has NO side-effect:

(begin
  (= record [:x 1 :y 2])
  (record-delete 'x record)
  (record-delete 'y record)
  (assert-equal record [:x 1 :y 2]))

;; record-delete! has NO side-effect:

(begin
  (= record [:x 1 :y 2])
  (record-delete! 'x record)
  (record-delete! 'y record)
  (assert-equal record []))
