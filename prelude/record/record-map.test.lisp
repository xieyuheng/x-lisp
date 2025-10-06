(import-all "record-map")

(assert-equal
  [:xx 11 :yy 12 :zz 13]
  (record-map
   (lambda (k v) [(symbol-append k k) (iadd 10 v)])
   [:x 1 :y 2 :z 3]))

(assert-equal
  [:xx 1 :yy 2 :zz 3]
  (record-map-key
   (lambda (k) (symbol-append k k))
   [:x 1 :y 2 :z 3]))

(assert-equal
  [:x 11 :y 12 :z 13]
  (record-map-value (iadd 10) [:x 1 :y 2 :z 3]))
