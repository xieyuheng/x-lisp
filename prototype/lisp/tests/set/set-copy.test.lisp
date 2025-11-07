(begin
  (= set {1 2 3})
  (= new-set (set-copy set))
  (assert-equal {1 2 3 4} (set-add! 4 set))
  (assert-equal {1 2 3 4} set)
  (assert-equal {1 2 3} new-set))
