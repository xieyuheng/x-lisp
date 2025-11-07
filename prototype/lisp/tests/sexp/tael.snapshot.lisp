[1 2 3 :x 1 :y 2 :z 3]

(assert-equal
  [1 2 3 :x 1 :y 2 :z 3]
  [1 2 3 :x 1 :y 2 :z 3])

(assert-not-equal
  [1 2 3 :x 1 :y 2 :z 3]
  [1 2 :x 1 :y 2 :z 3])
