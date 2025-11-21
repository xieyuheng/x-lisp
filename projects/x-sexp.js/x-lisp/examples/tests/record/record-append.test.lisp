(assert-equal
  (record-append [:x 1 :y 2 :z 0]
                 [:x 1 :z 3])
  [:x 1 :y 2 :z 3])

;; the list parts are ignored:

(assert-equal
  (record-append [:x 1 :y 2 :z 0 1 2 3]
                 [0 :x 1 :z 3])
  [:x 1 :y 2 :z 3])
