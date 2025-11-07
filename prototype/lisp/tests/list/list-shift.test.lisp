(begin
  (= list [])
  (list-unshift! 3 list)
  (list-unshift! 2 list)
  (list-unshift! 1 list)
  (assert-equal list [1 2 3]))

(begin
  (= list [1 2 3])
  (assert-equal 1 (list-shift! list))
  (assert-equal 2 (list-shift! list))
  (assert-equal 3 (list-shift! list))
  (assert-equal list []))
