(begin
  (= list [0 0 0])
  (list-set 0 1 list)
  (list-set 1 2 list)
  (list-set 2 3 list)
  (assert-equal list [0 0 0]))

(begin
  (= list [0 0 0])
  (= list (list-set 0 1 list))
  (= list (list-set 1 2 list))
  (= list (list-set 2 3 list))
  (assert-equal list [1 2 3]))

(begin
  (= list [0 0 0])
  (list-set! 0 1 list)
  (list-set! 1 2 list)
  (list-set! 2 3 list)
  (assert-equal list [1 2 3]))
