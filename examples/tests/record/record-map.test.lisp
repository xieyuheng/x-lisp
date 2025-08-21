(assert (equal? (record-map [:x 1 :y 2 :z 3] (iadd 10))
                [:x 11 :y 12 :z 13]))
