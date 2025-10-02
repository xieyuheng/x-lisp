(import-all "record-select-value")

(assert-equal
  [:a 1 :b 2]
  (record-select-value int-non-negative? [:a 1 :b 2 :x -1 :y -2]))

(assert-equal
  [:x -1 :y -2]
  (record-reject-value int-non-negative? [:a 1 :b 2 :x -1 :y -2]))
