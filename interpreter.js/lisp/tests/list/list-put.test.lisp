(begin
  (= list [0 0 0])
  (= list (list-put 0 1 list))
  (= list (list-put 1 2 list))
  (= list (list-put 2 3 list))
  (assert-equal list [1 2 3]))

;; list-put has NO side effect:

(begin
  (= list [0 0 0])
  (list-put 0 1 list)
  (list-put 1 2 list)
  (list-put 2 3 list)
  (assert-equal list [0 0 0]))

;; list-put! has side effect:

(begin
  (= list [0 0 0])
  (list-put! 0 1 list)
  (list-put! 1 2 list)
  (list-put! 2 3 list)
  (assert-equal list [1 2 3]))
