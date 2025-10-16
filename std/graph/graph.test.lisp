(import-all "graph")

(assert-equal
  (make-graph [] [])
  (make-empty-graph))

(assert-equal 0 (graph-vertex-count (make-empty-graph)))
(assert-equal 3 (graph-vertex-count (make-graph [1 2 3] [])))

(assert (graph-empty? (make-empty-graph)))

(assert-equal
  (make-graph [1 2 3] [])
  (begin
    (= graph (make-empty-graph))
    (graph-add-vertex! 1 graph)
    (graph-add-vertex! 2 graph)
    (graph-add-vertex! 3 graph)))

(assert-equal
  (make-graph [1 2 3] [])
  (begin
    (= graph (make-empty-graph))
    (graph-add-vertices! [1 2 3] graph)))

;; graph-vertices

(begin
  (= graph (make-graph [1 2 3] [[1 2] [2 3] [3 1]]))
  (assert-equal {1 2 3} (list-to-set (graph-vertices graph))))

;; graph-edges

(begin
  (= graph (make-graph [1 2 3] [[1 2] [2 3] [3 1]]))
  (assert
    (graph-equal-edges?
     [[1 2] [2 3] [3 1]]
     (graph-edges graph))))

(assert (graph-equal-edge? [1 2] [1 2]))
(assert (graph-equal-edge? [1 2] [2 1]))

(assert-equal 0 (graph-edge-count (make-empty-graph)))
(assert-equal 3 (graph-edge-count (make-graph [1 2 3] [[1 2] [2 3] [3 1]])))

;; graph-neighbors

(begin
  (= graph (make-graph [1 2 3] [[1 2] [2 3] [3 1]]))
  (assert-equal {2 3} (graph-neighbors 1 graph))
  (assert-equal {1 3} (graph-neighbors 2 graph))
  (assert-equal {1 2} (graph-neighbors 3 graph)))

;; graph-has-vertex?

(begin
  (= graph (make-graph [1 2 3] []))
  (assert (graph-has-vertex? 1 graph))
  (assert (graph-has-vertex? 2 graph))
  (assert (graph-has-vertex? 3 graph))
  (assert-not (graph-has-vertex? 4 graph)))

;; graph-adjacent?

(begin
  (= graph (make-graph [1 2 3] [[1 2] [2 3] [3 1]]))
  (assert (graph-adjacent? 1 2 graph))
  (assert (graph-adjacent? 2 1 graph))
  (assert (graph-adjacent? 2 3 graph))
  (assert (graph-adjacent? 3 2 graph))
  (assert (graph-adjacent? 1 3 graph))
  (assert (graph-adjacent? 3 1 graph)))

;; graph-has-edge?

(begin
  (= graph (make-graph [1 2 3] [[1 2] [2 3] [3 1]]))
  (assert (graph-has-edge? [1 2] graph))
  (assert (graph-has-edge? [2 1] graph))
  (assert (graph-has-edge? [2 3] graph))
  (assert (graph-has-edge? [3 2] graph))
  (assert (graph-has-edge? [1 3] graph))
  (assert (graph-has-edge? [3 1] graph)))

;; graph-degree

(begin
  (= graph (make-graph [1 2 3] [[1 2] [2 3] [3 1]]))
  (assert-equal 2 (graph-degree 1 graph))
  (assert-equal 2 (graph-degree 2 graph))
  (assert-equal 2 (graph-degree 3 graph))
  (assert-equal 2 (graph-max-degree graph)))

(begin
  (= graph (make-graph [1 2 3] [[1 2] [2 3]]))
  (assert-equal 1 (graph-degree 1 graph))
  (assert-equal 2 (graph-degree 2 graph))
  (assert-equal 1 (graph-degree 3 graph))
  (assert-equal 2 (graph-max-degree graph)))

;; graph-delete-edge!

(begin
  (= graph (make-graph [1 2 3] [[1 2] [2 3] [3 1]]))
  (graph-delete-edge! [3 1] graph)
  (assert-equal
    (make-graph [1 2 3] [[1 2] [2 3]])
    graph))

(begin
  (= graph (make-graph [1 2 3] [[1 2] [2 3] [3 1]]))
  (graph-delete-edge! [1 3] graph)
  (assert-equal
    (make-graph [1 2 3] [[1 2] [2 3]])
    graph))

(begin
  (= graph (make-graph [1 2 3] []))
  (graph-add-edge! [1 2] graph)
  (graph-add-edge! [2 3] graph)
  (graph-add-edge! [3 1] graph)
  (assert-not-equal graph (make-graph [1 2 3] []))
  (graph-delete-edge! [1 2] graph)
  (graph-delete-edge! [2 3] graph)
  (graph-delete-edge! [3 1] graph)
  (assert-equal graph (make-graph [1 2 3] [])))

;; graph-delete-vertex!

(begin
  (= graph (make-graph [1 2 3] [[1 2] [2 3] [3 1]]))
  (graph-delete-vertex! 1 graph)
  (assert-equal graph (make-graph [2 3] [[2 3]]))
  (graph-delete-vertex! 2 graph)
  (assert-equal graph (make-graph [3] []))
  (graph-delete-vertex! 3 graph)
  (assert-equal graph (make-graph [] [])))
