(import-all "record-map-value")

(assert-equal
  [:x 11 :y 12 :z 13]
  (record-map-value (iadd 10) [:x 1 :y 2 :z 3]))
