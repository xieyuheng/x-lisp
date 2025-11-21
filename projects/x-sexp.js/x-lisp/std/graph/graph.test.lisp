(import-all "graph")

(assert-equal
  (make-graph [1 2 3] [])
  (begin
    (= graph (make-graph [] []))
    (graph-add-vertex! 1 graph)
    (graph-add-vertex! 2 graph)
    (graph-add-vertex! 3 graph)))

(assert-equal
  (make-graph [1 2 3] [])
  (begin
    (= graph (make-graph [] []))
    (graph-add-vertices! [1 2 3] graph)))

;; graph-vertices

(begin
  (= graph (make-graph [1 2 3] [[1 2] [2 3] [3 1]]))
  (assert-equal {1 2 3} (graph-vertices graph)))

;; graph-edges

(begin
  (= graph (make-graph [1 2 3] [[1 2] [2 3] [3 1]]))
  (assert-equal
    {{1 2} {2 3} {3 1}}
    (pipe (graph-edges graph)
      (set-map list-to-set))))

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

;; graph-vertex-degree

(begin
  (= graph (make-graph [1 2 3] [[1 2] [2 3] [3 1]]))
  (assert-equal 2 (graph-vertex-degree 1 graph))
  (assert-equal 2 (graph-vertex-degree 2 graph))
  (assert-equal 2 (graph-vertex-degree 3 graph)))
