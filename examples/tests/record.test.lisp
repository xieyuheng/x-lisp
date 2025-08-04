[:x 1 :y 2 :z 3]

(assert (equal? [:x 1 :y 2 :z [:x 1 :y 2]]
                [:x 1 :y 2 :z [:x 1 :y 2]]))

(assert (not (equal? [:x 1 :y 2 :z [:x 1 :y 2]]
                     [:x 1 :y 2 :z [:x 1 :y 3]])))

(assert (not (equal? [:x 1 :y 2 :z [:x 1 :y 2]]
                     [:x 1 :y 2 :z [:x 1 :y 2] :w 3])))
