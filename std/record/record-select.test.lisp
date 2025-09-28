(import-all "record-select.lisp")

(assert-equal
  [:a 1 :b 2]
  (record-select int-non-negative? [:a 1 :b 2 :x -1 :y -2]))

(assert-equal
  [:x -1 :y -2]
  (record-reject int-non-negative? [:a 1 :b 2 :x -1 :y -2]))
