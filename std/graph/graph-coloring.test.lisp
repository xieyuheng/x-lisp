(import-all "index")

(begin
  (= graph (make-empty-graph))

  (graph-add-edge! ["a" "b"] graph)
  (graph-add-edge! ["b" "c"] graph)
  (graph-add-edge! ["c" "d"] graph)
  (graph-add-edge! ["d" "a"] graph)

  (= coloring (@hash))
  (= vertices (graph-vertices graph))

  (assert-equal
    2
    (pipe graph
      (graph-coloring! coloring vertices)
      hash-values
      list-to-set
      set-size)))

(begin
  (= graph (make-empty-graph))

  (graph-add-edge! ["d" "e"] graph)

  (graph-add-edge! ["a" "b"] graph)
  (graph-add-edge! ["b" "c"] graph)
  (graph-add-edge! ["c" "a"] graph)

  (graph-add-edge! ["b" "c"] graph)
  (graph-add-edge! ["c" "d"] graph)
  (graph-add-edge! ["d" "b"] graph)

  (= coloring (@hash))
  (= vertices (graph-vertices graph))

  (assert-equal
    3
    (pipe graph
      (graph-coloring! coloring vertices)
      hash-values
      list-to-set
      set-size)))
