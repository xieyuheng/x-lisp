(assert-equal (record-delete 'x [:x 1 :y 2]) [:y 2])
(assert-equal (record-delete 'y [:x 1 :y 2]) [:x 1])
(assert-equal (record-delete 'z [:x 1 :y 2]) [:x 1 :y 2])
