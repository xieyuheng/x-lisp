[:x 1 :y 2 :z 3]

(assert (equal? [:x 1 :y 2 :z [:x 1 :y 2]]
                [:x 1 :y 2 :z [:x 1 :y 2]]))

(assert (not (equal? [:x 1 :y 2 :z [:x 1 :y 2]]
                     [:x 1 :y 2 :z [:x 1 :y 3]])))

(assert (not (equal? [:x 1 :y 2 :z [:x 1 :y 2]]
                     [:x 1 :y 2 :z [:x 1 :y 2] :w 3])))

(assert (equal? (record-length [1 2 3 4 5 :x 1 :y 2 :z 3])
                3))

(assert (equal? (record-update [1 2 3 4 5 :x 1 :y 2 :z 0]
                               [:x 1 :z 3])
                [1 2 3 4 5 :x 1 :y 2 :z 3]))

;; the list part of the second record is ignored:
(assert (equal? (record-update [1 2 3 4 5 :x 1 :y 2 :z 0]
                               [0 :x 1 :z 3])
                [1 2 3 4 5 :x 1 :y 2 :z 3]))

(assert (equal? (record-of [1 2 3 4 5 :x 1 :y 2 :z 3])
                [:x 1 :y 2 :z 3]))
