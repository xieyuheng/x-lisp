(import-all "../function")
(import-all "../schema")
(import-all "record-select")

(assert-equal
  [:a 1 :b 2]
  (record-select (drop int-non-negative?) [:a 1 :b 2 :x -1 :y -2]))

(assert-equal
  [:a 1 :b 2]
  (record-select-value int-non-negative? [:a 1 :b 2 :x -1 :y -2]))

(assert-equal
  [:a 1 :b 2]
  (record-select-key (union (equal? 'a) (equal? 'b)) [:a 1 :b 2 :x -1 :y -2]))

(assert-equal
  [:x -1 :y -2]
  (record-reject (drop int-non-negative?) [:a 1 :b 2 :x -1 :y -2]))

(assert-equal
  [:x -1 :y -2]
  (record-reject-value int-non-negative? [:a 1 :b 2 :x -1 :y -2]))

(assert-equal
  [:x -1 :y -2]
  (record-reject-key (union (equal? 'a) (equal? 'b)) [:a 1 :b 2 :x -1 :y -2]))
