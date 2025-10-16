(import-all "digraph")

;; about vertex

(begin
  (= digraph (make-empty-digraph))
  (assert-equal {} (list-to-set (digraph-vertices digraph)))
  (assert-equal 0 (digraph-vertex-count digraph))
  (assert (digraph-empty? digraph)))

(begin
  (= digraph (make-empty-digraph))
  (digraph-add-vertex! 1 digraph)
  (digraph-add-vertex! 2 digraph)
  (digraph-add-vertex! 3 digraph)
  (assert-equal {1 2 3} (list-to-set (digraph-vertices digraph)))
  (assert-equal 3 (digraph-vertex-count digraph))
  (assert-not (digraph-empty? digraph)))

(begin
  (= digraph (make-empty-digraph))
  (digraph-add-vertices! [1 2 3] digraph)
  (assert-equal {1 2 3} (list-to-set (digraph-vertices digraph)))
  (assert-equal 3 (digraph-vertex-count digraph))
  (assert-not (digraph-empty? digraph)))

(begin
  (= digraph (make-empty-digraph))
  (digraph-add-vertices! [1 2 3] digraph)
  (assert (digraph-has-vertex? 1 digraph))
  (assert (digraph-has-vertex? 2 digraph))
  (assert (digraph-has-vertex? 3 digraph))
  (assert-not (digraph-has-vertex? 4 digraph)))

;; about edge

(begin
  (= digraph (make-empty-digraph))
  (digraph-add-edge! [1 2] digraph)
  (digraph-add-edge! [1 3] digraph)
  (digraph-add-edge! [2 3] digraph)
  (digraph-add-edge! [3 1] digraph)
  (assert-equal {1 2 3} (list-to-set (digraph-vertices digraph))))

(begin
  (= digraph (make-empty-digraph))
  (digraph-add-edge! [1 2] digraph)
  (digraph-add-edge! [1 3] digraph)
  (digraph-add-edge! [2 3] digraph)
  (digraph-add-edge! [3 1] digraph)
  (assert-equal {2 3} (digraph-direct-successors 1 digraph))
  (assert-equal {3} (digraph-direct-successors 2 digraph))
  (assert-equal {1} (digraph-direct-successors 3 digraph))
  (assert-equal {3} (digraph-direct-predecessors 1 digraph))
  (assert-equal {1} (digraph-direct-predecessors 2 digraph))
  (assert-equal {1 2} (digraph-direct-predecessors 3  digraph)))

(begin
  (= digraph (make-empty-digraph))
  (digraph-add-edges! [[1 2] [1 3] [2 3] [3 1]] digraph)
  (assert-equal {2 3} (digraph-direct-successors 1 digraph))
  (assert-equal {3} (digraph-direct-successors 2 digraph))
  (assert-equal {1} (digraph-direct-successors 3 digraph))
  (assert-equal {3} (digraph-direct-predecessors 1 digraph))
  (assert-equal {1} (digraph-direct-predecessors 2 digraph))
  (assert-equal {1 2} (digraph-direct-predecessors 3  digraph)))

(begin
  (= digraph (make-empty-digraph))
  (digraph-add-edges! [[1 2] [1 3] [2 3] [3 1]] digraph)
  (assert (digraph-has-edge? [1 2] digraph))
  (assert-not (digraph-has-edge? [2 1] digraph)))
