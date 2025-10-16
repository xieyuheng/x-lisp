(import-all "digraph")

(begin
  (= digraph (make-empty-digraph))
  (assert-equal [] (digraph-vertices digraph)))
