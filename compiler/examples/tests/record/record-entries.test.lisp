(assert-equal
  (record-keys [:x 1 :y 2 :z 3])
  ['x 'y 'z])

(assert-equal
  (record-values [:x 1 :y 2 :z 3])
  [1 2 3])

(assert-equal
  (record-entries [:x 1 :y 2 :z 3])
  [['x 1] ['y 2] ['z 3]])
