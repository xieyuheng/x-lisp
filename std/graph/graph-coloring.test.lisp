(import-all "index")

(begin
  (= graph (make-graph []))

  (graph-add-edge! [1 2] graph)
  (graph-add-edge! [2 3] graph)
  (graph-add-edge! [3 1] graph)

  (graph-coloring/dsatur graph))
