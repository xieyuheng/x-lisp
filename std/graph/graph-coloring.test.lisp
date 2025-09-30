(import-all "index")

(begin
  (= graph (make-graph []))

  (graph-add-edge! ["a" "b"] graph)
  (graph-add-edge! ["b" "c"] graph)
  (graph-add-edge! ["c" "d"] graph)
  (graph-add-edge! ["d" "a"] graph)

  (assert-equal
    2
    (pipe graph
      graph-coloring/dsatur
      hash-values
      list-dedup
      list-length)))

(begin
  (= graph (make-graph []))

  (graph-add-edge! ["d" "e"] graph)

  (graph-add-edge! ["a" "b"] graph)
  (graph-add-edge! ["b" "c"] graph)
  (graph-add-edge! ["c" "a"] graph)

  (graph-add-edge! ["b" "c"] graph)
  (graph-add-edge! ["c" "d"] graph)
  (graph-add-edge! ["d" "b"] graph)



  (assert-equal
    3
    (pipe graph
      graph-coloring/dsatur
      hash-values
      list-dedup
      list-length)))
