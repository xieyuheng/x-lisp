(assert-equal
  (record-update [1 2 3 4 5 :x 1 :y 2 :z 0]
                 [:x 1 :z 3])
  [1 2 3 4 5 :x 1 :y 2 :z 3])

;; the list part of the second record is ignored:

(assert-equal
  (record-update [1 2 3 4 5 :x 1 :y 2 :z 0]
                 [0 :x 1 :z 3])
  [1 2 3 4 5 :x 1 :y 2 :z 3])
