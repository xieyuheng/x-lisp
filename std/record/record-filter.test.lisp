(import-all "record-filter.lisp")

(assert-equal
  [:a 1 :b 2]
  (record-filter int-non-negative? [:a 1 :b 2 :x -1 :y -2]))
