(assert-equal
  (record-filter [:a 1 :b 2 :x -1 :y -2] int-non-negative?)
  [:a 1 :b 2])
