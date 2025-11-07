(begin
  (= list [])
  (= list (list-push 1 list))
  (= list (list-push 2 list))
  (= list (list-push 3 list))
  (assert-equal list [1 2 3]))

;; list-push has NO side effect:

(begin
  (= list [])
  (list-push 1 list)
  (list-push 2 list)
  (list-push 3 list)
  (assert-equal list []))

;; list-push! has side effect:

(begin
  (= list [])
  (list-push! 1 list)
  (list-push! 2 list)
  (list-push! 3 list)
  (assert-equal list [1 2 3]))
