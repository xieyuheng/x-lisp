(assert (record-has? 'x [:x 1 :y 2]))
(assert (record-has? 'y [:x 1 :y 2]))
(assert-not (record-has? 'z [:x 1 :y 2]))
(assert-not (record-has? 'z [:x 1 :y 2 :z null]))
