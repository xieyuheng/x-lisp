(import-all "digraph")

(begin
  (= digraph (make-empty-digraph))
  (assert-equal [] (digraph-vertices digraph))
  (assert-equal 0 (digraph-vertex-count digraph))
  (assert (digraph-empty? digraph)))

(begin
  (= digraph (make-empty-digraph))
  (digraph-add-vertex! 1 digraph)
  (digraph-add-vertex! 2 digraph)
  (digraph-add-vertex! 3 digraph)
  (assert-equal [1 2 3] (digraph-vertices digraph))
  (assert-equal 3 (digraph-vertex-count digraph))
  (assert-not (digraph-empty? digraph)))

(begin
  (= digraph (make-empty-digraph))
  (digraph-add-vertices! [1 2 3] digraph)
  (assert-equal [1 2 3] (digraph-vertices digraph))
  (assert-equal 3 (digraph-vertex-count digraph))
  (assert-not (digraph-empty? digraph)))

(begin
  (= digraph (make-empty-digraph))
  (digraph-add-vertices! [1 2 3] digraph)
  (assert (digraph-has-vertex? 1 digraph))
  (assert (digraph-has-vertex? 2 digraph))
  (assert (digraph-has-vertex? 3 digraph))
  (assert-not (digraph-has-vertex? 4 digraph)))
