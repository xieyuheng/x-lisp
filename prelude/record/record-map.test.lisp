(import-all "record-map")

(assert-equal
  [:xx 1 :yy 2 :zz 3]
  (record-map/key
   (lambda (key) (symbol-append key key))
   [:x 1 :y 2 :z 3]))

(assert-equal
  [:x 11 :y 12 :z 13]
  (record-map/value (iadd 10) [:x 1 :y 2 :z 3]))
