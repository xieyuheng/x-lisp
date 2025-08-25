(import-all "record-filter.lisp")

(assert-equal
  (record-filter int-non-negative? [:a 1 :b 2 :x -1 :y -2])
  [:a 1 :b 2])
