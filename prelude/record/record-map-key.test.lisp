(import-all "record-map-key")

(assert-equal
  [:xx 1 :yy 2 :zz 3]
  (record-map-key
   (lambda (key) (symbol-append key key))
   [:x 1 :y 2 :z 3]))
