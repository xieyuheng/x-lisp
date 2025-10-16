(import-all "digraph")

(begin
  (= digraph (make-empty-digraph))
  (assert-equal [] (digraph-vertices digraph))
  (assert-equal 0 (digraph-vertex-count digraph)))
