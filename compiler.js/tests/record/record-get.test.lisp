(assert-equal (record-get 'x [:x 1 :y 2]) 1)
(assert-equal (record-get 'y [:x 1 :y 2]) 2)
(assert-equal (record-get 'z [:x 1 :y 2]) null)
