(import-all "index")

(begin
  (= graph (make-graph []))

  (graph-add-edge! ["a" "b"] graph)
  (graph-add-edge! ["b" "c"] graph)
  (graph-add-edge! ["c" "d"] graph)
  (graph-add-edge! ["d" "a"] graph)

  (assert-equal
    (@hash "a" 0 "b" 1 "c" 0 "d" 1)
    (graph-coloring/dsatur graph)))
