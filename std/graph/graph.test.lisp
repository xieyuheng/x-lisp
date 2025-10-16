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

;; graph-adjacent?

(begin
  (= graph (make-graph [1 2 3] [[1 2] [2 3] [3 1]]))
  (assert (graph-adjacent? 1 2 graph))
  (assert (graph-adjacent? 2 1 graph))
  (assert (graph-adjacent? 2 3 graph))
  (assert (graph-adjacent? 3 2 graph))
  (assert (graph-adjacent? 1 3 graph))
  (assert (graph-adjacent? 3 1 graph)))

;; graph-degree

(begin
  (= graph (make-graph [1 2 3] [[1 2] [2 3] [3 1]]))
  (assert-equal 2 (graph-degree 1 graph))
  (assert-equal 2 (graph-degree 2 graph))
  (assert-equal 2 (graph-degree 3 graph)))
