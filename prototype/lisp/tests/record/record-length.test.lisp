(assert-equal (record-length [1 2 3 4 5 :x 1 :y 2 :z 3]) 3)

(assert-equal (record-length [:x 1 :y 2 :z null]) 2)
(assert-equal (record-length [:x 1 :y null :z null]) 1)
(assert-equal (record-length [:x null :y null :z null]) 0)
