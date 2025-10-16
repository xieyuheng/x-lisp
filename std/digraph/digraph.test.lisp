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
  (digraph-add-edges! [[1 2] [1 3] [2 3] [3 1]] digraph)
  (assert-equal {2 3} (digraph-direct-successors 1 digraph))
  (assert-equal {3} (digraph-direct-successors 2 digraph))
  (assert-equal {1} (digraph-direct-successors 3 digraph))
  (assert-equal {3} (digraph-direct-predecessors 1 digraph))
  (assert-equal {1} (digraph-direct-predecessors 2 digraph))
  (assert-equal {1 2} (digraph-direct-predecessors 3  digraph)))

(begin
  (= digraph (make-digraph [1 2 3] [[1 2] [1 3] [2 3] [3 1]]))
  (assert-equal {2 3} (digraph-direct-successors 1 digraph))
  (assert-equal {3} (digraph-direct-successors 2 digraph))
  (assert-equal {1} (digraph-direct-successors 3 digraph))
  (assert-equal {3} (digraph-direct-predecessors 1 digraph))
  (assert-equal {1} (digraph-direct-predecessors 2 digraph))
  (assert-equal {1 2} (digraph-direct-predecessors 3  digraph)))

(begin
  (= digraph (make-digraph [1 2 3] [[1 2] [1 3] [2 3] [3 1]]))
  (assert (digraph-has-edge? [1 2] digraph))
  (assert (digraph-direct-predecessor? 1 2 digraph))
  (assert (digraph-direct-successor? 2 1 digraph))
  (assert-not (digraph-has-edge? [2 1] digraph))
  (assert-not (digraph-direct-predecessor? 2 1 digraph))
  (assert-not (digraph-direct-successor? 1 2 digraph)))

;; digraph-edges & digraph-edge-count

(begin
  (= digraph (make-digraph [1 2 3] [[1 2] [1 3] [2 3] [3 1]]))
  (assert-equal
    {[1 2] [1 3] [2 3] [3 1]}
    (list-to-set (digraph-edges digraph)))
  (assert-equal 4 (digraph-edge-count digraph)))

;; digraph-delete-edge!

(begin
  (= digraph (make-digraph [1 2 3] [[1 2] [1 3] [2 3] [3 1]]))
  (assert-equal
    (make-digraph [1 2 3] [[1 2] [2 3] [3 1]])
    (digraph-delete-edge! [1 3] digraph))
  (assert-equal
    (make-digraph [1 2 3] [[2 3] [3 1]])
    (digraph-delete-edge! [1 2] digraph))
  (assert-equal
    (make-digraph [1 2 3] [[3 1]])
    (digraph-delete-edge! [2 3] digraph))
  (assert-equal
    (make-digraph [1 2 3] [])
    (digraph-delete-edge! [3 1] digraph)))

;; digraph-delete-vertex!

(begin
  (= digraph (make-digraph [1 2 3] [[1 2] [1 3] [2 3] [3 1]]))
  (assert-equal
    (make-digraph [2 3] [[2 3]])
    (digraph-delete-vertex! 1 digraph))
  (assert-equal
    (make-digraph [3] [])
    (digraph-delete-vertex! 2 digraph))
  (assert-equal
    (make-digraph [] [])
    (digraph-delete-vertex! 3 digraph)))

;; digraph-in-degree & digraph-out-degree

(begin
  (= digraph (make-digraph [1 2 3] [[1 2] [1 3] [2 3] [3 1]]))
  (assert-equal 2 (digraph-out-degree 1 digraph))
  (assert-equal 1 (digraph-out-degree 2 digraph))
  (assert-equal 1 (digraph-out-degree 3 digraph))
  (assert-equal 1 (digraph-in-degree 1 digraph))
  (assert-equal 1 (digraph-in-degree 2 digraph))
  (assert-equal 2 (digraph-in-degree 3 digraph)))

;; digraph-predecessor? & digraph-successor?

(begin
  (= digraph (make-digraph [1 2 3] [[1 2] [2 3] [3 1]]))
  (assert (digraph-predecessor? 1 2 digraph))
  (assert (digraph-successor? 2 1 digraph))
  (assert (digraph-predecessor? 2 1 digraph)) ;; 2 -> 3 -> 1
  (assert (digraph-successor? 1 2 digraph))
  (assert (digraph-predecessor? 3 2 digraph)) ;; 3 -> 1 -> 2
  (assert (digraph-successor? 2 3 digraph)))

(begin
  (= digraph (make-digraph [1 2 3] [[1 2] [2 3]]))
  (assert (digraph-predecessor? 1 2 digraph))
  (assert (digraph-predecessor? 2 3 digraph))
  (assert (digraph-predecessor? 1 3 digraph))
  (assert-not (digraph-predecessor? 2 1 digraph))
  (assert-not (digraph-predecessor? 3 2 digraph))
  (assert-not (digraph-predecessor? 3 1 digraph)))
