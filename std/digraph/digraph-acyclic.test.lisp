(import-all "digraph")
(import-all "digraph-acyclic")

(define (example-digraph)
  ;; taken from:
  ;;   https://en.wikipedia.org/wiki/topological_sorting
  (make-digraph
   []
   [[5 11] [11 2]
    [7 8] [8 9]
    [3 10]
    [7 11] [3 8]
    [11 9] [11 10]]))

(begin
  (= digraph (example-digraph))
  (= vertices (digraph-vertices digraph))
  (assert-not (digraph-topological-ordered? vertices digraph)))

(begin
  (= digraph (example-digraph))
  (= vertices (digraph-topological-order digraph))
  (assert (digraph-topological-ordered? vertices digraph)))
