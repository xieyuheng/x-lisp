(begin
  (= list [1 2 3])
  (assert-equal 3 (list-pop! list))
  (assert-equal 2 (list-pop! list))
  (assert-equal 1 (list-pop! list))
  (assert-equal null (list-pop! list))
  (assert-equal list []))
