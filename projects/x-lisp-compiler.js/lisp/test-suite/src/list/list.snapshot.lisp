(define (main)
  (= list (make-list))
  (list-push! 1 list)
  (list-push! 2 list)
  (list-push! 3 list)
  (println list)

  (println [1 2 3])
  (println '(1 2 3))
  (println (@list 1 2 3))
  (println (@tael 1 2 3))

  (println ['a 'b 'c])
  (println '(a b c)))
