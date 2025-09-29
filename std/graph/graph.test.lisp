(import-all "index.lisp")

(begin
  (= graph (make-graph []))

  (graph-add-vertex! 1 graph)
  (graph-add-vertex! 2 graph)
  (graph-add-vertex! 3 graph)

  (graph-add-edge! [1 2] graph)
  (graph-add-edge! [2 3] graph)
  (graph-add-edge! [3 1] graph)

  (assert-equal {1 2 3} (graph-vertices graph))

  (assert-equal {2 3} (graph-neighbors 1 graph))
  (assert-equal {1 3} (graph-neighbors 2 graph))
  (assert-equal {1 2} (graph-neighbors 3 graph))

  (assert (graph-adjacent? 1 2 graph))
  (assert (graph-adjacent? 2 1 graph))
  (assert (graph-adjacent? 2 3 graph))
  (assert (graph-adjacent? 3 2 graph))
  (assert (graph-adjacent? 1 3 graph))
  (assert (graph-adjacent? 3 1 graph))

  void)

(begin
  (= graph (make-graph [[1 2] [2 3] [3 1]]))

  (assert-equal {1 2 3} (graph-vertices graph))

  (assert-equal {2 3} (graph-neighbors 1 graph))
  (assert-equal {1 3} (graph-neighbors 2 graph))
  (assert-equal {1 2} (graph-neighbors 3 graph))

  (assert (graph-adjacent? 1 2 graph))
  (assert (graph-adjacent? 2 1 graph))
  (assert (graph-adjacent? 2 3 graph))
  (assert (graph-adjacent? 3 2 graph))
  (assert (graph-adjacent? 1 3 graph))
  (assert (graph-adjacent? 3 1 graph))

  void)
