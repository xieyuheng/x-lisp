[:x 1 :y 2 :z 3]

(assert (record? int? [:x 1 :y 2 :z 3]))
(assert (not (record? int? [:x 1 :y 2 :z 'a])))

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

(assert (not (record-empty? [:x 1 :y 2 :z 3])))
(assert (record-empty? [:x null :y null :z null]))
(assert (record-empty? [:x null]))
(assert (record-empty? []))

(assert (equal? (record-length [:x 1 :y 2 :z null]) 2))
(assert (equal? (record-length [:x 1 :y null :z null]) 1))
(assert (equal? (record-length [:x null :y null :z null]) 0))
