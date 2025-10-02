(import-all "record-update")

(assert-equal
  [:a 2 :b 2]
  (record-update 'a (iadd 1) [:a 1 :b 2]))

(assert-equal
  [:c 3]
  (record-update 'a (iadd 1) [:c 3]))

(begin
  (= record [:a 1 :b 2])
  (assert-equal [:a 2 :b 2] (record-update 'a (iadd 1) record))
  (assert-equal [:a 1 :b 2] record))

(begin
  (= record [:a 1 :b 2])
  (assert-equal [:a 2 :b 2] (record-update! 'a (iadd 1) record))
  (assert-equal [:a 2 :b 2] record))
