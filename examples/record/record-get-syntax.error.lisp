(assert (equal? (:x [:x 1 :y 2]) 1))
(assert (equal? (:y [:x 1 :y 2]) 2))
(assert (equal? (:z [:x 1 :y 2]) null))

(:x [:x 1 :y 2] :y [:x 1 :y 2])
