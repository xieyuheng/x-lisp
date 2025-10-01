(import-all "index")

(begin
  (= graph (make-graph []))

  (graph-add-edge! ["a" "b"] graph)
  (graph-add-edge! ["b" "c"] graph)
  (graph-add-edge! ["c" "d"] graph)
  (graph-add-edge! ["d" "a"] graph)

  (= coloring (@hash))
  (= vertices (set-to-list (graph-vertices graph)))
  (graph-coloring! coloring vertices graph)
  coloring

  ;; (assert-equal
  ;;   2
  ;;   (pipe graph
  ;;     graph-coloring!
  ;;     hash-values
  ;;     list-dedup
  ;;     list-length))
  )

(begin
  (= graph (make-graph []))

  (graph-add-edge! ["d" "e"] graph)

  (graph-add-edge! ["a" "b"] graph)
  (graph-add-edge! ["b" "c"] graph)
  (graph-add-edge! ["c" "a"] graph)

  (graph-add-edge! ["b" "c"] graph)
  (graph-add-edge! ["c" "d"] graph)
  (graph-add-edge! ["d" "b"] graph)


  (= coloring (@hash))
  (= vertices (set-to-list (graph-vertices graph)))
  (graph-coloring! coloring vertices graph)
  coloring

  ;; (assert-equal
  ;;   3
  ;;   (pipe graph
  ;;     graph-coloring!
  ;;     hash-values
  ;;     list-dedup
  ;;     list-length))
  )
